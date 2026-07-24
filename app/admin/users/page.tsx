import { getDb } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import AdminUserRow from '@/components/admin/AdminUserRow'

export default async function AdminUsersPage() {
  const db = getDb()
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt))

  return (
    <div>
      <h1 className="font-syne text-3xl font-bold text-text mb-1">Users</h1>
      <p className="text-text-muted text-sm mb-8">{allUsers.length} total</p>
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Name</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Email</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Role</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Plan</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map(user => (
              <AdminUserRow key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
