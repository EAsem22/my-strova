import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  showLabel?: boolean
}

export function ProgressBar({ value, max = 100, showLabel = false, className, ...props }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn('flex items-center gap-3', className)} {...props}>
      <div
        className="relative h-1 flex-1 overflow-hidden rounded-full bg-surface"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-emerald transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="shrink-0 text-xs tabular-nums text-muted">{Math.round(pct)}%</span>
      )}
    </div>
  )
}
