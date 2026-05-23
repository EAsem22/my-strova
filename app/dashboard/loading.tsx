export default function DashboardLoading() {
  return (
    <div className="flex h-screen flex-col bg-surface">
      <div className="h-14 shrink-0 border-b border-border bg-white" />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block w-60 shrink-0 border-r border-border bg-white" />
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="h-4 w-72 rounded shimmer" />
          <div className="rounded-xl border border-border bg-white p-6 space-y-3">
            <div className="h-4 w-40 rounded shimmer" />
            <div className="h-6 w-56 rounded shimmer" />
            <div className="h-16 w-full rounded shimmer" />
          </div>
          <div className="flex gap-3 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="shrink-0 w-48 h-32 rounded-xl shimmer" />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 rounded-xl shimmer" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
