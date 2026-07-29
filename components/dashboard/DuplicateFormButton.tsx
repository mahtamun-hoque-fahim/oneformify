'use client'
import { useTransition } from 'react'
import { Copy } from 'lucide-react'
import { duplicateForm } from '@/lib/actions/forms'

export default function DuplicateFormButton({ formId }: { formId: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDuplicate(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    startTransition(async () => {
      const result = await duplicateForm(formId)
      if (result?.error) alert(result.error)
      // on success: server action redirects to the new form
    })
  }

  return (
    <button
      onClick={handleDuplicate}
      disabled={isPending}
      title="Duplicate form"
      className="flex items-center gap-1 text-text-muted hover:text-text px-2 py-1 rounded text-xs transition-colors duration-150 disabled:opacity-50"
    >
      <Copy className="w-3 h-3" />
      {isPending ? 'Copying...' : 'Duplicate'}
    </button>
  )
}
