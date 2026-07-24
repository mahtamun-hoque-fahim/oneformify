import { getDb } from '@/lib/db'
import { forms, users } from '@/lib/db/schema'
import { isNull, desc, eq } from 'drizzle-orm'
import Link from 'next/link'

export default async function AdminFormsPage() {
  const db = getDb()
  const allForms = await db
    .select({
      id: forms.id,
      title: forms.title,
      slug: forms.slug,
      isPublished: forms.isPublished,
      responseCount: forms.responseCount,
      createdAt: forms.createdAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(forms)
    .leftJoin(users, eq(forms.userId, users.id))
    .where(isNull(forms.deletedAt))
    .orderBy(desc(forms.createdAt))

  return (
    <div>
      <h1 className="font-syne text-3xl font-bold text-text mb-1">All forms</h1>
      <p className="text-text-muted text-sm mb-8">{allForms.length} total</p>
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Title</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Owner</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Status</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Responses</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {allForms.map(form => (
              <tr key={form.id} className="border-b border-border last:border-b-0 hover:bg-surface-elevated/50 transition-colors">
                <td className="px-5 py-3">
                  <Link href={`/f/${form.slug}`} target="_blank" className="text-text hover:text-accent transition-colors font-medium">{form.title}</Link>
                  <p className="text-text-faint text-xs font-mono">/f/{form.slug}</p>
                </td>
                <td className="px-5 py-3">
                  <p className="text-text text-xs">{form.userName}</p>
                  <p className="text-text-faint text-xs">{form.userEmail}</p>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-sm ${form.isPublished ? 'bg-success/10 text-success' : 'bg-surface-elevated text-text-muted'}`}>
                    {form.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-5 py-3 text-text-muted text-xs font-mono">{form.responseCount}</td>
                <td className="px-5 py-3 text-text-faint text-xs font-mono">{new Date(form.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
