export default function TrendsLoading() {
  return (
    <div className="flex h-screen flex-col bg-surface">
      <div className="h-14 shrink-0 border-b border-border bg-white" />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block w-60 shrink-0 border-r border-border bg-white" />
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="max-w-[1200px] mx-auto w-full space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-8 w-32 rounded shimmer" />
                <div className="h-4 w-56 rounded shimmer" />
              </div>
              <div className="h-9 w-64 rounded-lg shimmer" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 rounded-xl shimmer" />
              ))}
            </div>
            <div className="flex gap-6">
              <div className="flex-1 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-56 rounded-xl shimmer" />
                ))}
              </div>
              <div className="hidden lg:block w-72 h-96 rounded-xl shimmer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
