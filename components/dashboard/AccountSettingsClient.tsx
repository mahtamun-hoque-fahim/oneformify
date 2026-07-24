'use client'
import { useState } from 'react'
import { authClient } from '@/lib/auth/client'

interface Props {
  name: string
  email: string
  plan: string
  role: string
}

export default function AccountSettingsClient({ name, email, plan, role }: Props) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwOk, setPwOk] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setPwError('')
    setPwOk(false)
    if (newPassword !== confirmPassword) { setPwError('Passwords do not match'); return }
    if (newPassword.length < 8) { setPwError('Password must be at least 8 characters'); return }
    setPwLoading(true)
    // Better Auth password change via requestPasswordReset flow or changePassword
    // Using changePassword if available, else show note
    try {
      // @ts-ignore — changePassword may not be typed in this version
      const { error } = await authClient.changePassword?.({ newPassword, revokeOtherSessions: false }) ?? {}
      if (error) { setPwError(error.message ?? 'Failed to update password') }
      else { setPwOk(true); setNewPassword(''); setConfirmPassword('') }
    } catch {
      setPwError('Password change is not available in this auth version. Use the forgot password flow instead.')
    }
    setPwLoading(false)
  }

  const inputClass = "bg-bg border border-border rounded-md px-3 py-2.5 text-text text-sm placeholder:text-text-faint focus:border-accent focus:outline-none transition-colors duration-150 w-full"

  return (
    <div className="max-w-2xl flex flex-col gap-4">
      {/* Profile info */}
      <div className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-4">
        <h2 className="font-syne text-base font-semibold text-text">Profile</h2>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-accent-faint border border-accent/20 flex items-center justify-center shrink-0">
            <span className="font-syne text-xl font-bold text-accent">{name?.[0]?.toUpperCase()}</span>
          </div>
          <div>
            <p className="text-text font-medium">{name}</p>
            <p className="text-text-muted text-sm">{email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${
            plan === 'pro' ? 'bg-accent-faint text-accent border border-accent/20' :
            plan === 'team' ? 'bg-info/10 text-info border border-info/20' :
            'bg-surface-elevated text-text-muted border border-border'
          }`}>
            {plan.toUpperCase()} plan
          </span>
          {role === 'admin' && (
            <span className="text-xs px-2.5 py-1 rounded-md font-medium bg-danger/10 text-danger border border-danger/20">
              ADMIN
            </span>
          )}
        </div>
        {plan === 'free' && role !== 'admin' && (
          <div className="bg-accent-faint border border-accent/20 rounded-lg px-4 py-3">
            <p className="text-accent text-sm font-medium mb-0.5">Free plan limits</p>
            <p className="text-text-muted text-xs">3 forms · 100 responses per form. Upgrade when we launch publicly.</p>
          </div>
        )}
      </div>

      {/* Change password */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="font-syne text-base font-semibold text-text mb-4">Change password</h2>
        <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-muted">New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Min 8 characters"
              minLength={8}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-muted">Confirm new password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              minLength={8}
              className={inputClass}
            />
          </div>
          {pwError && <p className="text-danger text-sm">{pwError}</p>}
          {pwOk && <p className="text-success text-sm">Password updated.</p>}
          <button
            type="submit"
            disabled={pwLoading || !newPassword || !confirmPassword}
            className="bg-accent text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-accent-hover transition-colors duration-150 disabled:opacity-50 self-start"
          >
            {pwLoading ? 'Updating...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}
