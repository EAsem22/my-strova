export default function ContentLoading() {
  return (
    <div className="flex h-screen flex-col bg-off-white">
      <div className="h-14 shrink-0 border-b border-border bg-white" />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block w-60 shrink-0 border-r border-border bg-white" />
        <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-8">
            <div className="space-y-2">
              <div className="h-8 w-48 rounded shimmer" />
              <div className="h-4 w-80 rounded shimmer" />
            </div>
            <div className="h-20 rounded-xl shimmer" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 rounded-xl shimmer" />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-72 rounded-xl shimmer" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
