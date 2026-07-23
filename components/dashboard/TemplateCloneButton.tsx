'use client'
import { useTransition } from 'react'
import { createForm } from '@/lib/actions/forms'
import { updateFormFields } from '@/lib/actions/forms'

interface Template {
  id: string
  title: string
  fields: unknown[]
}

export default function TemplateCloneButton({ template }: { template: Template }) {
  const [isPending, startTransition] = useTransition()

  function handleClone() {
    startTransition(async () => {
      // createForm redirects to the new form — fields get set after redirect via builder
      // We store template fields in sessionStorage so builder can load them
      sessionStorage.setItem('template_fields', JSON.stringify(template.fields))
      sessionStorage.setItem('template_title', template.title)
      await createForm(template.title)
    })
  }

  return (
    <button
      onClick={handleClone}
      disabled={isPending}
      className="text-xs bg-accent-faint text-accent border border-accent/20 px-3 py-1.5 rounded-md hover:bg-accent hover:text-white transition-colors duration-150 disabled:opacity-50"
    >
      {isPending ? 'Creating...' : 'Use template'}
    </button>
  )
}
