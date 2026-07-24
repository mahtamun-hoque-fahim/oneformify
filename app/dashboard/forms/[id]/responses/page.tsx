import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getAuth } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { forms, responses } from '@/lib/db/schema'
import { and, eq, isNull, desc } from 'drizzle-orm'
import type { FormField } from '@/lib/types/form'
import Link from 'next/link'
import ResponsesClient from '@/components/responses/ResponsesClient'

export default async function ResponsesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const db = getDb()
  const [form] = await db.select().from(forms)
    .where(and(eq(forms.id, id), eq(forms.userId, session.user.id), isNull(forms.deletedAt)))
  if (!form) redirect('/dashboard/forms')

  const allResponses = await db.select().from(responses)
    .where(and(eq(responses.formId, id), isNull(responses.deletedAt)))
    .orderBy(desc(responses.submittedAt))

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted mb-6">
        <Link href="/dashboard/forms" className="hover:text-text transition-colors">Forms</Link>
        <span>/</span>
        <Link href={`/dashboard/forms/${id}`} className="hover:text-text transition-colors truncate max-w-[200px]">{form.title}</Link>
        <span>/</span>
        <span className="text-text">Responses</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-syne text-3xl font-bold text-text mb-1">Responses</h1>
          <p className="text-text-muted text-sm">{form.title}</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/f/${form.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-text-muted hover:text-accent transition-colors border border-border px-3 py-2 rounded-md bg-surface"
          >
            View form
          </a>
          <Link
            href={`/dashboard/forms/${id}`}
            className="text-sm text-text-muted hover:text-text transition-colors border border-border px-3 py-2 rounded-md bg-surface"
          >
            Edit form
          </Link>
        </div>
      </div>

      <ResponsesClient
        formId={id}
        slug={form.slug}
        fields={form.fields as FormField[]}
        responses={allResponses.map(r => ({
          id: r.id,
          answers: r.answers as Record<string, unknown>,
          violations: (r.violations as unknown[]) ?? [],
          submittedAt: r.submittedAt,
        }))}
      />
    </div>
  )
}
