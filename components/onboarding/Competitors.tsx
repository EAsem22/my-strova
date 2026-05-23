'use client'

import { useOnboardingStore } from '@/lib/stores/onboarding'
import { Input } from '@/components/ui/Input'

const PLACEHOLDERS = ['e.g. Paystack', 'e.g. Flutterwave', 'e.g. Apple']

export function Competitors() {
  const { competitors, update } = useOnboardingStore()

  function setCompetitor(index: number, value: string) {
    const next = [...competitors] as [string, string, string]
    next[index] = value
    update({ competitors: next })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] font-extrabold leading-tight text-ink">
          Who are you competing with or inspired by?
        </h1>
        <p className="text-sm text-muted">
          These can be direct competitors or brands whose marketing you admire
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {([0, 1, 2] as const).map((i) => (
          <Input
            key={i}
            label={`Competitor ${i + 1}`}
            placeholder={PLACEHOLDERS[i]}
            value={competitors[i]}
            onChange={(e) => setCompetitor(i, e.target.value)}
          />
        ))}
      </div>
    </div>
  )
}
