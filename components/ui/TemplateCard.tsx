'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Star, Download, Eye } from 'lucide-react'
import type { Template } from '@/lib/types'
import { cn } from '@/lib/utils'

// ─── Category badge colours ───────────────────────────────────────────────────

export const CATEGORY_CONFIG: Record<string, { bg: string; text: string }> = {
  'LinkedIn Carousel': { bg: 'bg-blue-100',   text: 'text-blue-700' },
  'Video Script':      { bg: 'bg-red/10',     text: 'text-red' },
  'Email':             { bg: 'bg-amber/10',   text: 'text-amber' },
  'Landing Page':      { bg: 'bg-emerald/10', text: 'text-emerald' },
  'Social Post':       { bg: 'bg-violet-100', text: 'text-violet-700' },
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface TemplateCardProps {
  template: Template
  onPreview: (template: Template) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TemplateCard({ template, onPreview }: TemplateCardProps) {
  const cat = CATEGORY_CONFIG[template.category] ?? { bg: 'bg-surface', text: 'text-muted' }
  const isFree = template.price === 0
  const rating = Number(template.rating).toFixed(1)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      whileHover={{ y: -2, boxShadow: '0 8px 24px -4px rgba(0,0,0,0.10), 0 2px 8px -2px rgba(0,0,0,0.06)' }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="group flex flex-col bg-white rounded-xl border border-border overflow-hidden cursor-pointer"
      onClick={() => onPreview(template)}
    >
      {/* Preview image */}
      <div className="relative aspect-video overflow-hidden bg-off-white">
        <img
          src={template.preview_url ?? `https://placehold.co/1280x720/f1f5f9/94a3b8?text=${encodeURIComponent(template.category)}`}
          alt={template.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-ink/55 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-sm font-semibold text-ink shadow-lg">
            <Eye size={15} />
            Preview
          </div>
        </div>
        {/* Price badge */}
        <div className={cn(
          'absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide',
          isFree ? 'bg-emerald text-white' : 'bg-ink text-white',
        )}>
          {isFree ? 'FREE' : `₦${(template.price / 1000).toFixed(0)}k`}
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-2.5 p-4">
        {/* Designer */}
        <div className="flex items-center gap-1.5">
          <p className="text-[11px] text-muted truncate">
            {template.designer_name ?? 'Unknown designer'}
          </p>
          <CheckCircle2 size={11} className="text-emerald shrink-0" />
        </div>

        {/* Title */}
        <p className="text-sm font-semibold text-ink leading-snug line-clamp-2">
          {template.title}
        </p>

        {/* Category + stats row */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-1">
          <span className={cn(
            'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium',
            cat.bg, cat.text,
          )}>
            {template.category}
          </span>
          <div className="flex items-center gap-3 text-[10px] font-mono text-muted">
            <span className="flex items-center gap-0.5">
              <Download size={9} />
              {template.downloads.toLocaleString()}
            </span>
            <span className="flex items-center gap-0.5">
              <Star size={9} className="text-amber fill-amber" />
              {rating}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
