'use client'
import { useState, useCallback, useTransition } from 'react'
import { Eye, EyeOff, Save, Share2, Settings } from 'lucide-react'
import type { FormField, FormSettings, FieldType } from '@/lib/types/form'
import { generateId } from '@/lib/utils'
import { updateFormFields, updateFormSettings } from '@/lib/actions/forms'
import FieldPalette from './FieldPalette'
import FieldPreviewCard from './FieldPreviewCard'
import FieldEditor from './FieldEditor'
import type { Form } from '@/lib/db/schema'

interface Props {
  form: Form
}

export default function FormBuilder({ form }: Props) {
  const [fields, setFields] = useState<FormField[]>(
    (form.fields as FormField[]) ?? []
  )
  const [settings] = useState<FormSettings>(form.settings as FormSettings)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [title, setTitle] = useState(form.title)
  const [isPublished, setIsPublished] = useState(form.isPublished)
  const [saved, setSaved] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [copyMsg, setCopyMsg] = useState('')

  const selectedField = fields.find(f => f.id === selectedId) ?? null

  function addField(type: FieldType) {
    const newField: FormField = {
      id: generateId(),
      type,
      label: '',
      required: false,
      options: ['multiple_choice', 'checkbox', 'dropdown'].includes(type) ? ['Option 1', 'Option 2'] : undefined,
      maxRating: type === 'rating' ? 5 : undefined,
    }
    setFields(prev => [...prev, newField])
    setSelectedId(newField.id)
    setSaved(false)
  }

  function updateField(id: string, updated: FormField) {
    setFields(prev => prev.map(f => f.id === id ? updated : f))
    setSaved(false)
  }

  function deleteField(id: string) {
    setFields(prev => prev.filter(f => f.id !== id))
    if (selectedId === id) setSelectedId(null)
    setSaved(false)
  }

  function moveField(id: string, dir: 'up' | 'down') {
    setFields(prev => {
      const idx = prev.findIndex(f => f.id === id)
      if (idx === -1) return prev
      const next = [...prev]
      const swap = dir === 'up' ? idx - 1 : idx + 1
      if (swap < 0 || swap >= next.length) return prev
      ;[next[idx], next[swap]] = [next[swap], next[idx]]
      return next
    })
    setSaved(false)
  }

  const handleSave = useCallback(() => {
    startTransition(async () => {
      await updateFormFields(form.id, fields)
      await updateFormSettings(form.id, { title })
      setSaved(true)
    })
  }, [fields, title, form.id])

  async function togglePublish() {
    const next = !isPublished
    setIsPublished(next)
    await updateFormSettings(form.id, { isPublished: next })
  }

  function copyLink() {
    const url = `${window.location.origin}/f/${form.slug}`
    navigator.clipboard.writeText(url)
    setCopyMsg('Copied!')
    setTimeout(() => setCopyMsg(''), 2000)
  }

  return (
    <div className="flex flex-col h-screen bg-bg">
      {/* Top bar */}
      <header className="flex items-center gap-4 px-4 py-3 bg-surface border-b border-border shrink-0">
        <a href="/dashboard/forms" className="text-text-muted hover:text-text transition-colors text-sm">
          ← Forms
        </a>
        <div className="flex-1">
          <input
            value={title}
            onChange={e => { setTitle(e.target.value); setSaved(false) }}
            className="bg-transparent text-text font-syne font-semibold text-lg focus:outline-none hover:text-text w-full max-w-sm"
            placeholder="Form title"
          />
        </div>
        <div className="flex items-center gap-2">
          {!saved && (
            <span className="text-text-faint text-xs">Unsaved changes</span>
          )}
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-1.5 bg-surface-elevated border border-border text-text-muted hover:text-text px-3 py-1.5 rounded-md text-sm transition-colors duration-150 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isPending ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 bg-surface-elevated border border-border text-text-muted hover:text-text px-3 py-1.5 rounded-md text-sm transition-colors duration-150"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copyMsg || 'Copy link'}
          </button>
          <a
            href={`/dashboard/forms/${form.id}/settings`}
            className="flex items-center gap-1.5 bg-surface-elevated border border-border text-text-muted hover:text-text px-3 py-1.5 rounded-md text-sm transition-colors duration-150"
          >
            <Settings className="w-3.5 h-3.5" />
            Settings
          </a>
          <button
            onClick={togglePublish}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${
              isPublished
                ? 'bg-success/10 border border-success/30 text-success hover:bg-danger/10 hover:border-danger/30 hover:text-danger'
                : 'bg-accent hover:bg-accent-hover text-white'
            }`}
          >
            {isPublished ? (
              <><Eye className="w-3.5 h-3.5" /> Published</>
            ) : (
              <><EyeOff className="w-3.5 h-3.5" /> Publish</>
            )}
          </button>
        </div>
      </header>

      {/* Three-panel layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left: field palette */}
        <FieldPalette onAdd={addField} />

        {/* Center: canvas */}
        <div
          className="flex-1 overflow-y-auto p-6"
          style={{
            backgroundImage: 'radial-gradient(circle, #1e1a30 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        >
          <div className="max-w-2xl mx-auto">
            {/* Form header preview */}
            <div className="bg-surface border border-border rounded-xl p-6 mb-4">
              <h2 className="font-syne text-xl font-semibold text-text mb-1">{title || 'Untitled form'}</h2>
              <p className="text-text-faint text-sm font-mono">/f/{form.slug}</p>
            </div>

            {/* Fields */}
            {fields.length === 0 ? (
              <div className="border-2 border-dashed border-border rounded-xl p-12 text-center">
                <p className="text-text-muted text-sm mb-1">No fields yet</p>
                <p className="text-text-faint text-xs">Click a field type on the left to add it</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {fields.map((field, idx) => (
                  <FieldPreviewCard
                    key={field.id}
                    field={field}
                    isSelected={selectedId === field.id}
                    onSelect={() => setSelectedId(field.id === selectedId ? null : field.id)}
                    onDelete={() => deleteField(field.id)}
                    onMoveUp={() => moveField(field.id, 'up')}
                    onMoveDown={() => moveField(field.id, 'down')}
                    isFirst={idx === 0}
                    isLast={idx === fields.length - 1}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: field editor */}
        <div className="w-72 bg-surface border-l border-border overflow-y-auto shrink-0">
          {selectedField ? (
            <div className="p-4">
              <FieldEditor
                field={selectedField}
                allFields={fields}
                onChange={updated => updateField(selectedField.id, updated)}
                onDelete={() => deleteField(selectedField.id)}
              />
            </div>
          ) : (
            <div className="p-6 text-center mt-12">
              <p className="text-text-faint text-sm">Select a field to edit it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
