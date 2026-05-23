'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import Link from 'next/link'
import { AppSidebar, APP_NAV } from '@/components/ui/AppSidebar'
import {
  TrendingUp, BarChart2,
  Zap, MessageCircle, ArrowRight,
} from 'lucide-react'

import { createBrowserClient } from '@/lib/supabase'
import type { StartupProfile } from '@/lib/types'
import type { RichContentIdea } from '@/lib/claude'
import { useContentStore } from '@/lib/stores/content'
import { FORMAT_CONFIG } from '@/components/ui/ContentIdeaCard'
import { Button, Skeleton } from '@/components/ui'
import { ContentIdeaCard } from '@/components/ui/ContentIdeaCard'
import { cn } from '@/lib/utils'
import {
  DEMO_STARTUP,
  DEMO_CHANNELS,
  DEMO_TOPICS,
  DEMO_OPPORTUNITIES,
  DEMO_COMPETITOR_GAP,
  DEMO_COMPETITORS,
  DEMO_DATA,
} from '@/lib/demo-data'

// ─── Derive smart triggers from demo data ─────────────────────────────────────

const topChannel  = DEMO_CHANNELS.find((c) => c.recommended) ?? DEMO_CHANNELS[0]
const topTopic    = DEMO_TOPICS.filter((t) => t.trend === 'Rising').sort((a, b) => b.sparkline[b.sparkline.length - 1] - a.sparkline[a.sparkline.length - 1])[0]
const topGapComp  = DEMO_COMPETITORS.filter((c) => c.gapUrgency === 'High')[0]

const TRIGGERS = [
  {
    value: 'top-channel',
    label: topChannel.platform,
    sublabel: `Top channel · ${topChannel.engagement}% engagement`,
    context: `${topChannel.platform} has your highest ROI at ${topChannel.engagement}% avg engagement reaching ${topChannel.weeklyReach}/wk. ${topChannel.note}`,
    icon: MessageCircle,
    stat: `${topChannel.engagement}%`,
  },
  {
    value: 'trending',
    label: topTopic?.label ?? 'Trending topics',
    sublabel: 'Rising fastest right now',
    context: `"${topTopic?.label}" is the fastest-rising topic in your space (volume: ${topTopic?.volume}). Best format: ${topTopic?.format}. Competitor content on this topic is thin — first mover wins.`,
    icon: TrendingUp,
    stat: '↑ Fast',
  },
  {
    value: 'competitor-gap',
    label: `${topGapComp?.name ?? 'Competitor'} gap`,
    sublabel: 'High-urgency gap to fill',
    context: DEMO_COMPETITOR_GAP,
    icon: BarChart2,
    stat: 'High',
  },
  {
    value: 'general',
    label: 'General ideas',
    sublabel: 'Broad mix of formats',
    context: `A balanced mix of content ideas across all formats, tailored to ${DEMO_STARTUP.name}'s audience of ${DEMO_STARTUP.audience}.`,
    icon: Zap,
    stat: 'Mix',
  },
]

// ─── Format filters ───────────────────────────────────────────────────────────

const FORMAT_FILTERS = [
  { label: 'All',       value: '' },
  { label: 'LinkedIn',  value: 'linkedin-post' },
  { label: 'Carousel',  value: 'carousel' },
  { label: 'Email',     value: 'email' },
  { label: 'Video',     value: 'video-script' },
  { label: 'Thread',    value: 'twitter-thread' },
]

// ─── Dev profile ──────────────────────────────────────────────────────────────

const DEV_PROFILE: StartupProfile = {
  id: 'dev-profile',
  user_id: 'dev-user',
  name: DEMO_STARTUP.name,
  industry: DEMO_STARTUP.industry,
  audience: DEMO_STARTUP.audience,
  competitors: DEMO_STARTUP.competitors,
  channels: DEMO_STARTUP.channels,
  budget: 'N50k–200k',
  goal: DEMO_STARTUP.goal,
  created_at: new Date().toISOString(),
}

// ─── Urgency config ───────────────────────────────────────────────────────────

const URGENCY_CONFIG = {
  'Act now':    { dot: 'bg-red',    text: 'text-red',    border: 'border-l-red',    bg: 'bg-red/5' },
  'This week':  { dot: 'bg-amber',  text: 'text-amber',  border: 'border-l-amber',  bg: 'bg-amber/5' },
  'This month': { dot: 'bg-emerald', text: 'text-emerald', border: 'border-l-emerald', bg: 'bg-emerald/5' },
}

// ─── Animations ───────────────────────────────────────────────────────────────

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const cardFadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateButtonLabel(triggerValue: string, generating: boolean) {
  if (generating) return null
  switch (triggerValue) {
    case 'top-channel':    return `Generate 6 ${topChannel.platform} ideas`
    case 'trending':       return `Generate 6 ${topTopic?.label ?? 'trending'} ideas`
    case 'competitor-gap': return `Generate 6 gap-filling ideas`
    default:               return 'Generate 6 ideas'
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-white inline-block"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
        />
      ))}
    </span>
  )
}

function IdeasSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} variant="card" height={300} />
      ))}
    </div>
  )
}

// ─── Intelligence context bar ─────────────────────────────────────────────────

function IntelligenceBar({ profile }: { profile: StartupProfile | null }) {
  const name = profile?.name ?? DEMO_STARTUP.name
  const industry = profile?.industry ?? DEMO_STARTUP.industry
  const risingCount = DEMO_TOPICS.filter((t) => t.trend === 'Rising').length
  const highGapCount = DEMO_COMPETITORS.filter((c) => c.gapUrgency === 'High').length

  return (
    <div className="rounded-xl border border-border bg-white p-4 flex flex-wrap gap-4 items-center">
      {/* Profile */}
      <div className="flex items-center gap-2 pr-4 border-r border-border">
        <div className="h-7 w-7 rounded-full bg-emerald/15 flex items-center justify-center text-emerald text-xs font-bold">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-xs font-semibold text-ink">{name}</p>
          <p className="text-[10px] text-muted">{industry} · {DEMO_STARTUP.city}</p>
        </div>
      </div>
      {/* Top channel */}
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald" />
        <div>
          <p className="text-xs font-semibold text-ink">{topChannel.platform}</p>
          <p className="text-[10px] text-muted">Top channel · {topChannel.engagement}% engagement</p>
        </div>
      </div>
      <div className="h-6 w-px bg-border hidden sm:block" />
      {/* Trending */}
      <div className="flex items-center gap-2">
        <TrendingUp size={13} className="text-emerald shrink-0" />
        <div>
          <p className="text-xs font-semibold text-ink">{risingCount} topics rising</p>
          <p className="text-[10px] text-muted">Fastest: {topTopic?.label}</p>
        </div>
      </div>
      <div className="h-6 w-px bg-border hidden sm:block" />
      {/* Gaps */}
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-red" />
        <div>
          <p className="text-xs font-semibold text-ink">{highGapCount} high-urgency gaps</p>
          <p className="text-[10px] text-muted">{topGapComp?.gapLabel}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Opportunity quick-launch ─────────────────────────────────────────────────

function OpportunityCards({ onLaunch }: { onLaunch: (triggerValue: string) => void }) {
  const triggerMap: Record<string, string> = {
    'CBN Regulatory Explainer Series': 'trending',
    'Founder Transparency Thread':     'top-channel',
    'Gen Z Dollar Savings Short-Form Video': 'competitor-gap',
  }

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-3">
        Start from an opportunity
      </p>
      <div className="grid grid-cols-1 gap-3">
        {DEMO_OPPORTUNITIES.map((op) => {
          const urg = URGENCY_CONFIG[op.urgency]
          const borderColor = op.urgency === 'Act now' ? '#ef4444' : op.urgency === 'This week' ? '#f59e0b' : '#10b981'
          return (
            <button
              key={op.id}
              onClick={() => onLaunch(triggerMap[op.title] ?? 'general')}
              className={cn(
                'text-left rounded-xl border border-border bg-white p-4 border-l-4 hover:shadow-sm transition-shadow space-y-2 group',
              )}
              style={{ borderLeftColor: borderColor }}
            >
              <div className={cn('flex items-center gap-1.5 text-[10px] font-semibold', urg.text)}>
                <span className={cn('h-1.5 w-1.5 rounded-full', urg.dot)} />
                {op.urgency}
              </div>
              <p className="text-xs font-semibold text-ink leading-snug group-hover:text-emerald transition-colors">
                {op.title}
              </p>
              <div className="flex flex-wrap gap-1">
                {op.formats.slice(0, 2).map((f) => (
                  <span key={f} className="rounded-full bg-off-white border border-border px-2 py-0.5 text-[10px] text-ink-soft">
                    {f}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1 text-[11px] font-medium text-emerald opacity-0 group-hover:opacity-100 transition-opacity">
                Generate ideas <ArrowRight size={11} />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContentPage() {
  const router = useRouter()
  const path   = usePathname() ?? '/content'
  const searchParams = useSearchParams()
  const isDemoParam  = searchParams.get('demo') === 'true'

  // isDemo can come from URL param OR from localStorage (set by dashboard)
  const [isDemo, setIsDemo] = useState(isDemoParam)

  useEffect(() => {
    const stored = typeof window !== 'undefined' && localStorage.getItem('strova-demo') === 'true'
    if (isDemoParam || stored) {
      setIsDemo(true)
      localStorage.setItem('strova-demo', 'true')
      document.cookie = 'strova-demo=true; path=/; max-age=86400; samesite=lax'
    }
  }, [isDemoParam])

  const [profile,        setProfile]        = useState<StartupProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [ideas,         setIdeas]         = useState<RichContentIdea[]>([])
  const [generating,    setGenerating]    = useState(false)
  const [generateError, setGenerateError] = useState('')
  const [hasGenerated,  setHasGenerated]  = useState(false)
  const [genKey,        setGenKey]        = useState(0)

  const [trigger,      setTrigger]      = useState('top-channel')
  const [formatFilter, setFormatFilter] = useState('')

  const { savedIdeas, saveIdea, removeIdea, setTemplateFormat, setSelectedIdea } = useContentStore()

  // Load profile
  useEffect(() => {
    let cancelled = false
    setProfileLoading(true)

    async function load() {
      // Demo mode or no Supabase — use Flowpay/Huti stub profile
      if (isDemo || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        if (!cancelled) {
          const demoName = isDemo ? DEMO_DATA.profile.startupName : DEMO_STARTUP.name
          setProfile({ ...DEV_PROFILE, name: demoName, industry: isDemo ? DEMO_DATA.profile.industry : DEMO_STARTUP.industry })
          setProfileLoading(false)
        }
        return
      }
      try {
        const supabase = createBrowserClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.replace('/auth'); return }

        const result = await supabase
          .from('profiles').select('*').eq('user_id', user.id).maybeSingle()

        if (result.error) throw result.error
        const prof = result.data as StartupProfile | null
        if (!prof) { router.replace('/onboarding'); return }
        if (!cancelled) { setProfile(prof); setProfileLoading(false) }
      } catch {
        if (!cancelled) setProfileLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [router, isDemo])

  // Generate ideas
  const handleGenerate = useCallback(async (overrideTrigger?: string) => {
    if (!profile && !isDemo) return
    const useTrigger = overrideTrigger ?? trigger
    if (overrideTrigger) setTrigger(overrideTrigger)
    setGenerating(true)
    setGenerateError('')

    // Demo mode: skip API, return Flowpay mock ideas after 2s fake delay
    if (isDemo) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIdeas(DEMO_DATA.contentIdeas as unknown as RichContentIdea[])
      setHasGenerated(true)
      setGenKey((k) => k + 1)
      setGenerating(false)
      return
    }

    try {
      const res = await fetch('/api/generate-content-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, trigger: useTrigger }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string }
        throw new Error(data.error ?? 'Failed to generate ideas')
      }
      const { ideas: newIdeas } = await res.json() as { ideas: RichContentIdea[] }
      setIdeas(newIdeas)
      setHasGenerated(true)
      setGenKey((k) => k + 1)
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setGenerating(false)
    }
  }, [profile, trigger, isDemo])

  function handleSave(idea: RichContentIdea) {
    const saved = savedIdeas.find((s) => s.idea.id === idea.id)
    if (saved) removeIdea(saved.uid)
    else saveIdea(idea)
  }

  function handleUseTemplate(idea: RichContentIdea) {
    setSelectedIdea(idea)
    setTemplateFormat(idea.format)
    router.push('/templates?format=' + idea.format)
  }

  const filteredIdeas = formatFilter ? ideas.filter((i) => i.format === formatFilter) : ideas
  const activeFilterLabel = FORMAT_FILTERS.find((f) => f.value === formatFilter)?.label ?? 'All'
  const activeTrigger = TRIGGERS.find((t) => t.value === trigger) ?? TRIGGERS[0]
  const btnLabel = generateButtonLabel(trigger, generating)

  return (
    <div className="flex h-screen flex-col bg-off-white overflow-hidden">

      {/* Top nav */}
      <header className="flex items-center gap-3 border-b border-border bg-surface px-4 sm:px-6 py-3 shrink-0">
        <span className="text-lg font-semibold tracking-tight text-ink shrink-0">Strova IQ</span>
        <span className="flex-1 hidden text-sm text-muted sm:block truncate">
          {isDemo ? DEMO_DATA.profile.startupName : (profile?.name ?? DEMO_STARTUP.name)} · {isDemo ? DEMO_DATA.profile.industry : (profile?.industry ?? DEMO_STARTUP.industry)} · {isDemo ? DEMO_DATA.profile.city : DEMO_STARTUP.city}
        </span>
        <div className="flex-1 sm:hidden" />
        {isDemo && (
          <span className="rounded-full bg-emerald px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
            Demo
          </span>
        )}
        <div className="h-8 w-8 rounded-full bg-emerald/20 flex items-center justify-center text-emerald text-xs font-bold select-none shrink-0">
          {(isDemo ? DEMO_DATA.profile.startupName : (profile?.name ?? DEMO_STARTUP.name)).charAt(0)}
        </div>
      </header>

      {/* Three-pane: sidebar | left controls | right ideas */}
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar path={path} />

        {/* Responsive wrapper: stacks on mobile, side-by-side on md+ */}
        <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden min-w-0">

        {/* ── Left: strategy controls ── */}
        <div className="w-full md:w-[360px] md:shrink-0 md:overflow-y-auto border-b md:border-b-0 md:border-r border-border bg-white pb-6 md:pb-8">
          <div className="p-6 space-y-6">

            {/* Page header */}
            <div>
              <h1 className="text-xl font-bold text-ink leading-tight">Content Strategy</h1>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                Ideas from your intelligence profile and latest market signals
              </p>
            </div>

            {/* Intelligence context bar */}
            <IntelligenceBar profile={profile} />

            {/* Opportunity quick-launch */}
            <OpportunityCards onLaunch={(t) => handleGenerate(t)} />

            {/* Trigger selector */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-3">
                Or generate from
              </p>
              <div className="flex flex-wrap gap-2">
                {TRIGGERS.map(({ value, label, sublabel }) => (
                  <button
                    key={value}
                    onClick={() => setTrigger(value)}
                    className={cn(
                      'flex flex-col items-start px-3 py-2 rounded-xl text-sm font-medium border transition-colors duration-150',
                      trigger === value
                        ? 'bg-emerald text-white border-emerald'
                        : 'bg-surface text-ink-soft border-border hover:border-ink-soft hover:text-ink',
                    )}
                  >
                    <span>{label}</span>
                    <span className={cn('text-[10px] font-normal mt-0.5', trigger === value ? 'text-white/70' : 'text-muted')}>
                      {sublabel}
                    </span>
                  </button>
                ))}
              </div>

              {/* Context callout */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={trigger}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 rounded-lg border border-emerald/20 bg-emerald/5 px-3 py-2.5 flex gap-2.5"
                >
                  <activeTrigger.icon size={13} className="text-emerald shrink-0 mt-0.5" />
                  <p className="text-xs text-ink-soft leading-relaxed">{activeTrigger.context}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Format filter */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-3">
                Filter by format
              </p>
              <div className="flex flex-wrap gap-1.5">
                {FORMAT_FILTERS.map(({ label, value }) => (
                  <button
                    key={label}
                    onClick={() => setFormatFilter(value)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors duration-150',
                      formatFilter === value
                        ? 'bg-ink text-white border-ink'
                        : 'bg-surface text-ink-soft border-border hover:border-ink-soft hover:text-ink',
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <div className="flex flex-col items-stretch gap-2">
              {generateError && (
                <div className="flex items-center gap-2 rounded-lg bg-red/5 border border-red/20 px-3 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red shrink-0" />
                  <p className="text-xs text-red">Something went wrong — try regenerating.</p>
                </div>
              )}
              <Button
                size="lg"
                className="w-full justify-center"
                onClick={() => handleGenerate()}
                disabled={generating || profileLoading}
              >
                {generating ? (
                  <>
                    <LoadingDots />
                    <span className="ml-2">Analysing your market...</span>
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    {btnLabel}
                  </>
                )}
              </Button>
            </div>

            {/* Saved ideas */}
            {savedIdeas.length > 0 && (
              <section>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-3">
                  Saved Ideas
                </p>
                <div className="rounded-xl border border-border divide-y divide-border overflow-hidden">
                  {savedIdeas.map((saved) => {
                    const fmt = FORMAT_CONFIG[saved.idea.format] ?? FORMAT_CONFIG['linkedin-post']
                    return (
                      <div key={saved.uid} className="flex items-center gap-3 px-4 py-3">
                        <span className={cn(
                          'shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold',
                          fmt.bg, fmt.text,
                        )}>
                          {fmt.label}
                        </span>
                        <p className="flex-1 text-xs text-ink font-medium truncate min-w-0">
                          {saved.idea.title}
                        </p>
                        <button
                          onClick={() => {
                            setSelectedIdea(saved.idea)
                            setTemplateFormat(saved.idea.format)
                            router.push('/templates?format=' + saved.idea.format)
                          }}
                          className="shrink-0 text-xs font-medium text-emerald hover:text-emerald-dk transition-colors"
                        >
                          Use →
                        </button>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

          </div>
        </div>

        {/* ── Right: generated ideas ── */}
        <main className="flex-1 min-w-0 overflow-y-auto bg-off-white pb-24 md:pb-8">
          <div className="p-6">

            {/* Empty state */}
            {!hasGenerated && !generating && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.35 }}
                className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center space-y-4"
              >
                <div className="mx-auto h-14 w-14 rounded-2xl bg-emerald-lt flex items-center justify-center">
                  <Zap size={26} className="text-emerald-dk" />
                </div>
                <div>
                  <p className="text-base font-bold text-ink">Your ideas will appear here</p>
                  <p className="mt-1.5 text-sm text-ink-soft max-w-sm leading-relaxed">
                    Pick a trigger on the left and hit Generate — Strova IQ will surface 6 ideas tuned to your market and this week&apos;s biggest opportunities.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Ideas */}
            <AnimatePresence mode="wait">
              {(hasGenerated || generating) && (
                <motion.section
                  key="ideas-section"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">
                      Generated Ideas
                    </p>
                    {hasGenerated && !generating && (
                      <button
                        onClick={() => handleGenerate()}
                        className="text-xs text-muted hover:text-ink transition-colors flex items-center gap-1"
                      >
                        <ArrowRight size={11} className="rotate-180" />
                        Regenerate
                      </button>
                    )}
                  </div>
                  {generating ? (
                    <IdeasSkeleton />
                  ) : filteredIdeas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                      <p className="text-sm font-medium text-ink">
                        No {activeFilterLabel} ideas in this batch
                      </p>
                      <p className="text-xs text-muted max-w-xs">
                        Try a different format filter or regenerate for a fresh set.
                      </p>
                      <Button variant="secondary" size="sm" onClick={() => handleGenerate()}>
                        Regenerate ideas
                      </Button>
                    </div>
                  ) : (
                    <motion.div
                      key={genKey}
                      className="grid grid-cols-1 gap-4"
                      variants={stagger}
                      initial="hidden"
                      animate="show"
                    >
                      {filteredIdeas.map((idea) => (
                        <motion.div key={idea.id} variants={cardFadeUp}>
                          <ContentIdeaCard
                            idea={idea}
                            isSaved={savedIdeas.some((s) => s.idea.id === idea.id)}
                            onSave={() => handleSave(idea)}
                            onUseTemplate={() => handleUseTemplate(idea)}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.section>
              )}
            </AnimatePresence>

          </div>
        </main>

        </div>{/* end responsive wrapper */}
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-border flex">
        {APP_NAV.slice(0, 4).map(({ label, href, icon: Icon }) => {
          const active = path === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-[9px] font-medium transition-colors',
                active ? 'text-emerald-dk' : 'text-muted',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={18} strokeWidth={1.8} />
              {label}
            </Link>
          )
        })}
      </nav>

    </div>
  )
}
