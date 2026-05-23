'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Home,
  TrendingUp,
  Lightbulb,
  LayoutTemplate,
  BarChart3,
  Bookmark,
  Zap,
  AlertTriangle,
  SlidersHorizontal,
  X,
  Download,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { AppSidebar, APP_NAV } from '@/components/ui/AppSidebar'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  DEMO_STARTUP,
  DEMO_TOPICS,
  DEMO_DATA,
  type DemoTopic,
} from '@/lib/demo-data'

// ─── Sparkline SVG ────────────────────────────────────────────────────────────

function Sparkline({ data, width = 160, height = 36, color = '#10b981' }: {
  data: number[]
  width?: number
  height?: number
  color?: string
}) {
  if (!data.length) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pad = 2
  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2)
    const y = pad + (1 - (v - min) / range) * (height - pad * 2)
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <polyline points={points} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Trend Badge ──────────────────────────────────────────────────────────────

function TrendBadge({ trend }: { trend: DemoTopic['trend'] }) {
  const cfg = {
    Rising:   { bg: 'bg-emerald/10', text: 'text-emerald-dk', label: '↑ Rising' },
    Stable:   { bg: 'bg-blue-100',   text: 'text-blue-700',   label: '→ Stable' },
    Declining:{ bg: 'bg-red/10',     text: 'text-red',        label: '↓ Declining' },
  }[trend]
  return (
    <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-semibold', cfg.bg, cfg.text)}>
      {cfg.label}
    </span>
  )
}

// ─── Momentum label ───────────────────────────────────────────────────────────

function momentumLabel(trend: DemoTopic['trend']) {
  if (trend === 'Rising')   return '↑ Gaining momentum'
  if (trend === 'Declining') return '↓ Losing traction'
  return '→ Holding steady'
}

// ─── Format filter matching ───────────────────────────────────────────────────

const FORMAT_MAP: Record<string, string[]> = {
  LinkedIn: ['LinkedIn Post'],
  Video:    ['Video Script'],
  Thread:   ['Twitter Thread'],
  Email:    ['Email'],
}

// ─── QUICK STATS DATA ─────────────────────────────────────────────────────────

const QUICK_STATS = [
  {
    value: '4',
    mono: true,
    label: 'topics rising this week',
    sub: null,
    emerald: true,
  },
  {
    value: 'LinkedIn',
    mono: false,
    label: 'highest engagement for Lagos Fintech',
    sub: null,
    emerald: false,
  },
  {
    value: '78',
    mono: true,
    label: 'whitespace score vs competitors',
    sub: 'High opportunity',
    emerald: false,
  },
  {
    value: 'Tuesday',
    mono: false,
    label: '8–10am · LinkedIn',
    sub: null,
    emerald: false,
  },
]

// ─── Topic Map nodes / edges (hardcoded positions for MVP) ───────────────────

const MAP_NODES = [
  { id: 'bnpl',            x: 80,  y: 50,  r: 14, high: true,  label: 'BNPL for SMEs' },
  { id: 'cbn-reform',      x: 190, y: 40,  r: 16, high: true,  label: 'CBN Reform' },
  { id: 'gen-z-saving',    x: 240, y: 130, r: 13, high: true,  label: 'Gen Z Saving' },
  { id: 'crypto-alt',      x: 140, y: 170, r: 11, high: false, label: 'Crypto Alts' },
  { id: 'dollar-savings',  x: 50,  y: 155, r: 12, high: true,  label: 'Dollar Savings' },
  { id: 'referral-fatigue',x: 200, y: 210, r: 9,  high: false, label: 'Referral Fatigue' },
]

const MAP_EDGES = [
  { from: 'cbn-reform',      to: 'bnpl' },
  { from: 'cbn-reform',      to: 'dollar-savings' },
  { from: 'dollar-savings',  to: 'crypto-alt' },
  { from: 'gen-z-saving',    to: 'crypto-alt' },
  { from: 'gen-z-saving',    to: 'referral-fatigue' },
]

function getNode(id: string) { return MAP_NODES.find(n => n.id === id)! }

// ─── Topic Map SVG ────────────────────────────────────────────────────────────

function TopicMap() {
  const [hovered, setHovered] = useState<string | null>(null)
  return (
    <svg width="280" height="240" viewBox="0 0 280 240" className="w-full">
      {/* Edges */}
      {MAP_EDGES.map((e, i) => {
        const a = getNode(e.from)
        const b = getNode(e.to)
        return (
          <line
            key={i}
            x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke="#e5e7eb" strokeWidth={1} opacity={0.6}
          />
        )
      })}
      {/* Nodes */}
      {MAP_NODES.map((n, i) => (
        <motion.g
          key={n.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 20 }}
          onHoverStart={() => setHovered(n.id)}
          onHoverEnd={() => setHovered(null)}
          style={{ cursor: 'pointer' }}
        >
          <motion.circle
            cx={n.x} cy={n.y} r={n.r}
            fill={n.high ? '#10b981' : '#f9fafb'}
            stroke={n.high ? '#059669' : '#e5e7eb'}
            strokeWidth={1.5}
            animate={{ scale: hovered === n.id ? 1.15 : 1 }}
            style={{ originX: `${n.x}px`, originY: `${n.y}px` }}
          />
          <text
            x={n.x} y={n.y + n.r + 10}
            textAnchor="middle"
            fontSize={9}
            fill={hovered === n.id ? '#111827' : '#6b7280'}
            fontFamily="inherit"
          >
            {n.label}
          </text>
        </motion.g>
      ))}
      {/* Tooltip */}
      {hovered && (() => {
        const node = getNode(hovered)
        return (
          <g>
            <rect x={node.x - 44} y={node.y - node.r - 26} width={88} height={20} rx={4} fill="#111827" />
            <text x={node.x} y={node.y - node.r - 12} textAnchor="middle" fontSize={9} fill="#fff" fontFamily="inherit">
              {node.label}
            </text>
          </g>
        )
      })()}
    </svg>
  )
}

// ─── TrendDetailCard ──────────────────────────────────────────────────────────

function TrendDetailCard({ topic, index }: { topic: DemoTopic; index: number }) {
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [saved, setSaved] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="rounded-xl border border-border bg-white p-6 space-y-4"
    >
      {/* Row 1: title + badge */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold text-ink leading-snug">{topic.label}</h3>
        <TrendBadge trend={topic.trend} />
      </div>

      {/* Row 2: sparkline + momentum */}
      <div className="flex items-center gap-4">
        <Sparkline data={topic.sparkline} width={160} height={36} />
        <span className="text-xs text-muted">{momentumLabel(topic.trend)}</span>
      </div>

      {/* Row 3: volume context */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-muted font-medium mb-1">Volume</p>
        <p className="text-[13px] text-ink-soft leading-relaxed">{topic.volumeContext}</p>
      </div>

      {/* Row 4: Why + Who grid */}
      <div className="grid grid-cols-2 gap-3 rounded-xl bg-surface p-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted font-medium mb-2">Why it&apos;s trending</p>
          <p className="text-[13px] text-ink-soft leading-relaxed">{topic.whyTrending}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted font-medium mb-2">Who&apos;s talking</p>
          <div className="flex flex-wrap gap-1.5">
            {topic.whosTalking.map((who) => (
              <span key={who} className="rounded-full bg-white border border-border px-2.5 py-0.5 text-[11px] text-ink-soft">
                {who}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Row 5: competitor activity */}
      <div className="flex items-start gap-2 rounded-lg bg-amber/5 border border-amber/20 p-3">
        <AlertTriangle size={14} className="text-amber shrink-0 mt-0.5" />
        <p className="text-[13px] text-ink-soft leading-relaxed">{topic.competitorActivity}</p>
      </div>

      {/* Row 6: the gap */}
      <div className="flex items-start gap-2 rounded-lg bg-emerald/5 border border-emerald/20 p-3">
        <Zap size={14} className="text-emerald shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] uppercase tracking-widest text-emerald font-semibold mb-0.5">The Gap</p>
          <p className="text-[13px] text-ink font-medium leading-relaxed">{topic.theGap}</p>
        </div>
      </div>

      {/* Row 7: top hook */}
      <div className="rounded-lg bg-surface p-3">
        <p className="text-[10px] uppercase tracking-widest text-muted font-medium mb-1.5">What&apos;s working</p>
        <p className="text-[13px] text-ink-soft italic leading-relaxed">&ldquo;{topic.topPerformingHook}&rdquo;</p>
      </div>

      {/* Row 8: CTAs */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => router.push('/content')}
          className="flex items-center gap-1.5 rounded-lg bg-emerald px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-dk transition-colors"
        >
          Generate content ideas
          <ChevronRight size={13} />
        </button>
        <button
          onClick={() => setSaved(!saved)}
          className={cn(
            'flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium transition-colors',
            saved ? 'bg-emerald/10 border-emerald/30 text-emerald-dk' : 'text-muted hover:text-ink hover:border-ink/30',
          )}
        >
          <Bookmark size={13} className={saved ? 'fill-emerald text-emerald' : ''} />
          {saved ? 'Saved' : 'Save topic'}
        </button>
      </div>
    </motion.div>
  )
}

// ─── Right Panel ──────────────────────────────────────────────────────────────

const SUB_TOPICS = ['Payments', 'Credit', 'Insurance', 'Compliance', 'Infrastructure', 'Consumer']

function RightPanel({
  checkedTopics, setCheckedTopics,
  trendDir, setTrendDir,
  myIndustryOnly, setMyIndustryOnly,
}: {
  checkedTopics: string[]
  setCheckedTopics: (v: string[]) => void
  trendDir: string
  setTrendDir: (v: string) => void
  myIndustryOnly: boolean
  setMyIndustryOnly: (v: boolean) => void
}) {
  return (
    <div className="space-y-4">
      {/* Filters card */}
      <div className="rounded-xl border border-border bg-white p-5">
        <p className="text-sm font-bold text-ink mb-4">Filter Topics</p>
        {/* Sub-topics */}
        <p className="text-[10px] uppercase tracking-widest text-muted font-medium mb-2">Industry sub-topics</p>
        <div className="grid grid-cols-2 gap-y-2 gap-x-3 mb-4">
          {SUB_TOPICS.map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={checkedTopics.includes(t)}
                onChange={(e) => {
                  setCheckedTopics(
                    e.target.checked
                      ? [...checkedTopics, t]
                      : checkedTopics.filter((x) => x !== t),
                  )
                }}
                className="h-3.5 w-3.5 rounded border-border accent-emerald"
              />
              <span className="text-xs text-ink-soft">{t}</span>
            </label>
          ))}
        </div>
        {/* Trend direction */}
        <p className="text-[10px] uppercase tracking-widest text-muted font-medium mb-2">Trend direction</p>
        <div className="space-y-1.5 mb-4">
          {['All', 'Rising only', 'Stable', 'Declining'].map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="trendDir"
                value={opt}
                checked={trendDir === opt}
                onChange={() => setTrendDir(opt)}
                className="h-3.5 w-3.5 accent-emerald"
              />
              <span className="text-xs text-ink-soft">{opt}</span>
            </label>
          ))}
        </div>
        {/* My industry toggle */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-ink-soft">My industry only</span>
          <button
            onClick={() => setMyIndustryOnly(!myIndustryOnly)}
            className={cn(
              'relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200',
              myIndustryOnly ? 'bg-emerald' : 'bg-border',
            )}
          >
            <span
              className={cn(
                'inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200',
                myIndustryOnly ? 'translate-x-4.5' : 'translate-x-0.5',
              )}
            />
          </button>
        </div>
      </div>

      {/* Topic map card */}
      <div className="rounded-xl border border-border bg-white p-5">
        <p className="text-sm font-bold text-ink mb-0.5">Topic Map</p>
        <p className="text-[11px] text-muted mb-3">How trends connect</p>
        <TopicMap />
      </div>
    </div>
  )
}

// ─── Mobile Filter Drawer ─────────────────────────────────────────────────────

function FilterDrawer({
  open, onClose,
  checkedTopics, setCheckedTopics,
  trendDir, setTrendDir,
  myIndustryOnly, setMyIndustryOnly,
}: {
  open: boolean
  onClose: () => void
  checkedTopics: string[]
  setCheckedTopics: (v: string[]) => void
  trendDir: string
  setTrendDir: (v: string) => void
  myIndustryOnly: boolean
  setMyIndustryOnly: (v: boolean) => void
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 inset-x-0 z-50 rounded-t-2xl bg-surface p-5 max-h-[80vh] overflow-y-auto md:hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-ink">Filters & Map</p>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-border/50">
                <X size={16} className="text-muted" />
              </button>
            </div>
            <RightPanel
              checkedTopics={checkedTopics}
              setCheckedTopics={setCheckedTopics}
              trendDir={trendDir}
              setTrendDir={setTrendDir}
              myIndustryOnly={myIndustryOnly}
              setMyIndustryOnly={setMyIndustryOnly}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TrendsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isDemo, setIsDemo] = useState(searchParams.get('demo') === 'true')

  useEffect(() => {
    const stored = typeof window !== 'undefined' && localStorage.getItem('strova-demo') === 'true'
    if (stored) setIsDemo(true)
  }, [])

  // Filters
  const [timeframe, setTimeframe] = useState<'This week' | 'This month' | 'Last 3 months'>('This week')
  const [formatFilter, setFormatFilter] = useState<'All' | 'LinkedIn' | 'Video' | 'Thread' | 'Email'>('All')
  const [checkedTopics, setCheckedTopics] = useState<string[]>([])
  const [trendDir, setTrendDir] = useState('All')
  const [myIndustryOnly, setMyIndustryOnly] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Filtered topics
  const filteredTopics = DEMO_TOPICS.filter((t) => {
    if (formatFilter !== 'All') {
      const allowed = FORMAT_MAP[formatFilter] ?? []
      if (!allowed.includes(t.format)) return false
    }
    if (trendDir === 'Rising only' && t.trend !== 'Rising') return false
    if (trendDir === 'Stable' && t.trend !== 'Stable') return false
    if (trendDir === 'Declining' && t.trend !== 'Declining') return false
    return true
  })

  // Top rising topic for prompt bar CTA
  const topRising = DEMO_TOPICS.find((t) => t.trend === 'Rising') ?? DEMO_TOPICS[0]

  const startup = isDemo
    ? { name: DEMO_DATA.profile.startupName, industry: DEMO_DATA.profile.industry, city: DEMO_DATA.profile.city }
    : { name: DEMO_STARTUP.name, industry: DEMO_STARTUP.industry, city: DEMO_STARTUP.city }

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
        <AppSidebar path={pathname ?? '/trends'} />

        {/* ── Scrollable content ── */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-[1200px] mx-auto w-full">

            {/* ── Page title bar ── */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-[28px] font-bold text-ink leading-tight" style={{ fontFamily: 'var(--font-bricolage, inherit)' }}>
                  Trends
                </h1>
                <p className="text-[13px] text-muted mt-0.5">
                  {startup.city} · {startup.industry} · Updated May 14, 2026
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {/* Timeframe segmented control */}
                <div className="flex rounded-lg border border-border bg-surface overflow-hidden text-xs font-medium">
                  {(['This week', 'This month', 'Last 3 months'] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setTimeframe(opt)}
                      className={cn(
                        'px-3 py-1.5 transition-colors duration-150',
                        timeframe === opt
                          ? 'bg-emerald text-white'
                          : 'text-ink-soft hover:text-ink hover:bg-border/30',
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {/* Format segmented control */}
                <div className="flex rounded-lg border border-border bg-surface overflow-hidden text-xs font-medium">
                  {(['All', 'LinkedIn', 'Video', 'Thread', 'Email'] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setFormatFilter(opt)}
                      className={cn(
                        'px-3 py-1.5 transition-colors duration-150',
                        formatFilter === opt
                          ? 'bg-emerald text-white'
                          : 'text-ink-soft hover:text-ink hover:bg-border/30',
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {/* Export button */}
                <button
                  disabled
                  className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted cursor-not-allowed opacity-50"
                >
                  <Download size={12} />
                  Export insights
                </button>
              </div>
            </div>

            {/* ── Quick stats strip ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
              {QUICK_STATS.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                  className="rounded-xl border border-border bg-white p-4"
                >
                  <p
                    className={cn(
                      'leading-none mb-1',
                      stat.mono
                        ? 'font-mono text-[36px] font-bold'
                        : 'text-[22px] font-bold',
                      stat.emerald ? 'text-emerald' : 'text-ink',
                    )}
                    style={!stat.mono ? { fontFamily: 'var(--font-bricolage, inherit)' } : undefined}
                  >
                    {stat.value}
                  </p>
                  <p className="text-[12px] text-muted leading-snug">{stat.label}</p>
                  {stat.sub && (
                    <p className="text-[11px] text-emerald font-medium mt-0.5">{stat.sub}</p>
                  )}
                </motion.div>
              ))}
            </div>

            {/* ── Two-panel layout ── */}
            <div className="flex gap-6 items-start">
              {/* ── Left: feed ── */}
              <div className="flex-1 min-w-0 space-y-6">
                <AnimatePresence>
                  {filteredTopics.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="rounded-xl border border-dashed border-border p-10 text-center"
                    >
                      <p className="text-sm font-medium text-ink mb-1">No signals match this filter</p>
                      <p className="text-xs text-muted">Try broadening your search — your market is moving fast.</p>
                    </motion.div>
                  ) : (
                    filteredTopics.map((topic, i) => (
                      <TrendDetailCard key={topic.id} topic={topic} index={i} />
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* ── Right: sticky panel (desktop only) ── */}
              <div className="hidden lg:block w-[300px] shrink-0 sticky top-4">
                <RightPanel
                  checkedTopics={checkedTopics}
                  setCheckedTopics={setCheckedTopics}
                  trendDir={trendDir}
                  setTrendDir={setTrendDir}
                  myIndustryOnly={myIndustryOnly}
                  setMyIndustryOnly={setMyIndustryOnly}
                />
              </div>
            </div>

          </div>

          {/* ── Sticky prompt bar ── */}
          <div className="sticky bottom-0 border-t border-border bg-white px-4 sm:px-6 py-3 flex items-center justify-between mb-[56px] md:mb-0">
            <p className="text-[14px] text-ink-soft">Ready to create content?</p>
            <button
              onClick={() => router.push('/content')}
              className="flex items-center gap-1.5 rounded-lg bg-emerald px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-dk transition-colors"
            >
              Generate ideas from trends
              <ChevronRight size={12} />
            </button>
          </div>
        </main>
      </div>

      {/* ── Mobile: filter FAB ── */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="fixed bottom-20 right-4 z-30 md:hidden flex items-center gap-2 rounded-full bg-emerald px-4 py-3 text-xs font-semibold text-white shadow-lg"
      >
        <SlidersHorizontal size={15} />
        Filter & Map
      </button>

      {/* ── Mobile bottom nav ── */}
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

      {/* ── Mobile filter drawer ── */}
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        checkedTopics={checkedTopics}
        setCheckedTopics={setCheckedTopics}
        trendDir={trendDir}
        setTrendDir={setTrendDir}
        myIndustryOnly={myIndustryOnly}
        setMyIndustryOnly={setMyIndustryOnly}
      />
    </div>
  )
}
