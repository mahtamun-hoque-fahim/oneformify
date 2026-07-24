'use client'
import { useState } from 'react'
import { Download, ChevronDown, ChevronUp } from 'lucide-react'
import type { FormField } from '@/lib/types/form'

interface ResponseRow {
  id: string
  answers: Record<string, unknown>
  violations: unknown[]
  submittedAt: Date
}

interface Props {
  formId: string
  fields: FormField[]
  responses: ResponseRow[]
  slug: string
}

export default function ResponsesClient({ formId, fields, responses, slug }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [exporting, setExporting] = useState<string | null>(null)

  const answerableFields = fields.filter(f => f.type !== 'section_break')

  async function handleExport(format: 'csv' | 'xlsx' | 'pdf') {
    setExporting(format)
    const url = `/api/forms/${formId}/export?format=${format}`
    if (format === 'pdf') {
      window.open(url, '_blank')
      setExporting(null)
      return
    }
    const res = await fetch(url)
    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${slug}-responses.${format}`
    a.click()
    URL.revokeObjectURL(a.href)
    setExporting(null)
  }

  // Chart data — MCQ & checkbox field distributions
  const chartFields = answerableFields.filter(f =>
    ['multiple_choice', 'checkbox', 'dropdown', 'rating'].includes(f.type)
  )

  function getDistribution(field: FormField): Record<string, number> {
    const dist: Record<string, number> = {}
    for (const r of responses) {
      const val = r.answers[field.id]
      const vals = Array.isArray(val) ? val : [val]
      for (const v of vals) {
        if (v) dist[String(v)] = (dist[String(v)] ?? 0) + 1
      }
    }
    return dist
  }

  if (responses.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-16 text-center">
        <div className="w-14 h-14 rounded-xl bg-accent-faint border border-accent/20 flex items-center justify-center mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="font-syne text-lg font-semibold text-text mb-2">No responses yet</h3>
        <p className="text-text-muted text-sm">Share your form link to start collecting responses.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Summary + export */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-surface border border-border rounded-lg px-4 py-3">
            <p className="text-xs text-text-muted mb-0.5">Total responses</p>
            <p className="font-syne text-2xl font-bold text-text">{responses.length}</p>
          </div>
          <div className="bg-surface border border-border rounded-lg px-4 py-3">
            <p className="text-xs text-text-muted mb-0.5">With violations</p>
            <p className="font-syne text-2xl font-bold text-danger">
              {responses.filter(r => (r.violations?.length ?? 0) > 0).length}
            </p>
          </div>
        </div>

        {/* Export buttons */}
        <div className="flex items-center gap-2">
          {(['csv', 'xlsx', 'pdf'] as const).map(fmt => (
            <button
              key={fmt}
              onClick={() => handleExport(fmt)}
              disabled={!!exporting}
              className="flex items-center gap-1.5 bg-surface border border-border text-text-muted hover:text-text px-3 py-2 rounded-md text-sm transition-colors duration-150 disabled:opacity-50 uppercase font-mono text-xs tracking-wide"
            >
              <Download className="w-3.5 h-3.5" />
              {exporting === fmt ? '...' : fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Charts for MCQ / rating fields */}
      {chartFields.length > 0 && (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {chartFields.map(field => {
            const dist = getDistribution(field)
            const total = Object.values(dist).reduce((a, b) => a + b, 0)
            const entries = Object.entries(dist).sort((a, b) => b[1] - a[1])
            const max = entries[0]?.[1] ?? 1

            return (
              <div key={field.id} className="bg-surface border border-border rounded-xl p-5">
                <p className="text-sm font-medium text-text mb-4 line-clamp-2">{field.label}</p>
                <div className="flex flex-col gap-2.5">
                  {entries.map(([opt, count]) => (
                    <div key={opt}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-text-muted truncate max-w-[160px]">{opt}</span>
                        <span className="text-xs font-mono text-text-faint ml-2 shrink-0">
                          {count} · {total > 0 ? Math.round((count / total) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-surface-elevated rounded-full h-1.5">
                        <div
                          className="bg-accent h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${(count / max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Response table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs text-text-muted font-medium w-8">#</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted font-medium whitespace-nowrap">Submitted</th>
                {answerableFields.slice(0, 3).map(f => (
                  <th key={f.id} className="text-left px-4 py-3 text-xs text-text-muted font-medium max-w-[160px] truncate">
                    {f.label || 'Field'}
                  </th>
                ))}
                <th className="text-left px-4 py-3 text-xs text-text-muted font-medium">Violations</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {responses.map((r, i) => {
                const isExpanded = expandedId === r.id
                const violCount = r.violations?.length ?? 0
                return (
                  <>
                    <tr
                      key={r.id}
                      className="border-b border-border hover:bg-surface-elevated/50 cursor-pointer transition-colors duration-100"
                      onClick={() => setExpandedId(isExpanded ? null : r.id)}
                    >
                      <td className="px-4 py-3 text-text-faint text-xs font-mono">{i + 1}</td>
                      <td className="px-4 py-3 text-text-muted text-xs font-mono whitespace-nowrap">
                        {new Date(r.submittedAt).toLocaleDateString()} {new Date(r.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      {answerableFields.slice(0, 3).map(f => {
                        const val = r.answers[f.id]
                        const display = Array.isArray(val) ? val.join(', ') : (val ?? '—')
                        return (
                          <td key={f.id} className="px-4 py-3 text-text text-xs max-w-[160px] truncate">
                            {String(display)}
                          </td>
                        )
                      })}
                      <td className="px-4 py-3">
                        {violCount > 0 ? (
                          <span className="text-xs bg-danger/10 text-danger px-2 py-0.5 rounded-sm font-mono">{violCount}</span>
                        ) : (
                          <span className="text-text-faint text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-text-faint">
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${r.id}-expand`} className="border-b border-border bg-surface-elevated/30">
                        <td colSpan={answerableFields.slice(0, 3).length + 4} className="px-6 py-4">
                          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                            {answerableFields.map(f => {
                              const val = r.answers[f.id]
                              const display = Array.isArray(val) ? val.join(', ') : (val ?? '')
                              return (
                                <div key={f.id}>
                                  <p className="text-xs text-text-muted mb-0.5">{f.label}</p>
                                  <p className="text-sm text-text">{String(display) || <span className="text-text-faint italic">No answer</span>}</p>
                                </div>
                              )
                            })}
                            {violCount > 0 && (
                              <div>
                                <p className="text-xs text-danger mb-1">Focus violations ({violCount})</p>
                                {(r.violations as Array<{ timestamp: string; type: string }>).map((v, vi) => (
                                  <p key={vi} className="text-xs text-text-faint font-mono">
                                    {new Date(v.timestamp).toLocaleTimeString()} — {v.type}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
