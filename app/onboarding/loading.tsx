export default function OnboardingLoading() {
  return (
    <div className="min-h-screen bg-off-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-xl space-y-6">
        <div className="h-1 w-full rounded-full shimmer" />
        <div className="h-8 w-64 rounded shimmer mx-auto" />
        <div className="h-4 w-80 rounded shimmer mx-auto" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-lg shimmer" />
          ))}
        </div>
        <div className="h-11 w-full rounded-lg shimmer" />
      </div>
    </div>
  )
}
