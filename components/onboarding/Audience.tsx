'use client'

import { useOnboardingStore } from '@/lib/stores/onboarding'
import { cn } from '@/lib/utils'

const PERSONAS = [
  'Founders',
  'SME Owners',
  'Students',
  'Consumers',
  'Enterprises',
  'Developers',
  'Creatives',
]

export function Audience() {
  const { audience, personaTags, update } = useOnboardingStore()

  function toggleTag(tag: string) {
    update({
      personaTags: personaTags.includes(tag)
        ? personaTags.filter((t) => t !== tag)
        : [...personaTags, tag],
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-[32px] font-extrabold leading-tight text-ink">
        Who is your primary customer?
      </h1>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink-soft">Describe your customer</label>
        <textarea
          value={audience}
          onChange={(e) => update({ audience: e.target.value.slice(0, 200) })}
          placeholder="Who they are, what they care about, and why they'd choose you..."
          maxLength={200}
          rows={4}
          className={cn(
            'w-full resize-none rounded-lg border border-border bg-white px-3 py-2.5',
            'text-sm text-ink placeholder:text-muted outline-none',
            'transition-all duration-150',
            'focus:border-emerald focus:ring-2 focus:ring-emerald/20'
          )}
        />
        <p className="text-right text-xs text-muted">{audience.length}/200</p>
      </div>

      <div>
        <p className="mb-3 text-sm text-muted">Persona tags <span className="text-muted">(optional)</span></p>
        <div className="flex flex-wrap gap-2">
          {PERSONAS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-150',
                personaTags.includes(tag)
                  ? 'border-emerald bg-emerald text-white'
                  : 'border-border bg-white text-ink-soft hover:border-emerald'
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
