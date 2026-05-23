'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface IntelligenceCardProps {
  label: string
  value: string | number
  sublabel?: string
  href?: string
  className?: string
}

export function IntelligenceCard({ label, value, sublabel, href, className }: IntelligenceCardProps) {
  return (
    <motion.div
      className={cn(
        'bg-white rounded-xl border border-border border-l-[3px] border-l-emerald shadow-sm p-6',
        className
      )}
      whileHover={{ y: -2, boxShadow: '0 8px 24px -4px rgba(0,0,0,0.10), 0 2px 8px -2px rgba(0,0,0,0.06)' }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">{label}</p>
      <p className="mt-1.5 text-2xl font-bold text-ink">{value}</p>
      {sublabel && (
        <p className="mt-1 text-xs text-muted">{sublabel}</p>
      )}
      {href && (
        <a
          href={href}
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald transition-colors duration-150 hover:text-emerald-dk"
        >
          View more <span aria-hidden>→</span>
        </a>
      )}
    </motion.div>
  )
}
