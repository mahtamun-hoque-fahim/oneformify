'use client'
import { useEffect, useRef, useState } from 'react'
import { AlertTriangle } from 'lucide-react'

export interface Violation {
  timestamp: string
  type: 'blur' | 'visibility'
}

interface Props {
  enabled: boolean
  threshold: 1 | 2 | 3
  onAutoSubmit: (violations: Violation[]) => void
  onViolationsChange: (violations: Violation[]) => void
}

export default function FocusMonitor({ enabled, threshold, onAutoSubmit, onViolationsChange }: Props) {
  const [violations, setViolations] = useState<Violation[]>([])
  const [showWarning, setShowWarning] = useState(false)
  const violationsRef = useRef<Violation[]>([])

  useEffect(() => {
    if (!enabled) return

    function recordViolation(type: 'blur' | 'visibility') {
      const v: Violation = { timestamp: new Date().toISOString(), type }
      const next = [...violationsRef.current, v]
      violationsRef.current = next
      setViolations(next)
      onViolationsChange(next)

      if (next.length >= threshold) {
        onAutoSubmit(next)
      } else {
        setShowWarning(true)
      }
    }

    function handleVisibility() {
      if (document.visibilityState === 'hidden') {
        recordViolation('visibility')
      }
    }

    function handleBlur() {
      recordViolation('blur')
    }

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('blur', handleBlur)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('blur', handleBlur)
    }
  }, [enabled, threshold, onAutoSubmit, onViolationsChange])

  if (!showWarning || !enabled) return null

  return (
    <div className="fixed inset-0 bg-bg/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-elevated border border-danger/30 rounded-xl p-8 max-w-sm w-full text-center shadow-lg">
        <div className="w-12 h-12 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-danger" />
        </div>
        <h2 className="font-syne text-xl font-semibold text-text mb-2">Please stay on this tab</h2>
        <p className="text-text-muted text-sm mb-1">
          This quiz monitors your focus. Switching tabs has been logged.
        </p>
        <p className="text-text-faint text-xs mb-6">
          Warning {violations.length} of {threshold}. Auto-submit on {threshold}.
        </p>
        <button
          onClick={() => setShowWarning(false)}
          className="bg-accent text-white px-6 py-2.5 rounded-md text-sm font-semibold w-full hover:bg-accent-hover transition-colors duration-150"
        >
          Resume quiz
        </button>
      </div>
    </div>
  )
}
