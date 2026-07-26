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

  const title = form?.title ?? 'Form'
  const description = form?.description ?? `Fill in the ${title} form, powered by Formify.`
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://oneformify.vercel.app'

  return {
    title,
    description,
    alternates: { canonical: `/f/${slug}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/f/${slug}`,
      type: 'website',
    },
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

  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://oneformify.vercel.app'

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": form.title,
            "description": form.description ?? `Fill in the ${form.title} form, powered by Formify.`,
            "url": `${BASE_URL}/f/${form.slug}`,
            "isPartOf": { "@id": `${BASE_URL}/#website` }
          })
        }}
      />
      <FormFillClient
      formId={form.id}
      slug={form.slug}
      title={form.title}
      description={form.description}
      fields={form.fields as FormField[]}
      settings={settings}
    />
    </>
  )
}
