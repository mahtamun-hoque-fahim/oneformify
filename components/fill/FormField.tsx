'use client'
import type { FormField as FormFieldType } from '@/lib/types/form'

interface Props {
  field: FormFieldType
  value: string | string[]
  onChange: (value: string | string[]) => void
  error?: string
}

export default function FormFieldRenderer({ field, value, onChange, error }: Props) {
  const inputClass = `w-full bg-bg border rounded-md px-3 py-2.5 text-text text-sm placeholder:text-text-faint focus:border-accent focus:outline-none transition-colors duration-150 ${
    error ? 'border-danger' : 'border-border'
  }`

  if (field.type === 'section_break') {
    return (
      <div className="flex items-center gap-3 py-2">
        <div className="flex-1 border-t border-border" />
        {field.label && <span className="text-xs text-text-muted px-2 shrink-0">{field.label}</span>}
        <div className="flex-1 border-t border-border" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div>
        <label className="text-sm font-medium text-text">
          {field.label || 'Untitled field'}
          {field.required && <span className="text-danger ml-1">*</span>}
        </label>
        {field.description && (
          <p className="text-text-muted text-xs mt-0.5">{field.description}</p>
        )}
      </div>

      {field.type === 'short_text' && (
        <input
          type="text"
          value={value as string}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={inputClass}
        />
      )}

      {field.type === 'long_text' && (
        <textarea
          value={value as string}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          className={`${inputClass} resize-none`}
        />
      )}

      {field.type === 'multiple_choice' && (
        <div className="flex flex-col gap-2">
          {(field.options ?? []).map((opt, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-150 ${
                value === opt ? 'border-accent bg-accent' : 'border-border group-hover:border-accent/60'
              }`}>
                {value === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <input
                type="radio"
                name={field.id}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(opt)}
                className="sr-only"
              />
              <span className="text-sm text-text">{opt}</span>
            </label>
          ))}
        </div>
      )}

      {field.type === 'checkbox' && (
        <div className="flex flex-col gap-2">
          {(field.options ?? []).map((opt, i) => {
            const checked = Array.isArray(value) && value.includes(opt)
            return (
              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center shrink-0 transition-colors duration-150 ${
                  checked ? 'border-accent bg-accent' : 'border-border group-hover:border-accent/60'
                }`}>
                  {checked && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    const arr = Array.isArray(value) ? [...value] : []
                    onChange(checked ? arr.filter(v => v !== opt) : [...arr, opt])
                  }}
                  className="sr-only"
                />
                <span className="text-sm text-text">{opt}</span>
              </label>
            )
          })}
        </div>
      )}

      {field.type === 'dropdown' && (
        <select
          value={value as string}
          onChange={e => onChange(e.target.value)}
          className={inputClass}
        >
          <option value="">{field.placeholder || 'Select an option'}</option>
          {(field.options ?? []).map((opt, i) => (
            <option key={i} value={opt}>{opt}</option>
          ))}
        </select>
      )}

      {field.type === 'date' && (
        <input
          type="date"
          value={value as string}
          onChange={e => onChange(e.target.value)}
          className={inputClass}
        />
      )}

      {field.type === 'rating' && (
        <div className="flex gap-2">
          {Array.from({ length: field.maxRating ?? 5 }).map((_, i) => {
            const rating = i + 1
            const filled = Number(value) >= rating
            return (
              <button
                key={i}
                type="button"
                onClick={() => onChange(String(rating))}
                className={`text-2xl transition-colors duration-100 ${
                  filled ? 'text-warning' : 'text-border hover:text-warning/60'
                }`}
              >
                ★
              </button>
            )
          })}
        </div>
      )}

      {field.type === 'file_upload' && (
        <div className={`border-2 border-dashed rounded-md p-6 text-center transition-colors duration-150 ${
          error ? 'border-danger' : 'border-border hover:border-accent/60'
        }`}>
          <input
            type="file"
            accept={field.acceptedFileTypes}
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) onChange(file.name)
            }}
            className="hidden"
            id={`file-${field.id}`}
          />
          <label htmlFor={`file-${field.id}`} className="cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted mx-auto mb-2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round"/>
            </svg>
            {value ? (
              <p className="text-sm text-accent">{value as string}</p>
            ) : (
              <p className="text-sm text-text-muted">Click to upload
                {field.acceptedFileTypes && <span className="text-text-faint text-xs block mt-0.5">{field.acceptedFileTypes}</span>}
              </p>
            )}
          </label>
        </div>
      )}

      {error && <p className="text-danger text-xs">{error}</p>}
    </div>
  )
}
