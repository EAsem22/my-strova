export default function TemplatesLoading() {
  return (
    <div className="flex h-screen flex-col bg-surface">
      <div className="h-14 shrink-0 border-b border-border bg-white" />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block w-60 shrink-0 border-r border-border bg-white" />
        <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="space-y-2">
              <div className="h-8 w-36 rounded shimmer" />
              <div className="h-4 w-64 rounded shimmer" />
            </div>
            <div className="flex gap-2 overflow-hidden">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-9 w-28 rounded-full shimmer shrink-0" />
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-border">
                  <div className="h-44 shimmer" />
                  <div className="p-4 space-y-2 bg-white">
                    <div className="h-4 w-full rounded shimmer" />
                    <div className="h-3 w-24 rounded shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
