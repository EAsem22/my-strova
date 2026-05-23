'use client'

import { HTMLMotionProps, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type Padding = 'sm' | 'md' | 'lg'

interface CardProps extends HTMLMotionProps<'div'> {
  hover?: boolean
  padding?: Padding
}

const paddings: Record<Padding, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({ hover = false, padding = 'md', children, className, ...props }: CardProps) {
  return (
    <motion.div
      className={cn(
        'bg-white rounded-xl border border-border shadow-sm',
        paddings[padding],
        className
      )}
      whileHover={hover ? { y: -2, boxShadow: '0 8px 24px -4px rgba(0,0,0,0.10), 0 2px 8px -2px rgba(0,0,0,0.06)' } : undefined}
      transition={hover ? { duration: 0.15, ease: 'easeOut' } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  )
}
