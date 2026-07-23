import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getAuth } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { forms } from '@/lib/db/schema'
import { eq, isNull, count, and } from 'drizzle-orm'
import { isOverLimit, generateId, slugify } from '@/lib/utils'
import { DEFAULT_SETTINGS } from '@/lib/types/form'
import FormBuilder from '@/components/builder/FormBuilder'

// New form page: auto-creates a draft and opens the builder
export default async function NewFormPage() {
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  const db = getDb()

  const [{ value: activeForms }] = await db
    .select({ value: count() })
    .from(forms)
    .where(and(eq(forms.userId, session.user.id), isNull(forms.deletedAt)))

  const { overFormLimit } = isOverLimit(
    (session.user as { role?: string }).role ?? 'user',
    (session.user as { plan?: string }).plan ?? 'free',
    0,
    Number(activeForms)
  )

  if (overFormLimit) redirect('/dashboard/forms')

  // Create a blank draft
  const id = generateId()
  const title = 'Untitled form'
  const slug = `untitled-form-${id.slice(0, 6)}`

  await db.insert(forms).values({
    id,
    userId: session.user.id,
    title,
    slug,
    fields: [],
    settings: DEFAULT_SETTINGS,
    isPublished: false,
    responseCount: 0,
  })

  redirect(`/dashboard/forms/${id}`)
}
