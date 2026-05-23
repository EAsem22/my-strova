'use client'

import { Bookmark, BookmarkCheck, ArrowRight } from 'lucide-react'
import type { RichContentIdea } from '@/lib/claude'
import { cn } from '@/lib/utils'
import { Button } from './Button'

export const FORMAT_CONFIG: Record<
  RichContentIdea['format'],
  { label: string; bg: string; text: string }
> = {
  'linkedin-post':     { label: 'LinkedIn',   bg: 'bg-blue-100',   text: 'text-blue-700' },
  'carousel':          { label: 'Carousel',   bg: 'bg-violet-100', text: 'text-violet-700' },
  'video-script':      { label: 'Video',      bg: 'bg-red/10',     text: 'text-red' },
  'email':             { label: 'Email',      bg: 'bg-amber/10',   text: 'text-amber' },
  'twitter-thread':    { label: 'Thread',     bg: 'bg-sky-100',    text: 'text-sky-700' },
  'instagram-caption': { label: 'Instagram',  bg: 'bg-rose-100',   text: 'text-rose-700' },
}

const TONE_LABEL: Record<RichContentIdea['tone'], string> = {
  educational:    'Educational',
  provocative:    'Provocative',
  storytelling:   'Storytelling',
  'data-driven':  'Data-driven',
  conversational: 'Conversational',
}

interface Props {
  idea: RichContentIdea
  isSaved: boolean
  onSave: () => void
  onUseTemplate: () => void
}

export function ContentIdeaCard({ idea, isSaved, onSave, onUseTemplate }: Props) {
  const fmt = FORMAT_CONFIG[idea.format] ?? FORMAT_CONFIG['linkedin-post']

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm p-5 flex flex-col gap-3.5 h-full card-hover">
      {/* Format + tone */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
          fmt.bg, fmt.text,
        )}>
          {fmt.label}
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface text-muted">
          {TONE_LABEL[idea.tone]}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-[16px] font-bold text-ink leading-snug">{idea.title}</h3>

      {/* Audience + trend */}
      <div className="space-y-1">
        <p className="text-xs text-muted">
          <span className="font-medium text-ink-soft">Audience: </span>
          {idea.audienceSegment}
        </p>
        <p className="text-xs text-muted">
          <span className="font-medium text-ink-soft">Tied to: </span>
          {idea.trendTiedTo}
        </p>
      </div>

      {/* CTA */}
      <div className="bg-surface rounded-lg px-3 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-1">
          Suggested CTA
        </p>
        <p className="text-xs text-ink-soft">&ldquo;{idea.suggestedCTA}&rdquo;</p>
      </div>

      {/* Why it will work */}
      <p className="text-xs text-muted leading-relaxed flex-1">
        <span className="font-semibold text-ink-soft">Why it will work: </span>
        {idea.whyItWillWork}
      </p>

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          className={cn(isSaved && 'text-emerald-dk')}
        >
          {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
          {isSaved ? 'Saved' : 'Save Idea'}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="ml-auto"
          onClick={onUseTemplate}
        >
          Use Template
          <ArrowRight size={13} />
        </Button>
      </div>
    </div>
  )
}
