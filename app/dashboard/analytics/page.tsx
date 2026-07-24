import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getAuth } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { forms, responses } from '@/lib/db/schema'
import { eq, isNull, and, desc, gte, count, sum } from 'drizzle-orm'
import Link from 'next/link'

export default async function AnalyticsPage() {
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const db = getDb()

  // All user forms
  const allForms = await db.select().from(forms)
    .where(and(eq(forms.userId, session.user.id), isNull(forms.deletedAt)))
    .orderBy(desc(forms.responseCount))

  const totalForms = allForms.length
  const publishedForms = allForms.filter(f => f.isPublished).length
  const totalResponses = allForms.reduce((acc, f) => acc + (f.responseCount ?? 0), 0)

  // Responses in last 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const recentCount = await db
    .select({ value: count() })
    .from(responses)
    .where(gte(responses.submittedAt, sevenDaysAgo))

  const recentResponses = Number(recentCount[0]?.value ?? 0)

  // Top 5 forms by response count
  const topForms = allForms.slice(0, 5)

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-syne text-3xl font-bold text-text mb-1">Analytics</h1>
        <p className="text-text-muted text-sm">Overview across all your forms</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
        {[
          { label: 'Total forms', value: totalForms },
          { label: 'Published', value: publishedForms },
          { label: 'Total responses', value: totalResponses },
          { label: 'Last 7 days', value: recentResponses },
        ].map(({ label, value }) => (
          <div key={label} className="bg-surface border border-border rounded-xl p-5">
            <p className="text-xs text-text-muted uppercase tracking-wide mb-1">{label}</p>
            <p className="font-syne text-3xl font-bold text-text">{value}</p>
          </div>
        ))}
      </div>

      {/* Top forms */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-syne text-base font-semibold text-text">Top forms by responses</h2>
        </div>
        {topForms.length === 0 ? (
          <div className="p-10 text-center text-text-muted text-sm">
            No forms yet. <Link href="/dashboard/forms/new" className="text-accent hover:text-accent-hover transition-colors">Create one</Link>
          </div>
        ) : (
          <div>
            {topForms.map((form, i) => {
              const pct = totalResponses > 0
                ? Math.round((form.responseCount / totalResponses) * 100)
                : 0
              return (
                <div key={form.id} className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-b-0 hover:bg-surface-elevated/50 transition-colors">
                  <span className="text-text-faint text-xs font-mono w-4 shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Link href={`/dashboard/forms/${form.id}/responses`} className="text-text text-sm font-medium hover:text-accent transition-colors truncate">
                        {form.title}
                      </Link>
                      <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded-sm ${
                        form.isPublished ? 'bg-success/10 text-success' : 'bg-surface-elevated text-text-muted'
                      }`}>
                        {form.isPublished ? 'Live' : 'Draft'}
                      </span>
                    </div>
                    <div className="w-full bg-surface-elevated rounded-full h-1">
                      <div
                        className="bg-accent h-1 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-text-muted text-sm font-mono shrink-0 w-16 text-right">
                    {form.responseCount} resp
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
