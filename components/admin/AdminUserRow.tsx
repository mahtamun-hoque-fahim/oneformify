'use client'
import type { User } from '@/lib/db/schema'

export default function AdminUserRow({ user }: { user: User }) {
  return (
    <tr className="border-b border-border last:border-b-0 hover:bg-surface-elevated/50 transition-colors">
      <td className="px-5 py-3 text-text text-sm">{user.name}</td>
      <td className="px-5 py-3 text-text-muted text-sm">{user.email}</td>
      <td className="px-5 py-3">
        <span className={`text-xs px-2 py-0.5 rounded-sm font-medium ${
          user.role === 'admin' ? 'bg-danger/10 text-danger' : 'bg-surface-elevated text-text-muted'
        }`}>
          {user.role}
        </span>
      </td>
      <td className="px-5 py-3">
        <span className={`text-xs px-2 py-0.5 rounded-sm font-medium ${
          user.plan === 'pro' ? 'bg-accent-faint text-accent' :
          user.plan === 'team' ? 'bg-info/10 text-info' :
          'bg-surface-elevated text-text-muted'
        }`}>
          {user.plan}
        </span>
      </td>
      <td className="px-5 py-3 text-text-faint text-xs font-mono">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>
    </tr>
  )
}
