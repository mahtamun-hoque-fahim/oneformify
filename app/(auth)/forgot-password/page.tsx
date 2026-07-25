'use client'
import { useState } from 'react'
import Link from 'next/link'
import { authClient } from '@/lib/auth/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await authClient.requestPasswordReset({
      email,
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/reset-password`,
    })
    if (err) {
      setError(err.message ?? 'Something went wrong')
      setLoading(false)
      return
    }
    setDone(true)
  }

  if (done) {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-surface border border-border rounded-xl p-8">
            <div className="w-12 h-12 rounded-full bg-info/10 border border-info/20 flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-info">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="22,6 12,13 2,6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="font-syne text-xl font-semibold text-text mb-2">Check your email</h2>
            <p className="text-text-muted text-sm">If an account exists for <span className="text-text font-medium">{email}</span>, a reset link is on its way.</p>
          </div>
          <p className="text-center text-sm text-text-muted mt-6">
            <Link href="/login" className="text-accent hover:text-accent-hover transition-colors font-medium">Back to sign in</Link>
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-syne text-3xl font-bold text-text mb-2">Reset your password</h1>
          <p className="text-text-muted text-sm">Enter your email and we will send a reset link</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-muted">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="bg-bg border border-border rounded-md px-3 py-2.5 text-text text-sm placeholder:text-text-faint focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgb(109_40_217_/_0.15)] transition-[border-color,box-shadow] duration-150"
              />
            </div>
            {error && (
              <p className="text-danger text-sm bg-danger/10 border border-danger/20 rounded-md px-3 py-2">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-accent text-white rounded-md py-2.5 text-sm font-semibold hover:bg-accent-hover transition-colors duration-150 active:scale-[0.97] active:scale-[0.97] active:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-text-muted mt-6">
          <Link href="/login" className="text-accent hover:text-accent-hover transition-colors font-medium">Back to sign in</Link>
        </p>
      </div>
    </main>
  )
}
