export default function AnalyticsLoading() {
  return (
    <div className="flex h-screen flex-col bg-surface">
      <div className="h-14 shrink-0 border-b border-border bg-white" />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block w-60 shrink-0 border-r border-border bg-white" />
        <div className="flex-1 overflow-y-auto">
          <div className="h-14 border-b border-border bg-white" />
          <div className="px-4 sm:px-8 py-6 space-y-10 max-w-7xl mx-auto">
            <div className="space-y-2">
              <div className="h-5 w-40 rounded shimmer" />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-28 rounded-xl shimmer" />
                ))}
              </div>
            </div>
            <div className="h-64 rounded-2xl shimmer" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-56 rounded-xl shimmer" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
