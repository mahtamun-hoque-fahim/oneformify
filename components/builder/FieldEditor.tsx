'use client'
import { useState } from 'react'
import { Trash2, Plus, X } from 'lucide-react'
import type { FormField, ConditionalRule } from '@/lib/types/form'
import { FIELD_LABELS } from '@/lib/types/form'
import FieldIcon from './FieldIcon'

interface Props {
  field: FormField
  allFields: FormField[]
  onChange: (updated: FormField) => void
  onDelete: () => void
}

export default function FieldEditor({ field, allFields, onChange, onDelete }: Props) {
  const [newOption, setNewOption] = useState('')

  function update(patch: Partial<FormField>) {
    onChange({ ...field, ...patch })
  }

  function addOption() {
    if (!newOption.trim()) return
    update({ options: [...(field.options ?? []), newOption.trim()] })
    setNewOption('')
  }

  function removeOption(i: number) {
    update({ options: field.options?.filter((_, idx) => idx !== i) })
  }

  function updateOption(i: number, val: string) {
    const opts = [...(field.options ?? [])]
    opts[i] = val
    update({ options: opts })
  }

  function updateConditional(patch: Partial<ConditionalRule> | null) {
    if (patch === null) { update({ conditional: undefined }); return }
    update({ conditional: { ...field.conditional!, ...patch } })
  }

  const hasOptions = ['multiple_choice', 'checkbox', 'dropdown'].includes(field.type)
  const otherFields = allFields.filter(f => f.id !== field.id && f.type !== 'section_break')

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-text-muted">
          <FieldIcon type={field.type} className="w-4 h-4" />
          <span className="text-xs font-medium">{FIELD_LABELS[field.type]}</span>
        </div>
        <button onClick={onDelete} className="text-text-faint hover:text-danger transition-colors duration-150 p-1 rounded">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Label */}
      {field.type !== 'section_break' && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-muted">Label</label>
          <input
            value={field.label}
            onChange={e => update({ label: e.target.value })}
            placeholder="Question or field label"
            className="bg-bg border border-border rounded-md px-3 py-2 text-text text-sm placeholder:text-text-faint focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgb(109_40_217_/_0.15)] transition-[border-color,box-shadow] duration-150"
          />
        </div>
      )}

      {/* Section break title */}
      {field.type === 'section_break' && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-muted">Section title</label>
          <input
            value={field.label}
            onChange={e => update({ label: e.target.value })}
            placeholder="Section title (optional)"
            className="bg-bg border border-border rounded-md px-3 py-2 text-text text-sm placeholder:text-text-faint focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgb(109_40_217_/_0.15)] transition-[border-color,box-shadow] duration-150"
          />
        </div>
      )}

      {/* Description */}
      {field.type !== 'section_break' && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-muted">Description <span className="text-text-faint">(optional)</span></label>
          <input
            value={field.description ?? ''}
            onChange={e => update({ description: e.target.value })}
            placeholder="Helper text shown below the label"
            className="bg-bg border border-border rounded-md px-3 py-2 text-text text-sm placeholder:text-text-faint focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgb(109_40_217_/_0.15)] transition-[border-color,box-shadow] duration-150"
          />
        </div>
      )}

      {/* Placeholder */}
      {['short_text', 'long_text', 'dropdown'].includes(field.type) && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-muted">Placeholder</label>
          <input
            value={field.placeholder ?? ''}
            onChange={e => update({ placeholder: e.target.value })}
            placeholder="Placeholder text"
            className="bg-bg border border-border rounded-md px-3 py-2 text-text text-sm placeholder:text-text-faint focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgb(109_40_217_/_0.15)] transition-[border-color,box-shadow] duration-150"
          />
        </div>
      )}

      {/* Options */}
      {hasOptions && (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-text-muted">Options</label>
          {(field.options ?? []).map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={opt}
                onChange={e => updateOption(i, e.target.value)}
                className="flex-1 bg-bg border border-border rounded-md px-3 py-1.5 text-text text-sm focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgb(109_40_217_/_0.15)] transition-[border-color,box-shadow] duration-150"
              />
              <button onClick={() => removeOption(i)} className="text-text-faint hover:text-danger transition-colors duration-150">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <input
              value={newOption}
              onChange={e => setNewOption(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addOption()}
              placeholder="Add option..."
              className="flex-1 bg-bg border border-border border-dashed rounded-md px-3 py-1.5 text-text-muted text-sm focus:border-accent focus:outline-none focus:text-text transition-colors duration-150"
            />
            <button onClick={addOption} className="text-text-faint hover:text-accent transition-colors duration-150">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Rating max */}
      {field.type === 'rating' && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-muted">Max rating</label>
          <select
            value={field.maxRating ?? 5}
            onChange={e => update({ maxRating: Number(e.target.value) })}
            className="bg-bg border border-border rounded-md px-3 py-2 text-text text-sm focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgb(109_40_217_/_0.15)] transition-[border-color,box-shadow] duration-150"
          >
            {[3,4,5,7,10].map(n => <option key={n} value={n}>{n} stars</option>)}
          </select>
        </div>
      )}

      {/* File types */}
      {field.type === 'file_upload' && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-muted">Accepted file types</label>
          <input
            value={field.acceptedFileTypes ?? ''}
            onChange={e => update({ acceptedFileTypes: e.target.value })}
            placeholder="image/*,application/pdf"
            className="bg-bg border border-border rounded-md px-3 py-2 text-text text-sm placeholder:text-text-faint focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgb(109_40_217_/_0.15)] transition-[border-color,box-shadow] duration-150"
          />
          <p className="text-text-faint text-xs">Comma-separated MIME types</p>
        </div>
      )}

      {/* Required toggle */}
      {field.type !== 'section_break' && (
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => update({ required: !field.required })}
            className={`w-9 h-5 rounded-full transition-colors duration-200 flex items-center cursor-pointer ${
              field.required ? 'bg-accent' : 'bg-surface-elevated'
            }`}
          >
            <div className={`w-3.5 h-3.5 rounded-full bg-white shadow transition-transform duration-200 mx-[3px] ${
              field.required ? 'translate-x-4' : 'translate-x-0'
            }`} />
          </div>
          <span className="text-sm text-text-muted">Required</span>
        </label>
      )}

      {/* Conditional logic */}
      {otherFields.length > 0 && field.type !== 'section_break' && (
        <div className="flex flex-col gap-2 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-text-muted">Conditional logic</label>
            {field.conditional ? (
              <button onClick={() => updateConditional(null)} className="text-xs text-danger hover:text-danger/80 transition-colors">Remove</button>
            ) : (
              <button
                onClick={() => update({ conditional: { fieldId: otherFields[0].id, operator: 'equals', value: '', action: 'show' } })}
                className="text-xs text-accent hover:text-accent-hover transition-colors"
              >
                Add rule
              </button>
            )}
          </div>

          {field.conditional && (
            <div className="flex flex-col gap-2 bg-bg rounded-md p-3 border border-border">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-text-faint">If field</span>
                <select
                  value={field.conditional.fieldId}
                  onChange={e => updateConditional({ fieldId: e.target.value })}
                  className="bg-surface border border-border rounded px-2 py-1.5 text-text text-xs focus:border-accent focus:outline-none"
                >
                  {otherFields.map(f => <option key={f.id} value={f.id}>{f.label || 'Untitled field'}</option>)}
                </select>
              </div>
              <select
                value={field.conditional.operator}
                onChange={e => updateConditional({ operator: e.target.value as ConditionalRule['operator'] })}
                className="bg-surface border border-border rounded px-2 py-1.5 text-text text-xs focus:border-accent focus:outline-none"
              >
                <option value="equals">equals</option>
                <option value="not_equals">does not equal</option>
                <option value="contains">contains</option>
                <option value="is_empty">is empty</option>
                <option value="is_not_empty">is not empty</option>
              </select>
              {!['is_empty','is_not_empty'].includes(field.conditional.operator) && (
                <input
                  value={field.conditional.value ?? ''}
                  onChange={e => updateConditional({ value: e.target.value })}
                  placeholder="Value"
                  className="bg-surface border border-border rounded px-2 py-1.5 text-text text-xs focus:border-accent focus:outline-none"
                />
              )}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-text-faint">Then</span>
                <select
                  value={field.conditional.action}
                  onChange={e => updateConditional({ action: e.target.value as ConditionalRule['action'] })}
                  className="bg-surface border border-border rounded px-2 py-1.5 text-text text-xs focus:border-accent focus:outline-none"
                >
                  <option value="show">Show this field</option>
                  <option value="hide">Hide this field</option>
                  <option value="skip_to">Skip to field</option>
                </select>
              </div>
              {field.conditional.action === 'skip_to' && (
                <select
                  value={field.conditional.targetFieldId ?? ''}
                  onChange={e => updateConditional({ targetFieldId: e.target.value })}
                  className="bg-surface border border-border rounded px-2 py-1.5 text-text text-xs focus:border-accent focus:outline-none"
                >
                  <option value="">Select target field</option>
                  {otherFields.filter(f => f.id !== field.id).map(f => (
                    <option key={f.id} value={f.id}>{f.label || 'Untitled field'}</option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
