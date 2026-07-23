import Link from 'next/link'
import { getDb } from '@/lib/db'
import { forms } from '@/lib/db/schema'
import { eq, isNull, and } from 'drizzle-orm'
import type { FormSettings } from '@/lib/types/form'
import { DEFAULT_SETTINGS } from '@/lib/types/form'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function SubmittedPage({ params }: Props) {
  const { slug } = await params
  const db = getDb()

  const [form] = await db.select({ title: forms.title, settings: forms.settings })
    .from(forms)
    .where(and(eq(forms.slug, slug), isNull(forms.deletedAt)))

  const settings = { ...DEFAULT_SETTINGS, ...(form?.settings as Partial<FormSettings> ?? {}) }
  const message = settings.thankYouMessage || 'Thank you for your response!'

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-surface border border-border rounded-xl p-10">
          {/* Success icon */}
          <div className="w-16 h-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="font-syne text-2xl font-bold text-text mb-3">{message}</h1>
          <p className="text-text-muted text-sm">Your response has been recorded.</p>
        </div>
        <p className="text-text-faint text-xs mt-6">
          Built with{' '}
          <Link href="/" className="text-accent hover:text-accent-hover transition-colors">
            Formify
          </Link>
        </p>
      </div>
    </main>
  )
}
