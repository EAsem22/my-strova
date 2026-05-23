import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'default' | 'emerald' | 'muted'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant
}

const variants: Record<Variant, string> = {
  default: 'bg-surface text-ink-soft',
  emerald: 'bg-emerald-lt text-emerald-dk',
  muted:   'bg-surface text-muted',
}

export function Badge({ variant = 'default', children, className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
