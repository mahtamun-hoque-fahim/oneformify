export default function Loading() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-border border-t-accent animate-spin" />
        <p className="text-text-faint text-xs font-mono">Loading...</p>
      </div>
    </div>
  )
}
