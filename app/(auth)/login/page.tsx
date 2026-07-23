'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from '@/lib/auth/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await signIn.email({ email, password })
    if (err) {
      setError(err.message ?? 'Sign in failed')
      setLoading(false)
      return
    }
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-syne text-3xl font-bold text-text mb-2">Welcome back</h1>
          <p className="text-text-muted text-sm">Sign in to your Formify account</p>
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
                className="bg-bg border border-border rounded-md px-3 py-2.5 text-text text-sm placeholder:text-text-faint focus:border-accent focus:outline-none transition-colors duration-150"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-muted">Password</label>
                <Link href="/forgot-password" className="text-xs text-accent hover:text-accent-hover transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="bg-bg border border-border rounded-md px-3 py-2.5 text-text text-sm placeholder:text-text-faint focus:border-accent focus:outline-none transition-colors duration-150"
              />
            </div>

            {error && (
              <p className="text-danger text-sm bg-danger/10 border border-danger/20 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-accent text-white rounded-md py-2.5 text-sm font-semibold hover:bg-accent-hover transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-text-muted mt-6">
          No account?{' '}
          <Link href="/signup" className="text-accent hover:text-accent-hover transition-colors font-medium">
            Create one
          </Link>
        </p>
      </div>
    </main>
  )
}
