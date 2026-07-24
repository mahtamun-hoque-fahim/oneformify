import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getAuth } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { forms } from '@/lib/db/schema'
import { and, eq, isNull } from 'drizzle-orm'
import type { FormSettings } from '@/lib/types/form'
import { DEFAULT_SETTINGS } from '@/lib/types/form'
import FormSettingsClient from '@/components/dashboard/FormSettingsClient'
import Link from 'next/link'

export default async function FormSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const db = getDb()
  const [form] = await db.select().from(forms)
    .where(and(eq(forms.id, id), eq(forms.userId, session.user.id), isNull(forms.deletedAt)))
  if (!form) redirect('/dashboard/forms')

  const settings: FormSettings = { ...DEFAULT_SETTINGS, ...(form.settings as Partial<FormSettings>) }

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-text-muted mb-6">
        <Link href="/dashboard/forms" className="hover:text-text transition-colors">Forms</Link>
        <span>/</span>
        <Link href={`/dashboard/forms/${id}`} className="hover:text-text transition-colors truncate max-w-[200px]">{form.title}</Link>
        <span>/</span>
        <span className="text-text">Settings</span>
      </div>

      <div className="mb-8">
        <h1 className="font-syne text-3xl font-bold text-text mb-1">Form settings</h1>
        <p className="text-text-muted text-sm">{form.title}</p>
      </div>

      <FormSettingsClient
        formId={id}
        initialTitle={form.title}
        initialSlug={form.slug}
        initialSettings={settings}
        isPublished={form.isPublished}
      />
    </div>
  )
}
