import { notFound } from 'next/navigation'
import { getDb } from '@/lib/db'
import { forms } from '@/lib/db/schema'
import { eq, isNull, and } from 'drizzle-orm'
import type { FormField, FormSettings } from '@/lib/types/form'
import { DEFAULT_SETTINGS } from '@/lib/types/form'
import FormFillClient from '@/components/fill/FormFillClient'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const db = getDb()
  const [form] = await db.select({ title: forms.title, description: forms.description })
    .from(forms)
    .where(and(eq(forms.slug, slug), eq(forms.isPublished, true), isNull(forms.deletedAt)))
  return {
    title: form?.title ?? 'Form',
    description: form?.description ?? undefined,
  }
}

export default async function FormFillPage({ params }: Props) {
  const { slug } = await params
  const db = getDb()

  const [form] = await db.select().from(forms)
    .where(and(eq(forms.slug, slug), eq(forms.isPublished, true), isNull(forms.deletedAt)))

  if (!form) notFound()

  // Check deadline
  const settings = { ...DEFAULT_SETTINGS, ...(form.settings as Partial<FormSettings>) }
  if (settings.deadline) {
    const deadline = new Date(settings.deadline)
    if (new Date() > deadline) {
      return (
        <main className="min-h-screen bg-bg flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl p-8 max-w-md text-center">
            <h1 className="font-syne text-xl font-semibold text-text mb-2">This form is closed</h1>
            <p className="text-text-muted text-sm">The submission deadline has passed.</p>
          </div>
        </main>
      )
    }
  }

  return (
    <FormFillClient
      formId={form.id}
      slug={form.slug}
      title={form.title}
      description={form.description}
      fields={form.fields as FormField[]}
      settings={settings}
    />
  )
}
