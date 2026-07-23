'use client'

interface Props {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: Props) {
  const pct = total === 0 ? 0 : Math.round((current / total) * 100)
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-text-muted">{current} of {total}</span>
        <span className="text-xs text-text-muted font-mono">{pct}%</span>
      </div>
      <div className="w-full bg-surface-elevated rounded-full h-1">
        <div
          className="bg-accent h-1 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
