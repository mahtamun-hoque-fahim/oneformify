'use client'
import { GripVertical, Trash2 } from 'lucide-react'
import type { FormField } from '@/lib/types/form'
import { FIELD_LABELS } from '@/lib/types/form'
import FieldIcon from './FieldIcon'

interface Props {
  field: FormField
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}

export default function FieldPreviewCard({
  field, isSelected, onSelect, onDelete, onMoveUp, onMoveDown, isFirst, isLast
}: Props) {
  if (field.type === 'section_break') {
    return (
      <div
        onClick={onSelect}
        className={`group relative flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-all duration-150 ${
          isSelected ? 'border-accent bg-accent-faint' : 'border-border bg-surface hover:border-accent/40'
        }`}
      >
        <GripVertical className="w-4 h-4 text-text-faint" />
        <div className="flex-1 border-t border-border" />
        {field.label && <span className="text-xs text-text-muted px-2">{field.label}</span>}
        <div className="flex-1 border-t border-border" />
        <button onClick={e => { e.stopPropagation(); onDelete() }} className="text-text-faint hover:text-danger transition-colors opacity-0 group-hover:opacity-100">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-lg border px-4 py-3 cursor-pointer transition-all duration-150 ${
        isSelected ? 'border-accent bg-accent-faint shadow-glow' : 'border-border bg-surface hover:border-accent/40'
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <GripVertical className="w-4 h-4 text-text-faint shrink-0" />
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <FieldIcon type={field.type} className="w-3.5 h-3.5 text-text-faint shrink-0" />
          <span className="text-text text-sm font-medium truncate">
            {field.label || <span className="text-text-faint italic">Untitled {FIELD_LABELS[field.type]}</span>}
            {field.required && <span className="text-danger ml-1">*</span>}
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button onClick={e => { e.stopPropagation(); onMoveUp() }} disabled={isFirst}
            className="text-text-faint hover:text-text disabled:opacity-20 px-1 text-xs transition-colors">
            ↑
          </button>
          <button onClick={e => { e.stopPropagation(); onMoveDown() }} disabled={isLast}
            className="text-text-faint hover:text-text disabled:opacity-20 px-1 text-xs transition-colors">
            ↓
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete() }}
            className="text-text-faint hover:text-danger transition-colors p-1">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mini-preview of field input */}
      <div className="ml-7">
        {field.description && (
          <p className="text-text-faint text-xs mb-1.5">{field.description}</p>
        )}
        {field.type === 'short_text' && (
          <div className="bg-bg border border-border rounded px-2 py-1.5 text-text-faint text-xs">{field.placeholder || 'Short answer'}</div>
        )}
        {field.type === 'long_text' && (
          <div className="bg-bg border border-border rounded px-2 py-2 text-text-faint text-xs h-12">{field.placeholder || 'Long answer'}</div>
        )}
        {field.type === 'date' && (
          <div className="bg-bg border border-border rounded px-2 py-1.5 text-text-faint text-xs w-32">MM / DD / YYYY</div>
        )}
        {field.type === 'rating' && (
          <div className="flex gap-1">
            {Array.from({ length: field.maxRating ?? 5 }).map((_, i) => (
              <span key={i} className="text-text-faint text-sm">☆</span>
            ))}
          </div>
        )}
        {['multiple_choice', 'checkbox'].includes(field.type) && (field.options ?? []).slice(0, 3).map((opt, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <div className={`w-3 h-3 border border-border shrink-0 ${field.type === 'checkbox' ? 'rounded-sm' : 'rounded-full'}`} />
            <span className="text-text-faint text-xs">{opt}</span>
          </div>
        ))}
        {field.type === 'dropdown' && (
          <div className="bg-bg border border-border rounded px-2 py-1.5 text-text-faint text-xs flex items-center justify-between w-40">
            <span>{field.placeholder || 'Select an option'}</span>
            <span className="text-text-faint">▾</span>
          </div>
        )}
        {field.type === 'file_upload' && (
          <div className="bg-bg border border-border border-dashed rounded px-3 py-2 text-text-faint text-xs text-center">
            Click to upload
          </div>
        )}
      </div>

      {/* Conditional badge */}
      {field.conditional && (
        <div className="mt-2 ml-7">
          <span className="text-xs bg-info/10 text-info px-1.5 py-0.5 rounded-sm">Conditional</span>
        </div>
      )}
    </div>
  )
}
