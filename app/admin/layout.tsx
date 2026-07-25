import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getAuth } from '@/lib/auth'
import Link from 'next/link'
import Image from 'next/image'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (session.user.role !== 'admin') redirect('/dashboard')

  return (
    <div className="min-h-screen bg-bg flex">
      <aside className="w-60 bg-surface border-r border-border flex flex-col shrink-0 min-h-screen">
        <div className="p-6 border-b border-border">
          <Link href="/dashboard"><Image src="/logo.svg" alt="Formify" width={90} height={19} /></Link>
          <p className="text-xs font-mono text-danger mt-1">ADMIN PANEL</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1">
          <Link href="/admin" className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-text hover:bg-surface-elevated transition-colors">Overview</Link>
          <Link href="/admin/users" className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-text hover:bg-surface-elevated transition-colors">Users</Link>
          <Link href="/admin/forms" className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-text hover:bg-surface-elevated transition-colors">All forms</Link>
          <div className="border-t border-border my-2" />
          <Link href="/dashboard" className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-text hover:bg-surface-elevated transition-colors">Back to dashboard</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
