'use client'

import { useOnboardingStore } from '@/lib/stores/onboarding'
import { cn } from '@/lib/utils'

const OPTIONS = [
  { value: 'brand-awareness',  label: 'Brand Awareness',    sub: 'Get your name known' },
  { value: 'lead-generation',  label: 'Lead Generation',    sub: 'Fill your sales pipeline' },
  { value: 'community',        label: 'Community Building', sub: 'Grow a loyal audience' },
  { value: 'sales-conversion', label: 'Sales Conversion',   sub: 'Turn interest into revenue' },
]

export function Goal() {
  const { goal, update } = useOnboardingStore()

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-[32px] font-extrabold leading-tight text-ink">
        What&apos;s your primary growth goal right now?
      </h1>

      <div className="flex flex-col gap-3">
        {OPTIONS.map(({ value, label, sub }) => {
          const selected = goal === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => update({ goal: value })}
              className={cn(
                'rounded-xl border p-4 text-left transition-all duration-150',
                selected
                  ? 'border-emerald bg-emerald-lt'
                  : 'border-border bg-white hover:border-emerald/60'
              )}
            >
              <div className="flex items-center gap-3.5">
                <div className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150',
                  selected ? 'border-emerald' : 'border-muted'
                )}>
                  {selected && <div className="h-2.5 w-2.5 rounded-full bg-emerald" />}
                </div>
                <div>
                  <p className="font-semibold text-ink">{label}</p>
                  <p className="text-xs text-muted">{sub}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
