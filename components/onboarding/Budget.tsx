'use client'

import { useOnboardingStore } from '@/lib/stores/onboarding'
import { cn } from '@/lib/utils'

const OPTIONS = [
  { value: '0-50k',     label: '₦0 – 50,000',         sub: 'Early stage / bootstrapped' },
  { value: '50k-200k',  label: '₦50,000 – 200,000',    sub: 'Growing steadily' },
  { value: '200k-500k', label: '₦200,000 – 500,000',   sub: 'Scaling up' },
  { value: '500k+',     label: '₦500,000+',            sub: 'Established & investing' },
]

export function Budget() {
  const { budget, update } = useOnboardingStore()

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-[32px] font-extrabold leading-tight text-ink">
        What&apos;s your monthly marketing budget?
      </h1>

      <div className="flex flex-col gap-3">
        {OPTIONS.map(({ value, label, sub }) => {
          const selected = budget === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => update({ budget: value })}
              className={cn(
                'rounded-xl border p-4 text-left transition-all duration-150',
                selected
                  ? 'border-emerald bg-emerald-lt'
                  : 'border-border bg-white hover:border-emerald/60'
              )}
            >
              <div className="flex items-center gap-3.5">
                {/* Radio dot */}
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
