export const dynamic = 'force-dynamic'

import { headers } from 'next/headers'
import { getAuth } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { users, forms, responses } from '@/lib/db/schema'
import { count, isNull } from 'drizzle-orm'

export default async function AdminPage() {
  const db = getDb()
  const [[{ value: totalUsers }], [{ value: totalForms }], [{ value: totalResponses }]] =
    await Promise.all([
      db.select({ value: count() }).from(users),
      db.select({ value: count() }).from(forms).where(isNull(forms.deletedAt)),
      db.select({ value: count() }).from(responses).where(isNull(responses.deletedAt)),
    ])

  return (
    <div>
      <h1 className="font-syne text-3xl font-bold text-text mb-1">Platform overview</h1>
      <p className="text-text-muted text-sm mb-8">Admin-only view</p>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total users', value: totalUsers },
          { label: 'Total forms', value: totalForms },
          { label: 'Total responses', value: totalResponses },
        ].map(({ label, value }) => (
          <div key={label} className="bg-surface border border-border rounded-xl p-6">
            <p className="text-xs text-text-muted uppercase tracking-wide mb-1">{label}</p>
            <p className="font-syne text-4xl font-bold text-text">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
