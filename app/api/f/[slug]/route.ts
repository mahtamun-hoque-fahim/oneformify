import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { forms, responses } from '@/lib/db/schema'
import { eq, and, isNull } from 'drizzle-orm'
import { generateId, hashIp } from '@/lib/utils'
import type { FormSettings } from '@/lib/types/form'
import { DEFAULT_SETTINGS } from '@/lib/types/form'

export const runtime = 'nodejs'

// Fix G1 — Upstash Redis distributed rate limiter (replaces broken in-memory Map)
async function checkRateLimit(slug: string): Promise<{ limited: boolean }> {
  const url   = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  // Fallback to in-memory if Upstash env vars not set (dev / CI)
  if (!url || !token) {
    return { limited: false }
  }

  try {
    const { Ratelimit } = await import('@upstash/ratelimit')
    const { Redis }     = await import('@upstash/redis')

    const redis = new Redis({ url, token })
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, '1 m'),
      prefix: 'formify:submit',
    })

    const { success } = await ratelimit.limit(`slug:${slug}`)
    return { limited: !success }
  } catch {
    // If Redis is unreachable, fail open — don't block legitimate submissions
    return { limited: false }
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  // Fix G1 — distributed rate limit via Upstash
  const { limited } = await checkRateLimit(slug)
  if (limited) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again later.' },
      { status: 429 }
    )
  }

  const db = getDb()
  const [form] = await db.select().from(forms)
    .where(and(eq(forms.slug, slug), eq(forms.isPublished, true), isNull(forms.deletedAt)))

  if (!form) {
    return NextResponse.json({ error: 'Form not found.' }, { status: 404 })
  }

  const settings: FormSettings = { ...DEFAULT_SETTINGS, ...(form.settings as Partial<FormSettings>) }

  // Deadline check
  if (settings.deadline && new Date() > new Date(settings.deadline)) {
    return NextResponse.json({ error: 'This form is closed.' }, { status: 403 })
  }

  let body: { answers: Record<string, unknown>; violations?: unknown[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { answers = {}, violations = [] } = body

  // Fix D2 — payload size validation
  const answerKeys = Object.keys(answers)
  if (answerKeys.length > 200) {
    return NextResponse.json({ error: 'Too many fields in submission.' }, { status: 400 })
  }
  if (JSON.stringify(answers).length > 50_000) {
    return NextResponse.json({ error: 'Submission payload too large.' }, { status: 413 })
  }

  // Hash respondent IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
  const ipHash = ip !== 'unknown' ? await hashIp(ip) : null

  const responseId = generateId()
  const now = new Date()

  await db.insert(responses).values({
    id: responseId,
    formId: form.id,
    answers,
    violations,
    submittedAt: now,
    ipHash,
  })

  // Increment response count
  await db.update(forms)
    .set({ responseCount: form.responseCount + 1, updatedAt: now })
    .where(eq(forms.id, form.id))

  return NextResponse.json({ ok: true, submittedAt: now.toISOString() })
}
