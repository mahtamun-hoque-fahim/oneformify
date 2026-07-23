'use client'
import { FIELD_LABELS, type FieldType } from '@/lib/types/form'
import FieldIcon from './FieldIcon'

const FIELD_TYPES: FieldType[] = [
  'short_text', 'long_text', 'multiple_choice', 'checkbox',
  'dropdown', 'date', 'file_upload', 'rating', 'section_break',
]

interface Props {
  onAdd: (type: FieldType) => void
}

export default function FieldPalette({ onAdd }: Props) {
  return (
    <div className="w-56 bg-surface border-r border-border flex flex-col shrink-0">
      <div className="p-4 border-b border-border">
        <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Add field</p>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {FIELD_TYPES.map(type => (
          <button
            key={type}
            onClick={() => onAdd(type)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm text-text-muted hover:text-text hover:bg-surface-elevated transition-colors duration-150 group"
          >
            <span className="text-text-faint group-hover:text-accent transition-colors duration-150">
              <FieldIcon type={type} className="w-4 h-4" />
            </span>
            {FIELD_LABELS[type]}
          </button>
        ))}
      </div>
    </div>
  )
}
