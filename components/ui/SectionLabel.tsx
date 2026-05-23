import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface SectionLabelProps extends HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

export function SectionLabel({ children, className, ...props }: SectionLabelProps) {
  return (
    <p
      className={cn(
        'text-[11px] font-semibold uppercase tracking-widest text-emerald',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}
