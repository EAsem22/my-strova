'use client'

import { useOnboardingStore } from '@/lib/stores/onboarding'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

const INDUSTRY_OPTIONS = [
  'Fintech',
  'Healthtech',
  'Edtech',
  'Fashion & Retail',
  'Food & Beverage',
  'Logistics',
  'SaaS / B2B Tools',
  'Creative & Media',
  'Other',
].map((v) => ({ value: v, label: v }))

export function StartupBasics() {
  const { startupName, tagline, industry, update } = useOnboardingStore()

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-[32px] font-extrabold leading-tight text-ink">
        What&apos;s your startup called and what do you do?
      </h1>
      <div className="flex flex-col gap-4">
        <Input
          label="Startup name"
          placeholder="e.g. Strova"
          value={startupName}
          onChange={(e) => update({ startupName: e.target.value })}
          autoFocus
        />
        <Input
          label="One-line tagline"
          placeholder="e.g. Marketing intelligence for African startups"
          value={tagline}
          onChange={(e) => update({ tagline: e.target.value })}
        />
        <Select
          label="Industry"
          placeholder="Select your industry"
          value={industry}
          onChange={(e) => update({ industry: e.target.value })}
          options={INDUSTRY_OPTIONS}
        />
      </div>
    </div>
  )
}
