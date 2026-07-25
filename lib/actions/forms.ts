'use server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { eq, and, isNull, desc, count } from 'drizzle-orm'

import { getAuth } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { forms } from '@/lib/db/schema'
import { generateId, slugify, isOverLimit } from '@/lib/utils'
import type { FormField, FormSettings } from '@/lib/types/form'
import { DEFAULT_SETTINGS } from '@/lib/types/form'

async function getSession() {
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  return session
}

// - Create form -
export async function createForm(title: string) {
  const session = await getSession()
  const db = getDb()

  // Plan limit check (admin always bypasses)
  const [{ value: activeForms }] = await db
    .select({ value: count() })
    .from(forms)
    .where(and(eq(forms.userId, session.user.id), isNull(forms.deletedAt)))

  const { overFormLimit } = isOverLimit(
    session.user.role ?? 'user',
    (session.user as { plan?: string }).plan ?? 'free',
    0,
    Number(activeForms)
  )

  if (overFormLimit) {
    return { error: 'You have reached the form limit for your plan.' }
  }

  const id = generateId()
  const slug = `${slugify(title)}-${id.slice(0, 6)}`

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

// - Update form fields -
export async function updateFormFields(formId: string, fields: FormField[]) {
  const session = await getSession()
  const db = getDb()

  const [form] = await db.select().from(forms)
    .where(and(eq(forms.id, formId), eq(forms.userId, session.user.id), isNull(forms.deletedAt)))

  if (!form) return { error: 'Form not found' }

  await db.update(forms)
    .set({ fields: fields as unknown as typeof forms.$inferInsert['fields'], updatedAt: new Date() })
    .where(eq(forms.id, formId))

  return { ok: true }
}

// - Update form settings -
export async function updateFormSettings(
  formId: string,
  data: Partial<{ title: string; slug: string; settings: FormSettings; isPublished: boolean }>
) {
  const session = await getSession()
  const db = getDb()

  const [form] = await db.select().from(forms)
    .where(and(eq(forms.id, formId), eq(forms.userId, session.user.id), isNull(forms.deletedAt)))

  if (!form) return { error: 'Form not found' }

  // Slug uniqueness check
  if (data.slug && data.slug !== form.slug) {
    const [existing] = await db.select({ id: forms.id }).from(forms)
      .where(and(eq(forms.slug, data.slug), isNull(forms.deletedAt)))
    if (existing) return { error: 'This URL slug is already taken. Choose a different one.' }
  }

  await db.update(forms)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(forms.id, formId))

  return { ok: true }
}

// - Soft-delete form -
export async function deleteForm(formId: string) {
  const session = await getSession()
  const db = getDb()

  await db.update(forms)
    .set({ deletedAt: new Date() })
    .where(and(eq(forms.id, formId), eq(forms.userId, session.user.id)))

  redirect('/dashboard/forms')
}

// - Get all user forms -
export async function getUserForms() {
  const session = await getSession()
  const db = getDb()

  return db.select().from(forms)
    .where(and(eq(forms.userId, session.user.id), isNull(forms.deletedAt)))
    .orderBy(desc(forms.updatedAt))
}

// - Get single form (owner only) -
export async function getFormById(formId: string) {
  const session = await getSession()
  const db = getDb()

  const [form] = await db.select().from(forms)
    .where(and(eq(forms.id, formId), eq(forms.userId, session.user.id), isNull(forms.deletedAt)))

  return form ?? null
}
