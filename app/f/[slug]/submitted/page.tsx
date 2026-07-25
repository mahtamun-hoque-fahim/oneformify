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
          {/* IMAGE-BRIEF: success-05 | 1:1 | small success illustration — abstract celebration mark or check in bg-surface-elevated circle, accent violet glow, minimal flat vector, no text, 120x120px target, sits above the thank you headline */}
          <div
            data-image-slot="success-05"
            className="w-28 h-28 rounded-full border border-dashed border-white/10 bg-surface-elevated/60 mx-auto mb-6 flex items-center justify-center"
          >
            {/* Fallback until art is placed */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success opacity-40">
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
