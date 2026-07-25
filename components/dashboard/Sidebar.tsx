'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth/client'

const NAV = [
  { href: '/dashboard',            label: 'Overview' },
  { href: '/dashboard/forms',      label: 'Forms' },
  { href: '/dashboard/templates',  label: 'Templates' },
  { href: '/dashboard/analytics',  label: 'Analytics' },
  { href: '/dashboard/settings',   label: 'Settings' },
]

interface Props {
  user: { name: string; email: string; role?: string }
}

export default function DashboardSidebar({ user }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    router.push('/login')
  }

  return (
    <aside className="w-60 bg-surface border-r border-border flex flex-col shrink-0 min-h-screen">
      {/* Brand */}
      <div className="p-6 border-b border-border">
        <Link href="/dashboard">
          <Image src="/logo.svg" alt="Formify" width={90} height={19} />
        </Link>
        {user.role === 'admin' && (
          <span className="ml-2 text-xs font-mono text-danger">ADMIN</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {NAV.map(({ href, label }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`px-3 py-2 rounded-md text-sm transition-colors duration-150 ${
                active
                  ? 'bg-accent-faint text-accent font-medium'
                  : 'text-text-muted hover:text-text hover:bg-surface-elevated'
              }`}
            >
              {label}
            </Link>
          )
        })}

        {user.role === 'admin' && (
          <>
            <div className="border-t border-border my-2" />
            <Link
              href="/admin"
              className={`px-3 py-2 rounded-md text-sm transition-colors duration-150 ${
                pathname.startsWith('/admin')
                  ? 'bg-danger/10 text-danger font-medium'
                  : 'text-text-muted hover:text-text hover:bg-surface-elevated'
              }`}
            >
              Admin panel
            </Link>
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-accent-faint border border-accent/20 flex items-center justify-center shrink-0">
            <span className="text-accent text-xs font-semibold font-syne">
              {user.name?.[0]?.toUpperCase() ?? '?'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-text text-sm font-medium truncate">{user.name}</p>
            <p className="text-text-faint text-xs truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full text-left px-3 py-2 rounded-md text-sm text-text-muted hover:text-danger hover:bg-danger/10 transition-colors duration-150"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
