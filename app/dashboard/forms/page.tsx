import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import { getAuth } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { forms } from '@/lib/db/schema'
import { eq, isNull, desc } from 'drizzle-orm'
import CreateFormButton from '@/components/dashboard/CreateFormButton'
import DuplicateFormButton from '@/components/dashboard/DuplicateFormButton'

export default async function FormsPage() {
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const db = getDb()
  const allForms = await db.select().from(forms)
    .where(eq(forms.userId, session.user.id))
    .orderBy(desc(forms.updatedAt))

  const activeForms = allForms.filter(f => !f.deletedAt)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-syne text-3xl font-bold text-text mb-1">Forms</h1>
          <p className="text-text-muted text-sm">{activeForms.length} form{activeForms.length !== 1 ? 's' : ''}</p>
        </div>
        <CreateFormButton />
      </div>

      {activeForms.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent-faint border border-accent/20 flex items-center justify-center mx-auto mb-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="18" x2="12" y2="12" strokeLinecap="round"/>
              <line x1="9" y1="15" x2="15" y2="15" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="font-syne text-xl font-semibold text-text mb-2">No forms yet</h2>
          <p className="text-text-muted text-sm mb-6">Create your first form and start collecting responses.</p>
          <CreateFormButton />
        </div>
      ) : (
        <div className="grid gap-3">
          {activeForms.map(form => (
            <div key={form.id} className="bg-surface border border-border rounded-lg px-5 py-4 flex items-center justify-between hover:border-accent/30 hover:-translate-y-px hover:shadow-md transition-[transform,border-color,box-shadow] duration-150 ease-out group">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <Link href={`/dashboard/forms/${form.id}`} className="text-text text-sm font-medium hover:text-accent transition-colors truncate">
                    {form.title}
                  </Link>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-sm font-medium ${
                    form.isPublished ? 'bg-success/10 text-success' : 'bg-surface-elevated text-text-muted'
                  }`}>
                    {form.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-text-faint text-xs font-mono">oneformify.app/f/{form.slug}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0 ml-4">
                <span className="text-text-muted text-xs font-mono">{form.responseCount} resp</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <Link href={`/dashboard/forms/${form.id}`}
                    className="text-text-muted hover:text-text px-2 py-1 rounded text-xs transition-colors">
                    Edit
                  </Link>
                  <Link href={`/dashboard/forms/${form.id}/responses`}
                    className="text-text-muted hover:text-text px-2 py-1 rounded text-xs transition-colors">
                    Responses
                  </Link>
                  <DuplicateFormButton formId={form.id} />
                  <a href={`/f/${form.slug}`} target="_blank" rel="noopener noreferrer"
                    className="text-text-muted hover:text-accent px-2 py-1 rounded text-xs transition-colors">
                    Preview
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
