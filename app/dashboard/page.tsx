import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import { getAuth } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { forms, responses } from '@/lib/db/schema'
import { eq, isNull, desc, count } from 'drizzle-orm'

export default async function DashboardPage() {
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const db = getDb()

  // Recent forms (last 5)
  const recentForms = await db
    .select()
    .from(forms)
    .where(eq(forms.userId, session.user.id))
    .orderBy(desc(forms.createdAt))
    .limit(5)

  // Total forms count
  const [{ value: totalForms }] = await db
    .select({ value: count() })
    .from(forms)
    .where(eq(forms.userId, session.user.id))

  // Total responses across all user forms
  const userFormIds = recentForms.map(f => f.id)
  const totalResponses = userFormIds.length > 0
    ? await db
        .select({ value: count() })
        .from(responses)
        .where(isNull(responses.deletedAt))
    : [{ value: 0 }]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-syne text-3xl font-bold text-text mb-1">
            Welcome back, {session.user.name.split(' ')[0]}
          </h1>
          <p className="text-text-muted text-sm">Here is what is happening with your forms</p>
        </div>
        <Link
          href="/dashboard/forms/new"
          className="bg-accent text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-accent-hover transition-colors duration-150"
        >
          New form
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-surface border border-border rounded-lg p-5">
          <p className="text-text-muted text-xs font-medium uppercase tracking-wide mb-1">Total forms</p>
          <p className="font-syne text-3xl font-bold text-text">{totalForms}</p>
        </div>
        <div className="bg-surface border border-border rounded-lg p-5">
          <p className="text-text-muted text-xs font-medium uppercase tracking-wide mb-1">Total responses</p>
          <p className="font-syne text-3xl font-bold text-text">{totalResponses[0]?.value ?? 0}</p>
        </div>
      </div>

      {/* Recent forms */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-syne text-lg font-semibold text-text">Recent forms</h2>
          <Link href="/dashboard/forms" className="text-sm text-accent hover:text-accent-hover transition-colors">
            View all
          </Link>
        </div>

        {recentForms.length === 0 ? (
          <div className="bg-surface border border-border rounded-lg p-12 text-center">
            <p className="text-text-muted text-sm mb-4">No forms yet. Create your first one.</p>
            <Link
              href="/dashboard/forms/new"
              className="bg-accent text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-accent-hover transition-colors duration-150 inline-block"
            >
              Create form
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {recentForms.map(form => (
              <Link
                key={form.id}
                href={`/dashboard/forms/${form.id}`}
                className="bg-surface border border-border rounded-lg px-5 py-4 flex items-center justify-between hover:border-accent/40 transition-colors duration-150 group"
              >
                <div>
                  <p className="text-text text-sm font-medium group-hover:text-accent transition-colors">{form.title}</p>
                  <p className="text-text-faint text-xs font-mono mt-0.5">/{form.slug}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-sm font-medium ${
                    form.isPublished
                      ? 'bg-success/10 text-success'
                      : 'bg-surface-elevated text-text-muted'
                  }`}>
                    {form.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-text-faint text-xs font-mono">{form.responseCount} resp</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
