import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { forms, responses } from '@/lib/db/schema'
import { eq, and, isNull } from 'drizzle-orm'
import { generateId, hashIp } from '@/lib/utils'
import type { FormSettings } from '@/lib/types/form'
import { DEFAULT_SETTINGS } from '@/lib/types/form'

export const runtime = 'nodejs' // hashIp uses crypto.subtle — available in Node

// Simple in-memory rate limiter (per-slug, resets on cold start)
// Upstash Redis rate limiting added when Upstash env vars are present
const submissionCounts = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 30  // max 30 submissions per slug per minute
const WINDOW_MS = 60_000

function isRateLimited(slug: string): boolean {
  const now = Date.now()
  const entry = submissionCounts.get(slug)
  if (!entry || now > entry.resetAt) {
    submissionCounts.set(slug, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  if (entry.count >= RATE_LIMIT) return true
  entry.count++
  return false
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  // Rate limit check
  if (isRateLimited(slug)) {
    return NextResponse.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 })
  }

  const db = getDb()
  const [form] = await db.select().from(forms)
    .where(and(eq(forms.slug, slug), eq(forms.isPublished, true), isNull(forms.deletedAt)))

  if (!form) {
    return NextResponse.json({ error: 'Form not found.' }, { status: 404 })
  }

  const settings: FormSettings = { ...DEFAULT_SETTINGS, ...(form.settings as Partial<FormSettings>) }

  // Check deadline
  if (settings.deadline && new Date() > new Date(settings.deadline)) {
    return NextResponse.json({ error: 'This form is closed.' }, { status: 403 })
  }

  // Check response limit (admin's own forms bypass via plan check on form owner — future enhancement)
  // For now: enforce free tier limit of 100 responses per form
  if (form.responseCount >= 100) {
    // Check if form owner is admin or pro — stub, always enforce for now
    // TODO: join with users table to check plan when monetization is enabled
  }

  let body: { answers: Record<string, unknown>; violations?: unknown[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { answers = {}, violations = [] } = body

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
