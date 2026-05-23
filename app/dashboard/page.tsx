'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  MessageCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  ChevronRight,
  Zap,
  Globe,
  FileText,
} from 'lucide-react'
import Link from 'next/link'
import { AppSidebar, APP_NAV } from '@/components/ui/AppSidebar'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  DEMO_STARTUP,
  DEMO_INDUSTRY,
  DEMO_TOPICS,
  DEMO_CHANNELS,
  DEMO_COMPETITORS,
  DEMO_COMPETITOR_GAP,
  DEMO_NEWS,
  DEMO_OPPORTUNITIES,
  DEMO_DATA,
  type DemoChannel,
  type DemoTopic,
  type DemoOpportunity,
  type DemoNews,
} from '@/lib/demo-data'

// ─── Brand icon SVGs (lucide-react omits these) ──────────────────────────────

function LinkedinIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function InstagramIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function TwitterIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}
// ─── Loading Sequence ────────────────────────────────────────────────────────

const LOAD_LINES = [
  'Scanning Lagos fintech landscape...',
  'Mapping competitor signals...',
  'Identifying content opportunities...',
  'Your intelligence is ready.',
]

function LoadingSequence({ onDone }: { onDone: () => void }) {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    let idx = 0
    const tick = () => {
      idx += 1
      setVisibleCount(idx)
      if (idx < LOAD_LINES.length) {
        setTimeout(tick, 400)
      } else {
        setTimeout(onDone, 600)
      }
    }
    const t = setTimeout(tick, 200)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <div className="space-y-3 px-6">
        {LOAD_LINES.map((line, i) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, x: -8 }}
            animate={i < visibleCount ? { opacity: i === LOAD_LINES.length - 1 ? 1 : 0.55, x: 0 } : {}}
            transition={{ duration: 0.3 }}
            className={`font-mono text-sm ${i === LOAD_LINES.length - 1 ? 'text-emerald font-semibold' : 'text-muted'}`}
          >
            {i === LOAD_LINES.length - 1 && i < visibleCount ? '✓ ' : i < visibleCount ? '— ' : '  '}
            {line}
          </motion.p>
        ))}
      </div>
    </div>
  )
}

// ─── Sparkline SVG ───────────────────────────────────────────────────────────

function Sparkline({ data, color = '#10b981' }: { data: number[]; color?: string }) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' })

  const W = 120
  const H = 36
  const pad = 2
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const pts = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (W - pad * 2),
    y: H - pad - ((v - min) / range) * (H - pad * 2),
  }))

  // Smooth cubic bezier path
  const d = pts.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`
    const prev = pts[i - 1]
    const cx1 = prev.x + (pt.x - prev.x) / 2
    const cy1 = prev.y
    const cx2 = prev.x + (pt.x - prev.x) / 2
    const cy2 = pt.y
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`
  }, '')

  return (
    <svg ref={ref} width={W} height={H} className="overflow-visible">
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        pathLength={1}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1.1, ease: 'easeInOut', delay: 0.1 }}
      />
    </svg>
  )
}

// ─── Section wrapper ─────────────────────────────────────────────────────────

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' })

  return (
    <motion.div
      ref={ref}
      variants={sectionVariants}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Stagger container ────────────────────────────────────────────────────────

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const cardFade = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

// ─── TREND ICON ───────────────────────────────────────────────────────────────

function TrendIcon({ trend }: { trend: DemoTopic['trend'] }) {
  if (trend === 'Rising') return <TrendingUp size={14} className="text-emerald" />
  if (trend === 'Declining') return <TrendingDown size={14} className="text-red" />
  return <Minus size={14} className="text-muted" />
}

// ─── CHANNEL ICON ────────────────────────────────────────────────────────────

const CHANNEL_ICON_MAP: Record<DemoChannel['icon'], React.FC<{ size?: number; className?: string }>> = {
  Linkedin: ({ size, className }) => <LinkedinIcon size={size} className={className} />,
  Instagram: ({ size, className }) => <InstagramIcon size={size} className={className} />,
  Twitter: ({ size, className }) => <TwitterIcon size={size} className={className} />,
  MessageCircle: ({ size, className }) => <MessageCircle size={size} className={className} />,
}

// ─── URGENCY CONFIG ───────────────────────────────────────────────────────────

const URGENCY_CONFIG = {
  'Act now': { dot: 'bg-red', label: 'text-red', border: 'border-red/30' },
  'This week': { dot: 'bg-amber', label: 'text-amber', border: 'border-amber/30' },
  'This month': { dot: 'bg-emerald', label: 'text-emerald', border: 'border-emerald/30' },
}

// ─── NEWS RELEVANCE BADGE ─────────────────────────────────────────────────────

const RELEVANCE_CONFIG: Record<DemoNews['relevance'], { bg: string; text: string }> = {
  Regulatory: { bg: 'bg-amber/10', text: 'text-amber' },
  Competitor: { bg: 'bg-red/10', text: 'text-red' },
  'Market Signal': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'Channel Insight': { bg: 'bg-emerald/10', text: 'text-emerald' },
  Funding: { bg: 'bg-violet-100', text: 'text-violet-700' },
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isDemo = searchParams.get('demo') === 'true'

  const [loaded, setLoaded] = useState(false)
  const [hoveredNews, setHoveredNews] = useState<string | null>(null)
  const [regenerating, setRegenerating] = useState(false)

  // Persist demo mode so badge shows on all other pages
  useEffect(() => {
    if (isDemo) {
      localStorage.setItem('strova-demo', 'true')
      document.cookie = 'strova-demo=true; path=/; max-age=86400; samesite=lax'
    }
  }, [isDemo])

  const handleRegenerate = () => {
    setRegenerating(true)
    setLoaded(false)
    if (isDemo) {
      // Demo mode: fake 2s loading then re-render
      setTimeout(() => {
        setLoaded(false)
        setTimeout(() => setRegenerating(false), 100)
      }, 2000)
    } else {
      setTimeout(() => setRegenerating(false), 100)
    }
  }

  if (!loaded) {
    return <LoadingSequence onDone={() => setLoaded(true)} />
  }

  // ── Data: switch between Flowpay (demo) and Huti (default) ──────────────────
  const startup = isDemo
    ? { name: DEMO_DATA.profile.startupName, industry: DEMO_DATA.profile.industry, city: DEMO_DATA.profile.city, updatedAt: DEMO_DATA.industryOverview.updatedAt }
    : DEMO_STARTUP
  const gapUrgencyColor = (u: 'High' | 'Medium' | 'Low') =>
    u === 'High' ? 'bg-red/80' : u === 'Medium' ? 'bg-amber/80' : 'bg-emerald/80'

  return (
    <div className="flex h-screen flex-col bg-surface overflow-hidden">
      {/* ── Top Nav ── */}
      <header className="flex items-center gap-3 border-b border-border bg-surface px-4 sm:px-6 py-3 shrink-0">
        <span className="text-lg font-semibold tracking-tight text-ink shrink-0">Strova IQ</span>
        <span className="flex-1 hidden text-sm text-muted sm:block truncate">
          {startup.name} · {startup.industry} · {startup.city}
        </span>
        <div className="flex-1 sm:hidden" />
        {isDemo && (
          <span className="rounded-full bg-emerald px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
            Demo
          </span>
        )}
        <div className="h-8 w-8 rounded-full bg-emerald/20 flex items-center justify-center text-emerald text-xs font-bold select-none shrink-0">
          {startup.name.charAt(0)}
        </div>
      </header>

      {/* ── Sidebar + content ── */}
      <div className="flex flex-1 overflow-hidden">
      <AppSidebar path={pathname ?? '/dashboard'} />

      {/* ── Scrollable content ── */}
      <main className="flex-1 overflow-y-auto">
        {/* ── Sticky sub-header ── */}
        <div className="sticky top-0 z-10 border-b border-border bg-surface/95 backdrop-blur px-6 py-2 flex items-center justify-between">
          <p className="font-mono text-xs text-muted">
            {startup.industry} · {startup.city} · Updated {new Date(startup.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <button
            onClick={handleRegenerate}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1 text-xs text-muted hover:text-ink hover:border-ink/30 transition-colors"
          >
            <RefreshCw size={11} className={regenerating ? 'animate-spin' : ''} />
            Regenerate
          </button>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-12 pb-24">

          {/* ── 1. Industry Overview Strip ── */}
          <Section>
            <div className="rounded-xl border border-border bg-white p-5 sm:p-6 space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted font-medium mb-1">Industry Overview</p>
                  <h2 className="text-base font-semibold text-ink">{startup.industry} in {startup.city}</h2>
                </div>
                <div className="flex gap-3">
                  <div className="rounded-lg bg-emerald/10 px-3 py-2 text-center">
                    <p className="font-mono text-lg font-bold text-emerald">
                      +{isDemo ? DEMO_DATA.industryOverview.marketGrowth.value : `${DEMO_INDUSTRY.growthYoY}%`}
                    </p>
                    <p className="text-[10px] text-muted uppercase tracking-wide mt-0.5">YoY Growth</p>
                  </div>
                  <div className="rounded-lg bg-blue-100 px-3 py-2 text-center">
                    <p className="font-mono text-sm font-bold text-blue-700 mt-1">
                      {isDemo ? DEMO_DATA.industryOverview.activityLevel : DEMO_INDUSTRY.activityLevel.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-muted uppercase tracking-wide mt-0.5">Activity</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-ink-soft leading-relaxed">
                {isDemo ? DEMO_DATA.industryOverview.snapshot : DEMO_INDUSTRY.snapshot}
              </p>
              {!isDemo && (
                <div className="rounded-md bg-emerald/5 border border-emerald/20 px-4 py-2.5 flex items-center gap-2">
                  <Zap size={13} className="text-emerald shrink-0" />
                  <p className="text-xs text-emerald font-medium">{DEMO_INDUSTRY.keyTheme}</p>
                </div>
              )}
            </div>
          </Section>

          {/* ── 2. Trending Topics ── */}
          <Section>
            <p className="text-xs uppercase tracking-widest text-muted font-medium mb-3">Trending Topics</p>
            <div
              className="flex gap-3 overflow-x-auto pb-2"
              style={{ scrollbarWidth: 'none' }}
            >
              {isDemo
                ? DEMO_DATA.trendingTopics.map((topic, i) => (
                    <div
                      key={i}
                      className="shrink-0 w-48 rounded-xl border border-border bg-white p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-ink leading-snug">{topic.topic}</p>
                        <TrendIcon trend={topic.trend as DemoTopic['trend']} />
                      </div>
                      <Sparkline
                        data={[...topic.sparkline]}
                        color={(topic.trend as string) === 'Rising' ? '#10b981' : (topic.trend as string) === 'Declining' ? '#ef4444' : '#94a3b8'}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted">{topic.relevance}</span>
                        <span className="text-[10px] font-mono text-ink-soft">{topic.bestFormat}</span>
                      </div>
                    </div>
                  ))
                : DEMO_TOPICS.map((topic) => (
                    <div
                      key={topic.id}
                      className="shrink-0 w-48 rounded-xl border border-border bg-white p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-ink leading-snug">{topic.label}</p>
                        <TrendIcon trend={topic.trend} />
                      </div>
                      <Sparkline
                        data={topic.sparkline}
                        color={topic.trend === 'Rising' ? '#10b981' : topic.trend === 'Declining' ? '#ef4444' : '#94a3b8'}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted">{topic.category}</span>
                        <span className="text-[10px] font-mono text-ink-soft">{topic.format}</span>
                      </div>
                    </div>
                  ))
              }
            </div>
          </Section>

          {/* ── 3. Channel Intelligence ── */}
          <Section>
            <p className="text-xs uppercase tracking-widest text-muted font-medium mb-3">Channel Intelligence</p>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '0px 0px -40px 0px' }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3"
            >
              {isDemo
                ? DEMO_DATA.channelIntelligence.map((ch, i) => {
                    const iconKey = ch.platform === 'LinkedIn' ? 'Linkedin'
                      : ch.platform === 'Twitter/X' ? 'Twitter'
                      : ch.platform === 'Instagram' ? 'Instagram'
                      : 'MessageCircle'
                    const Icon = CHANNEL_ICON_MAP[iconKey as DemoChannel['icon']]
                    const fitColor = ch.audienceFit === 'High' ? 'text-emerald' : ch.audienceFit === 'Medium' ? 'text-amber' : 'text-muted'
                    return (
                      <motion.div
                        key={i}
                        variants={cardFade}
                        className={`relative rounded-xl border bg-white p-4 space-y-3 ${ch.recommended ? 'border-emerald/40' : 'border-border'}`}
                      >
                        {ch.recommended && (
                          <motion.span
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 0.6, times: [0, 0.5, 1], repeat: 0 }}
                            className="absolute -top-2.5 left-3 rounded-full bg-emerald px-2 py-0.5 text-[10px] font-semibold text-white"
                          >
                            Recommended
                          </motion.span>
                        )}
                        <div className="flex items-center gap-2 pt-1">
                          <div className="rounded-md bg-off-white p-1.5">
                            <Icon size={16} className="text-ink" />
                          </div>
                          <p className="text-xs font-semibold text-ink">{ch.platform}</p>
                        </div>
                        <div>
                          <p className="font-mono text-xl font-bold text-ink">{ch.engagementBenchmark.split(' ')[0]}</p>
                          <p className="text-[10px] text-muted">avg engagement</p>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-muted">{ch.postingFrequency}</span>
                          <span className={`font-medium ${fitColor}`}>{ch.audienceFit} fit</span>
                        </div>
                        <p className="text-[10px] text-ink-soft leading-relaxed border-t border-border pt-2">{ch.note}</p>
                      </motion.div>
                    )
                  })
                : DEMO_CHANNELS.map((ch) => {
                    const Icon = CHANNEL_ICON_MAP[ch.icon]
                    return (
                      <motion.div
                        key={ch.id}
                        variants={cardFade}
                        className={`relative rounded-xl border bg-white p-4 space-y-3 ${ch.recommended ? 'border-emerald/40' : 'border-border'}`}
                      >
                        {ch.recommended && (
                          <motion.span
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 0.6, times: [0, 0.5, 1], repeat: 0 }}
                            className="absolute -top-2.5 left-3 rounded-full bg-emerald px-2 py-0.5 text-[10px] font-semibold text-white"
                          >
                            Recommended
                          </motion.span>
                        )}
                        <div className="flex items-center gap-2 pt-1">
                          <div className="rounded-md bg-off-white p-1.5">
                            <Icon size={16} className="text-ink" />
                          </div>
                          <p className="text-xs font-semibold text-ink">{ch.platform}</p>
                        </div>
                        <div>
                          <p className="font-mono text-xl font-bold text-ink">{ch.engagement}%</p>
                          <p className="text-[10px] text-muted">avg engagement</p>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-muted">Reach: {ch.weeklyReach}/wk</span>
                          <span className={`font-medium ${ch.audienceFit === 'Excellent' ? 'text-emerald' : ch.audienceFit === 'Good' ? 'text-amber' : 'text-muted'}`}>
                            {ch.audienceFit}
                          </span>
                        </div>
                        <p className="text-[10px] text-ink-soft leading-relaxed border-t border-border pt-2">{ch.note}</p>
                      </motion.div>
                    )
                  })
              }
            </motion.div>
          </Section>

          {/* ── 4. Competitor Landscape ── */}
          <Section>
            <p className="text-xs uppercase tracking-widest text-muted font-medium mb-3">Competitor Landscape</p>
            <div className="space-y-3">
              <div className="rounded-xl border border-border bg-white overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border bg-off-white">
                        <th className="text-left px-4 py-2.5 font-medium text-muted">Brand</th>
                        {isDemo ? (
                          <>
                            <th className="text-left px-4 py-2.5 font-medium text-muted">Primary Channel</th>
                            <th className="text-left px-4 py-2.5 font-medium text-muted">Post Freq.</th>
                            <th className="text-left px-4 py-2.5 font-medium text-muted">Dominant Theme</th>
                            <th className="text-left px-4 py-2.5 font-medium text-muted">Messaging Gap</th>
                          </>
                        ) : (
                          <>
                            <th className="text-left px-4 py-2.5 font-medium text-muted">Followers</th>
                            <th className="text-left px-4 py-2.5 font-medium text-muted">Post Freq.</th>
                            <th className="text-left px-4 py-2.5 font-medium text-muted">Top Format</th>
                            <th className="text-left px-4 py-2.5 font-medium text-muted">Gap</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {isDemo
                        ? DEMO_DATA.competitorLandscape.competitors.map((comp, i) => (
                            <tr key={i} className={i < DEMO_DATA.competitorLandscape.competitors.length - 1 ? 'border-b border-border' : ''}>
                              <td className="px-4 py-3 font-semibold text-ink">{comp.name}</td>
                              <td className="px-4 py-3 text-ink-soft">{comp.primaryChannel}</td>
                              <td className="px-4 py-3 text-ink-soft">{comp.postingFrequency}</td>
                              <td className="px-4 py-3 text-ink-soft max-w-[160px] truncate">{comp.dominantTheme}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <span className={`h-2 w-2 rounded-full ${gapUrgencyColor(comp.gapUrgency as 'High' | 'Medium' | 'Low')}`} />
                                  <span className="text-ink-soft max-w-[160px] line-clamp-2">{comp.messagingGap}</span>
                                </div>
                              </td>
                            </tr>
                          ))
                        : DEMO_COMPETITORS.map((comp, i) => (
                            <tr key={comp.id} className={i < DEMO_COMPETITORS.length - 1 ? 'border-b border-border' : ''}>
                              <td className="px-4 py-3 font-semibold text-ink">{comp.name}</td>
                              <td className="px-4 py-3 font-mono text-ink-soft">{comp.followers}</td>
                              <td className="px-4 py-3 text-ink-soft">{comp.postFreq}</td>
                              <td className="px-4 py-3 text-ink-soft">{comp.topFormat}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <span className={`h-2 w-2 rounded-full ${gapUrgencyColor(comp.gapUrgency)}`} />
                                  <span className="text-ink-soft">{comp.gapLabel}</span>
                                </div>
                              </td>
                            </tr>
                          ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Dark gap summary card */}
              <div className="rounded-xl bg-[#111827] p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-emerald" />
                  <p className="text-xs font-semibold text-white uppercase tracking-wide">Biggest Gap in the Market</p>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {isDemo ? DEMO_DATA.competitorLandscape.gapSummary : DEMO_COMPETITOR_GAP}
                </p>
              </div>
            </div>
          </Section>

          {/* ── 5. News & Market Insights ── */}
          <Section>
            <p className="text-xs uppercase tracking-widest text-muted font-medium mb-3">News & Market Insights</p>
            <div className="rounded-xl border border-border bg-white divide-y divide-border overflow-hidden">
              {isDemo
                ? DEMO_DATA.newsAndInsights.map((item, i) => {
                    const tagKey = item.relevanceTag as keyof typeof RELEVANCE_CONFIG
                    const rel = RELEVANCE_CONFIG[tagKey] ?? { bg: 'bg-slate-100', text: 'text-slate-600' }
                    const isHovered = hoveredNews === String(i)
                    return (
                      <div
                        key={i}
                        className="px-4 py-3 flex items-start gap-3 cursor-pointer hover:bg-off-white transition-colors group"
                        onMouseEnter={() => setHoveredNews(String(i))}
                        onMouseLeave={() => setHoveredNews(null)}
                      >
                        <div className="shrink-0 pt-0.5">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${rel.bg} ${rel.text}`}>
                            {item.relevanceTag}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-ink leading-snug group-hover:text-emerald transition-colors">
                            {item.headline}
                          </p>
                          <AnimatePresence>
                            {isHovered && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-[11px] text-ink-soft leading-relaxed mt-1.5 overflow-hidden"
                              >
                                {item.summary}
                              </motion.p>
                            )}
                          </AnimatePresence>
                          <p className="font-mono text-[10px] text-muted mt-1">
                            {item.source} · {item.date}
                          </p>
                        </div>
                        <span className="shrink-0 text-muted">
                          <ExternalLink size={12} />
                        </span>
                      </div>
                    )
                  })
                : DEMO_NEWS.map((item) => {
                    const rel = RELEVANCE_CONFIG[item.relevance]
                    const isHovered = hoveredNews === item.id
                    return (
                      <div
                        key={item.id}
                        className="px-4 py-3 flex items-start gap-3 cursor-pointer hover:bg-off-white transition-colors group"
                        onMouseEnter={() => setHoveredNews(item.id)}
                        onMouseLeave={() => setHoveredNews(null)}
                      >
                        <div className="shrink-0 pt-0.5">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${rel.bg} ${rel.text}`}>
                            {item.relevance}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-ink leading-snug group-hover:text-emerald transition-colors">
                            {item.headline}
                          </p>
                          <AnimatePresence>
                            {isHovered && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-[11px] text-ink-soft leading-relaxed mt-1.5 overflow-hidden"
                              >
                                {item.summary}
                              </motion.p>
                            )}
                          </AnimatePresence>
                          <p className="font-mono text-[10px] text-muted mt-1">
                            {item.source} · {new Date(item.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 text-muted hover:text-ink transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    )
                  })
              }
            </div>
          </Section>

          {/* ── 6. Content Opportunities ── */}
          <Section>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-widest text-muted font-medium">Content Opportunities</p>
              <button
                onClick={() => router.push(isDemo ? '/content?demo=true' : '/content')}
                className="flex items-center gap-1 text-xs text-emerald hover:text-emerald-dk transition-colors"
              >
                Generate ideas <ChevronRight size={12} />
              </button>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '0px 0px -40px 0px' }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              {isDemo
                ? DEMO_DATA.contentOpportunities.map((op, i) => {
                    const urgency = op.urgency as keyof typeof URGENCY_CONFIG
                    const urg = URGENCY_CONFIG[urgency]
                    return (
                      <motion.div
                        key={i}
                        variants={cardFade}
                        className="rounded-xl border border-border bg-white p-4 space-y-3 border-l-4"
                        style={{ borderLeftColor: urgency === 'Act now' ? '#ef4444' : urgency === 'This week' ? '#f59e0b' : '#10b981' }}
                      >
                        <div className={`flex items-center gap-1.5 text-[10px] font-semibold ${urg.label}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${urg.dot}`} />
                          {op.urgency}
                        </div>
                        <p className="text-xs font-semibold text-ink leading-snug">{op.title}</p>
                        <p className="text-[11px] text-ink-soft leading-relaxed">{op.why}</p>
                        <span className="inline-block rounded-full bg-off-white px-2 py-0.5 text-[10px] text-ink-soft border border-border">
                          {op.format}
                        </span>
                        <button
                          onClick={() => router.push('/content?demo=true')}
                          className="flex items-center gap-1 text-[11px] text-emerald hover:text-emerald-dk font-medium transition-colors"
                        >
                          <FileText size={11} />
                          Generate content ideas
                        </button>
                      </motion.div>
                    )
                  })
                : DEMO_OPPORTUNITIES.map((op) => {
                    const urg = URGENCY_CONFIG[op.urgency]
                    return (
                      <motion.div
                        key={op.id}
                        variants={cardFade}
                        className={`rounded-xl border border-border bg-white p-4 space-y-3 border-l-4 ${urg.border} border-l-current`}
                        style={{ borderLeftColor: op.urgency === 'Act now' ? '#ef4444' : op.urgency === 'This week' ? '#f59e0b' : '#10b981' }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className={`flex items-center gap-1.5 text-[10px] font-semibold ${urg.label}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${urg.dot}`} />
                            {op.urgency}
                          </div>
                        </div>
                        <p className="text-xs font-semibold text-ink leading-snug">{op.title}</p>
                        <p className="text-[11px] text-ink-soft leading-relaxed">{op.why}</p>
                        <div className="flex flex-wrap gap-1">
                          {op.formats.map((f) => (
                            <span key={f} className="rounded-full bg-off-white px-2 py-0.5 text-[10px] text-ink-soft border border-border">
                              {f}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => router.push('/content')}
                          className="flex items-center gap-1 text-[11px] text-emerald hover:text-emerald-dk font-medium transition-colors"
                        >
                          <FileText size={11} />
                          Generate content ideas
                        </button>
                      </motion.div>
                    )
                  })
              }
            </motion.div>
          </Section>

        </div>
      </main>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-border flex">
        {APP_NAV.slice(0, 4).map((tab) => {
          const Icon = tab.icon
          const active = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-[9px] font-medium transition-colors',
                active ? 'text-emerald-dk' : 'text-muted',
              )}
            >
              <Icon size={18} strokeWidth={1.8} />
              {tab.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
