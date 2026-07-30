export default function DashboardLoading() {
  return (
    <div className="flex-1 p-8">
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-surface-elevated rounded-md mb-4" />
        <div className="h-4 w-32 bg-surface-elevated rounded mb-8" />
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="h-24 bg-surface border border-border rounded-xl" />
          <div className="h-24 bg-surface border border-border rounded-xl" />
        </div>
        <div className="flex flex-col gap-2">
          {[1,2,3].map(i => (
            <div key={i} className="h-14 bg-surface border border-border rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
