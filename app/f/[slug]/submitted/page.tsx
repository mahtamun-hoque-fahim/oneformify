import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getDb } from '@/lib/db'
import { forms } from '@/lib/db/schema'
import { eq, isNull, and } from 'drizzle-orm'
import type { FormSettings } from '@/lib/types/form'
import { DEFAULT_SETTINGS } from '@/lib/types/form'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function SubmittedPage({ params }: Props) {
  const { slug } = await params
  const db = getDb()

  const [form] = await db.select({ title: forms.title, settings: forms.settings })
    .from(forms)
    .where(and(eq(forms.slug, slug), isNull(forms.deletedAt)))

  const settings: FormSettings = { ...DEFAULT_SETTINGS, ...(form?.settings as Partial<FormSettings> ?? {}) }

  // Bug fix: honour redirect URL if set by form creator
  if (settings.redirectUrl) {
    redirect(settings.redirectUrl)
  }

  const message = settings.thankYouMessage || 'Thank you for your response!'

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-surface border border-border rounded-xl p-10">
          <div className="w-28 h-28 mx-auto mb-6">
            <Image
              src="/images/success-05.png"
              alt=""
              width={112}
              height={112}
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="font-syne text-2xl font-bold text-text mb-3">{message}</h1>
          <p className="text-text-muted text-sm">Your response has been recorded.</p>
        </div>
        {/* Conversion CTA — every submitted page is a signup opportunity */}
        <div className="mt-6 bg-surface border border-border rounded-xl px-5 py-4 text-center">
          <p className="text-text text-sm font-medium mb-1">Want to build a form like this?</p>
          <p className="text-text-muted text-xs mb-3">Free. No credit card. Takes 2 minutes.</p>
          <Link
            href="/signup"
            className="inline-block bg-accent hover:bg-accent-hover text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors duration-150 active:scale-[0.97]"
          >
            Create your form free
          </Link>
        </div>
        <p className="text-text-faint text-xs mt-4">
          Made with{' '}
          <Link href="/" className="text-accent hover:text-accent-hover transition-colors">
            Formify
          </Link>
        </p>
      </div>
    </main>
  )
}
