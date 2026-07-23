'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth/client'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (!token) { setError('Invalid or expired reset link'); return }
    setLoading(true)
    const { error: err } = await authClient.resetPassword({ newPassword: password, token })
    if (err) { setError(err.message ?? 'Reset failed'); setLoading(false); return }
    setDone(true)
    setTimeout(() => router.push('/login'), 2000)
  }

  if (done) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className="font-syne text-xl font-semibold text-text mb-2">Password updated</h2>
        <p className="text-text-muted text-sm">Redirecting you to sign in...</p>
      </div>
    )
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-muted">New password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Min 8 characters" required minLength={8} autoComplete="new-password"
            className="bg-bg border border-border rounded-md px-3 py-2.5 text-text text-sm placeholder:text-text-faint focus:border-accent focus:outline-none transition-colors duration-150" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-muted">Confirm password</label>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
            placeholder="Repeat your password" required minLength={8} autoComplete="new-password"
            className="bg-bg border border-border rounded-md px-3 py-2.5 text-text text-sm placeholder:text-text-faint focus:border-accent focus:outline-none transition-colors duration-150" />
        </div>
        {error && <p className="text-danger text-sm bg-danger/10 border border-danger/20 rounded-md px-3 py-2">{error}</p>}
        <button type="submit" disabled={loading}
          className="bg-accent text-white rounded-md py-2.5 text-sm font-semibold hover:bg-accent-hover transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-syne text-3xl font-bold text-text mb-2">Set new password</h1>
          <p className="text-text-muted text-sm">Choose a strong password for your account</p>
        </div>
        <Suspense fallback={<div className="bg-surface border border-border rounded-xl p-8 text-text-muted text-sm">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
        <p className="text-center text-sm text-text-muted mt-6">
          <Link href="/login" className="text-accent hover:text-accent-hover transition-colors font-medium">Back to sign in</Link>
        </p>
      </div>
    </main>
  )
}
