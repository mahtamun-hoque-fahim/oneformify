'use client'
import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { FormField, FormSettings, ConditionalRule } from '@/lib/types/form'
import FocusMonitor, { type Violation } from './FocusMonitor'
import ProgressBar from './ProgressBar'
import FormFieldRenderer from './FormField'

interface Props {
  formId: string
  slug: string
  title: string
  description?: string | null
  fields: FormField[]
  settings: FormSettings
}

// Evaluate conditional logic — returns true if the field should be VISIBLE
function isFieldVisible(field: FormField, answers: Record<string, string | string[]>): boolean {
  const rule = field.conditional
  if (!rule) return true

  const triggerValue = answers[rule.fieldId]
  const val = Array.isArray(triggerValue) ? triggerValue.join(',') : (triggerValue ?? '')

  let match = false
  switch (rule.operator) {
    case 'equals':     match = val === (rule.value ?? ''); break
    case 'not_equals': match = val !== (rule.value ?? ''); break
    case 'contains':   match = val.includes(rule.value ?? ''); break
    case 'is_empty':   match = val === ''; break
    case 'is_not_empty': match = val !== ''; break
  }

  if (rule.action === 'show') return match
  if (rule.action === 'hide') return !match
  return true // skip_to doesn't affect visibility
}

export default function FormFillClient({ formId, slug, title, description, fields, settings }: Props) {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [violations, setViolations] = useState<Violation[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const autoSubmitFired = useRef(false)

  const visibleFields = fields.filter(
    f => f.type === 'section_break' || isFieldVisible(f, answers)
  )
  const answerableFields = visibleFields.filter(f => f.type !== 'section_break')
  const answered = answerableFields.filter(f => {
    const v = answers[f.id]
    return Array.isArray(v) ? v.length > 0 : !!v
  }).length

  function setAnswer(fieldId: string, value: string | string[]) {
    setAnswers(prev => ({ ...prev, [fieldId]: value }))
    if (errors[fieldId]) setErrors(prev => ({ ...prev, [fieldId]: '' }))
  }

  function validate(): boolean {
    const errs: Record<string, string> = {}
    for (const field of answerableFields) {
      if (!field.required) continue
      const val = answers[field.id]
      const empty = Array.isArray(val) ? val.length === 0 : !val
      if (empty) errs[field.id] = 'This field is required'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function submit(autoViolations?: Violation[]) {
    if (autoSubmitFired.current) return
    if (!autoViolations && !validate()) return

    autoSubmitFired.current = true
    setSubmitting(true)
    setSubmitError('')

    try {
      const res = await fetch(`/api/f/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          violations: autoViolations ?? violations,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setSubmitError(data.error ?? 'Submission failed. Please try again.')
        setSubmitting(false)
        autoSubmitFired.current = false
        return
      }
      router.push(`/f/${slug}/submitted`)
    } catch {
      setSubmitError('Network error. Please check your connection and try again.')
      setSubmitting(false)
      autoSubmitFired.current = false
    }
  }

  const handleAutoSubmit = useCallback((v: Violation[]) => {
    submit(v)
  }, [answers, slug])

  return (
    <main className="min-h-screen bg-bg py-12 px-4">
      {/* Quiz mode focus monitor */}
      <FocusMonitor
        enabled={settings.focusMonitoringEnabled}
        threshold={settings.tabSwitchThreshold ?? 3}
        onAutoSubmit={handleAutoSubmit}
        onViolationsChange={setViolations}
      />

      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        {settings.showProgressBar && answerableFields.length > 0 && (
          <div className="mb-6">
            <ProgressBar current={answered} total={answerableFields.length} />
          </div>
        )}

        {/* Form header */}
        <div className="bg-surface border border-border rounded-xl p-8 mb-4">
          <h1 className="font-syne text-2xl font-bold text-text mb-2">{title}</h1>
          {description && <p className="text-text-muted text-sm">{description}</p>}

          {/* Quiz mode warning banner */}
          {settings.focusMonitoringEnabled && (
            <div className="mt-4 flex items-start gap-3 bg-warning/5 border border-warning/20 rounded-lg px-4 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-warning shrink-0 mt-0.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round"/>
                <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round"/>
              </svg>
              <div>
                <p className="text-warning text-xs font-medium mb-0.5">Focus monitoring is active</p>
                <p className="text-text-muted text-xs">This quiz monitors your focus. Switching tabs or windows will be logged. {settings.tabSwitchThreshold} violations trigger automatic submission.</p>
              </div>
            </div>
          )}
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-3">
          {visibleFields.map(field => (
            <div key={field.id} className={`bg-surface border rounded-xl p-6 transition-colors duration-150 ${
              errors[field.id] ? 'border-danger/40' : 'border-border'
            }`}>
              <FormFieldRenderer
                field={field}
                value={answers[field.id] ?? (field.type === 'checkbox' ? [] : '')}
                onChange={val => setAnswer(field.id, val)}
                error={errors[field.id]}
              />
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="mt-6">
          {submitError && (
            <p className="text-danger text-sm bg-danger/10 border border-danger/20 rounded-md px-4 py-3 mb-4">
              {submitError}
            </p>
          )}
          <button
            onClick={() => submit()}
            disabled={submitting}
            className="w-full bg-accent text-white py-3 rounded-md font-semibold text-sm hover:bg-accent-hover transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>

        {/* Violation count (visible during quiz) */}
        {settings.focusMonitoringEnabled && violations.length > 0 && (
          <p className="text-center text-danger text-xs mt-4">
            {violations.length} focus violation{violations.length !== 1 ? 's' : ''} logged
          </p>
        )}
      </div>
    </main>
  )
}
