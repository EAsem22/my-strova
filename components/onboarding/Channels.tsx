'use client'

import { useOnboardingStore } from '@/lib/stores/onboarding'
import { cn } from '@/lib/utils'

const CHANNEL_OPTIONS = [
  'LinkedIn',
  'Instagram',
  'Twitter/X',
  'TikTok',
  'WhatsApp',
  'Email Newsletter',
  'YouTube',
  'None yet',
]

export function Channels() {
  const { channels, update } = useOnboardingStore()

  function toggle(channel: string) {
    if (channel === 'None yet') {
      update({ channels: channels.includes('None yet') ? [] : ['None yet'] })
      return
    }
    const without = channels.filter((c) => c !== 'None yet')
    update({
      channels: without.includes(channel)
        ? without.filter((c) => c !== channel)
        : [...without, channel],
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-[32px] font-extrabold leading-tight text-ink">
        Where are you currently active?
      </h1>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {CHANNEL_OPTIONS.map((channel) => {
          const selected = channels.includes(channel)
          return (
            <button
              key={channel}
              type="button"
              onClick={() => toggle(channel)}
              className={cn(
                'rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-150',
                selected
                  ? 'border-emerald bg-emerald-lt text-emerald-dk'
                  : 'border-border bg-white text-ink-soft hover:border-emerald/60'
              )}
            >
              {channel}
            </button>
          )
        })}
      </div>
    </div>
  )
}
