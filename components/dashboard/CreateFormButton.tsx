'use client'
import { useState } from 'react'
import { createForm } from '@/lib/actions/forms'

export default function CreateFormButton() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCreate() {
    if (!title.trim()) return
    setLoading(true)
    setError('')
    const result = await createForm(title.trim())
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
    // on success: server action redirects to /dashboard/forms/[id]
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="bg-accent text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-accent-hover transition-colors duration-150"
      >
        New form
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-bg/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-elevated border border-border rounded-xl p-6 w-full max-w-sm shadow-lg">
        <h2 className="font-syne text-lg font-semibold text-text mb-4">Name your form</h2>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          placeholder="e.g. Customer feedback survey"
          autoFocus
          className="bg-bg border border-border rounded-md px-3 py-2.5 text-text text-sm placeholder:text-text-faint focus:border-accent focus:outline-none transition-colors duration-150 w-full mb-3"
        />
        {error && (
          <p className="text-danger text-xs mb-3">{error}</p>
        )}
        <div className="flex gap-2">
          <button
            onClick={handleCreate}
            disabled={loading || !title.trim()}
            className="flex-1 bg-accent text-white rounded-md py-2 text-sm font-semibold hover:bg-accent-hover transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create form'}
          </button>
          <button
            onClick={() => { setOpen(false); setTitle(''); setError('') }}
            className="px-4 py-2 rounded-md text-sm text-text-muted hover:text-text hover:bg-surface transition-colors duration-150"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
