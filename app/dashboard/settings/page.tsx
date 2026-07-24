import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getAuth } from '@/lib/auth'
import AccountSettingsClient from '@/components/dashboard/AccountSettingsClient'

export default async function AccountSettingsPage() {
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-syne text-3xl font-bold text-text mb-1">Account settings</h1>
        <p className="text-text-muted text-sm">Manage your profile and password</p>
      </div>
      <AccountSettingsClient
        name={session.user.name}
        email={session.user.email}
        plan={(session.user as { plan?: string }).plan ?? 'free'}
        role={(session.user as { role?: string }).role ?? 'user'}
      />
    </div>
  )
}
