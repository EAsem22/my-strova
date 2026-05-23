'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  MessageCircle,
  ChevronRight, Info, X, Check, ArrowUpRight, Zap,
  BarChart2, ChevronDown,
} from 'lucide-react'
import Link from 'next/link'
import { AppSidebar, APP_NAV } from '@/components/ui/AppSidebar'
import { cn } from '@/lib/utils'
import {
  DEMO_ANALYTICS,
  DEMO_STARTUP,
  DEMO_DATA,
  type DemoContentPerformance,
  type DemoChannelBreakdown,
  type DemoRecommendation,
} from '@/lib/demo-data'

// ─── useCountUp ───────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 700, active = true) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start: number | null = null
    const raf = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(target * eased))
      if (progress < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [target, duration, active])
  return count
}

// ─── Mini sparkline ───────────────────────────────────────────────────────────

function Sparkline({ data, w = 80, h = 28, color = '#10b981' }: { data: number[]; w?: number; h?: number; color?: string }) {
  if (!data.length) return null
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1
  const pad = 2
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2)
    const y = pad + (1 - (v - min) / range) * (h - pad * 2)
    return x + ',' + y
  }).join(' ')
  return (
    <svg width={w} height={h} viewBox={'0 0 ' + w + ' ' + h} fill="none">
      <polyline points={pts} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}


// ─── Platform channel icons ───────────────────────────────────────────────────

const PLATFORM_ICON: Record<string, React.FC<{ size?: number; className?: string }>> = {
  LinkedIn:   ({ size = 18, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  Instagram:  ({ size = 18, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  ),
  Twitter:    ({ size = 18, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  WhatsApp:   ({ size = 18, className = '' }) => <MessageCircle size={size} className={className} />,
}

const PLATFORM_COLOR: Record<string, string> = {
  LinkedIn:  '#0077b5',
  Instagram: '#e1306c',
  Twitter:   '#1da1f2',
  WhatsApp:  '#25d366',
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KPICard({ title, value, suffix = '', change, changeMuted, sparkline, pills, note, active, scale = 1 }:
  { title: string; value: number; suffix?: string; change?: string; changeMuted?: string; sparkline?: number[]; pills?: Array<{ label: string; color: string }>; note?: string; active: boolean; scale?: number }
) {
  const scaledTarget = Math.round(value * scale)
  const count = useCountUp(scaledTarget, 700, active)
  const ref = useRef<HTMLDivElement>(null)
  const displayStr = scale > 1
    ? (active ? (count / scale).toFixed(1) : value.toFixed(1))
    : value >= 1000
      ? (active ? count.toLocaleString() : value.toLocaleString())
      : (active ? String(count) : String(value))
  return (
    <div ref={ref} className="rounded-xl border border-border bg-white p-5">
      <p className="text-[11px] uppercase tracking-widest text-muted font-medium mb-3">{title}</p>
      <div className="flex items-end justify-between gap-2">
        <p className="font-mono text-[36px] font-bold text-ink leading-none">
          {displayStr}{suffix}
        </p>
        {sparkline && <Sparkline data={sparkline} />}
      </div>
      {change && (
        <span className="inline-block mt-2 rounded-full bg-emerald/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-dk">{change} vs last period</span>
      )}
      {changeMuted && <p className="text-[12px] text-muted mt-1">{changeMuted}</p>}
      {note && <p className="text-[12px] text-muted mt-1">{note}</p>}
      {pills && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {pills.map((pill) => (
            <span key={pill.label} className={"rounded-full px-2 py-0.5 text-[10px] font-medium " + pill.color}>{pill.label}</span>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Content performance table ────────────────────────────────────────────────

const FORMAT_BADGE: Record<string, string> = {
  'linkedin-post':      'bg-blue-100 text-blue-700',
  'carousel':           'bg-violet-100 text-violet-700',
  'twitter-thread':     'bg-sky-100 text-sky-700',
  'instagram-caption':  'bg-pink-100 text-pink-700',
  'email':              'bg-amber-100 text-amber-700',
}
const FORMAT_LABEL: Record<string, string> = {
  'linkedin-post': 'LinkedIn Post', 'carousel': 'Carousel',
  'twitter-thread': 'Thread', 'instagram-caption': 'Reel / Caption', 'email': 'Broadcast',
}
const STATUS_CONFIG = {
  'top-performer':   { label: 'Top performer',    cls: 'bg-emerald/10 text-emerald-dk' },
  'average':         { label: 'Average',           cls: 'bg-surface text-muted border border-border' },
  'underperforming': { label: 'Underperforming',   cls: 'bg-amber/10 text-amber' },
}

function ContentRow({ item, index }: { item: DemoContentPerformance; index: number }) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const PIcon = PLATFORM_ICON[item.channel]
  const status = STATUS_CONFIG[item.status]
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.04 }}
      className="border-b border-border last:border-0"
    >
      {/* Main row */}
      <div
        className="flex items-center gap-4 px-5 py-4 hover:bg-surface/60 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink leading-snug line-clamp-2">{item.title}</p>
          <p className="text-[11px] text-muted mt-0.5">{new Date(item.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>
        {/* Format */}
        <span className={"hidden sm:inline rounded-full px-2.5 py-0.5 text-[10px] font-semibold whitespace-nowrap shrink-0 " + FORMAT_BADGE[item.format]}>
          {FORMAT_LABEL[item.format]}
        </span>
        {/* Channel */}
        <div className="hidden md:flex items-center gap-1.5 shrink-0" style={{ color: PLATFORM_COLOR[item.channel] }}>
          {PIcon && <PIcon size={14} />}
          <span className="text-[13px] text-ink-soft">{item.channel}</span>
        </div>
        {/* Stats */}
        <span className="font-mono text-[13px] text-ink tabular-nums shrink-0 w-20 text-right">{item.impressions.toLocaleString()}</span>
        <span className="font-mono text-[13px] text-ink tabular-nums shrink-0 w-14 text-right">{item.engagementRate}%</span>
        <span className="font-mono text-[13px] text-muted tabular-nums shrink-0 w-12 text-right hidden lg:block">{item.saves}</span>
        {/* Status */}
        <span className={"hidden xl:inline rounded-full px-2.5 py-0.5 text-[10px] font-semibold whitespace-nowrap shrink-0 " + status.cls}>{status.label}</span>
        {/* Expand */}
        <ChevronDown size={14} className={"text-muted transition-transform shrink-0 " + (expanded ? 'rotate-180' : '')} />
      </div>
      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mx-5 mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-lg bg-emerald/5 border-l-[3px] border-emerald p-3">
                <p className="text-[10px] uppercase tracking-widest text-emerald font-semibold mb-1">What worked</p>
                <p className="text-[13px] text-ink-soft leading-relaxed">{item.whatWorked}</p>
              </div>
              <div className="rounded-lg bg-amber/5 border-l-[3px] border-amber p-3">
                <p className="text-[10px] uppercase tracking-widest text-amber font-semibold mb-1">What to improve</p>
                <p className="text-[13px] text-ink-soft leading-relaxed">{item.whatToImprove}</p>
              </div>
              <div className="rounded-lg bg-surface border-l-[3px] border-ink/20 p-3 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted font-semibold mb-1">Next idea</p>
                  <p className="text-[13px] text-ink-soft">Generate a follow-up piece for this topic</p>
                </div>
                <button onClick={() => router.push('/content')} className="mt-3 text-[12px] text-emerald font-semibold hover:text-emerald-dk transition-colors">
                  Create this →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Channel card ─────────────────────────────────────────────────────────────

function ChannelBar({ value, max, delay }: { value: number; max: number; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const pct = (value / max) * 100
  return (
    <div ref={ref} className="flex flex-col items-center gap-1 flex-1">
      <div className="w-full h-20 bg-surface rounded-t-sm flex items-end overflow-hidden">
        <motion.div
          initial={{ height: 0 }}
          animate={inView ? { height: pct + '%' } : {}}
          transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full bg-emerald rounded-t-sm"
        />
      </div>
    </div>
  )
}

function ChannelCard({ ch }: { ch: DemoChannelBreakdown }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const engCount = useCountUp(ch.engagementRate * 10, 700, inView)
  const PIcon = PLATFORM_ICON[ch.platform]
  const maxBar = Math.max(...ch.barChart)
  return (
    <div ref={ref} className="rounded-xl border border-border bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span style={{ color: PLATFORM_COLOR[ch.platform] }}>
            {PIcon && <PIcon size={24} />}
          </span>
          <span className="text-lg font-bold text-ink" style={{ fontFamily: 'var(--font-bricolage, inherit)' }}>{ch.platform}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-emerald" />
          <span className="text-[11px] text-muted">Active</span>
        </div>
      </div>
      <p className="font-mono text-[40px] font-bold text-ink leading-none mb-1">
        {inView ? (engCount / 10).toFixed(1) : ch.engagementRate.toFixed(1)}%
      </p>
      <p className="text-[12px] text-muted mb-4">avg engagement rate</p>
      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'Impressions', value: ch.impressions },
          { label: 'New followers', value: ch.followersGained > 0 ? '+' + ch.followersGained : '—' },
          { label: 'Posts', value: ch.postsPublished },
        ].map((s) => (
          <div key={s.label} className="rounded-lg bg-surface p-2.5">
            <p className="font-mono text-sm font-bold text-ink">{s.value}</p>
            <p className="text-[10px] text-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      {/* Bar chart */}
      <div className="flex gap-1 mb-4">
        {ch.barChart.map((v, i) => (
          <ChannelBar key={i} value={v} max={maxBar} delay={i * 0.06} />
        ))}
      </div>
      {/* Best format */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] text-muted">Best format</span>
        <span className="text-[11px] font-semibold text-ink">{ch.bestFormat}</span>
      </div>
      {/* Recommendation */}
      <div className="rounded-lg bg-emerald/5 border border-emerald/20 p-3">
        <p className="text-[10px] uppercase tracking-widest text-emerald font-semibold mb-1 flex items-center gap-1"><Zap size={10} /> Recommendation</p>
        <p className="text-[12px] text-ink-soft leading-relaxed">{ch.recommendation}</p>
      </div>
    </div>
  )
}

// ─── Recommendation card ──────────────────────────────────────────────────────

const PRIORITY_CONFIG = {
  'high':       { label: 'High priority', cls: 'bg-red/10 text-red' },
  'this-week':  { label: 'This week',     cls: 'bg-amber/10 text-amber' },
  'experiment': { label: 'Experiment',    cls: 'bg-surface text-muted border border-border' },
}

function RecommendationCard({ rec, index }: { rec: DemoRecommendation; index: number }) {
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const pri = PRIORITY_CONFIG[rec.priority]
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="rounded-xl border border-border bg-white p-5 flex flex-col border-t-[3px] border-t-emerald"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className={"rounded-full px-2.5 py-0.5 text-[10px] font-semibold " + pri.cls}>{pri.label}</span>
      </div>
      <h3 className="text-[15px] font-bold text-ink leading-snug mb-2">{rec.title}</h3>
      <p className="text-[13px] text-ink-soft leading-relaxed flex-1">{rec.reasoning}</p>
      <div className="flex flex-wrap gap-1.5 mt-3">
        <span className="rounded-full bg-emerald/10 text-emerald-dk px-2.5 py-0.5 text-[10px] font-medium">{rec.trendTag}</span>
        <span className="rounded-full bg-surface border border-border text-muted px-2.5 py-0.5 text-[10px] font-medium">{rec.channelTag}</span>
      </div>
      <button
        onClick={() => router.push('/content')}
        className="mt-4 w-full rounded-lg bg-emerald py-2.5 text-xs font-semibold text-white hover:bg-emerald-dk transition-colors"
      >
        Create this →
      </button>
    </motion.div>
  )
}

// ─── Gate Screen ──────────────────────────────────────────────────────────────

function GateScreen() {
  const router = useRouter()
  const [toast, setToast] = useState<string | null>(null)

  function handleConnect(platform: string) {
    setToast(platform)
    setTimeout(() => setToast(null), 3500)
  }

  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Blurred demo behind */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none"
        style={{ filter: 'blur(8px)', opacity: 0.4 }}>
        <DemoContent demo={DEMO_ANALYTICS} blurred />
      </div>

      {/* Overlay card */}
      <div className="relative z-10 flex items-center justify-center min-h-full py-16 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-border p-8 text-center"
        >
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-lt">
            <BarChart2 size={26} className="text-emerald-dk" />
          </div>
          <h2 className="text-xl font-bold text-ink mb-2">Connect your channels to unlock this</h2>
          <p className="text-sm text-ink-soft leading-relaxed mb-7">
            Link your social accounts and let Strova IQ do the heavy lifting — real performance data, AI-powered insights, and recommendations built for your Lagos audience.
          </p>

          <div className="space-y-3 mb-6">
            {[
              { label: 'Connect LinkedIn',    platform: 'LinkedIn',  color: '#0A66C2' },
              { label: 'Connect Instagram',   platform: 'Instagram', color: '#E1306C' },
              { label: 'Connect X / Twitter', platform: 'Twitter',   color: '#1DA1F2' },
            ].map(({ label, platform, color }) => {
              const PIcon = PLATFORM_ICON[platform]
              return (
                <button
                  key={label}
                  onClick={() => handleConnect(platform)}
                  className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-ink hover:bg-white hover:shadow-sm transition-all"
                >
                  <span style={{ color }}>{PIcon && <PIcon size={18} />}</span>
                  <span>{label}</span>
                  <ChevronRight size={15} className="ml-auto text-muted" />
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[11px] text-muted font-medium">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <button
            onClick={() => router.push('/analytics?demo=true')}
            className="text-sm font-semibold text-emerald-dk hover:text-emerald transition-colors underline underline-offset-2"
          >
            View demo analytics →
          </button>
        </motion.div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 32 }}
            transition={{ duration: 0.3 }}
            className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-xl bg-white border border-border shadow-lg px-4 py-3"
          >
            <Check size={15} className="text-emerald shrink-0" />
            <span className="text-sm font-medium text-ink">{toast} connected! Syncing data…</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Demo Banner ──────────────────────────────────────────────────────────────

function DemoBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="flex items-center gap-3 bg-amber-50 border-b border-amber-200 px-4 sm:px-8 py-2.5">
      <Info size={15} className="text-amber-600 shrink-0" />
      <span className="text-xs text-amber-800 font-medium flex-1">
        You&apos;re viewing <strong>demo data</strong>. Connect your channels to see what your market is actually doing.
      </span>
      <button onClick={onDismiss} className="text-amber-600 hover:text-amber-800 transition-colors ml-2">
        <X size={15} />
      </button>
    </div>
  )
}

// ─── Demo Content (shared between gate bg + full demo view) ──────────────────

interface DemoContentProps {
  demo: typeof DEMO_ANALYTICS
  blurred?: boolean
}

function DemoContent({ demo, blurred }: DemoContentProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const active = inView && !blurred

  // Build 4 KPI card props from demo.overview
  const kpis = [
    {
      title: 'Total Impressions',
      value: demo.overview.impressions.value,
      change: demo.overview.impressions.change,
      sparkline: demo.overview.impressions.sparkline,
    },
    {
      title: 'Avg. Engagement Rate',
      value: demo.overview.engagementRate.value,
      suffix: '%',
      scale: 10,
      change: demo.overview.engagementRate.change,
      sparkline: demo.overview.engagementRate.sparkline,
    },
    {
      title: 'Content Published',
      value: demo.overview.contentPublished.value,
      changeMuted: `Across ${demo.overview.contentPublished.channels} channels`,
      pills: demo.overview.contentPublished.formats,
    },
    {
      title: 'Top Channel',
      value: demo.overview.topChannel.engagement,
      suffix: '%',
      scale: 10,
      note: `${demo.overview.topChannel.name} engagement rate`,
    },
  ]

  return (
    <div ref={ref} className="px-4 sm:px-8 py-6 space-y-10">
      {/* Section 1: Performance Overview */}
      <section>
        <h2 className="text-[13px] font-semibold text-muted uppercase tracking-wider mb-4">Performance Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <KPICard key={kpi.title} {...kpi} active={active} />
          ))}
        </div>
      </section>

      {/* Section 2: Content Performance Table */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[13px] font-semibold text-muted uppercase tracking-wider">Content Performance</h2>
          <span className="text-[11px] text-muted">{demo.contentPerformance.length} pieces</span>
        </div>
        <div className="rounded-2xl border border-border bg-white overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid md:grid-cols-[1fr_100px_80px_90px_90px_80px_80px] gap-3 px-5 py-3 border-b border-border bg-surface text-[11px] font-semibold text-muted uppercase tracking-wider">
            <span>Title</span>
            <span>Format</span>
            <span>Channel</span>
            <span className="text-right">Impressions</span>
            <span className="text-right">Engagement</span>
            <span className="text-right">Saves</span>
            <span className="text-right">Status</span>
          </div>
          {demo.contentPerformance.map((item, i) => (
            <ContentRow key={item.id} item={item} index={i} />
          ))}
        </div>
      </section>

      {/* Section 3: Channel Breakdown */}
      <section>
        <h2 className="text-[13px] font-semibold text-muted uppercase tracking-wider mb-4">Channel Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {demo.channelBreakdown.map((ch) => (
            <ChannelCard key={ch.platform} ch={ch} />
          ))}
        </div>
      </section>

      {/* Section 4: AI Analysis */}
      <section>
        <h2 className="text-[13px] font-semibold text-muted uppercase tracking-wider mb-4">AI Performance Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* What Worked */}
          <div className="rounded-2xl border border-border bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-emerald" />
              <span className="text-sm font-bold text-ink">What Worked</span>
            </div>
            <ul className="space-y-3">
              {demo.aiAnalysis.whatWorked.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.35 }}
                  className="flex items-start gap-2.5 text-sm text-ink-soft leading-relaxed"
                >
                  <Check size={14} className="text-emerald mt-0.5 shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
          {/* What to Improve */}
          <div className="rounded-2xl border border-border bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-sm font-bold text-ink">What to Improve</span>
            </div>
            <ul className="space-y-3">
              {demo.aiAnalysis.whatToImprove.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.35 }}
                  className="flex items-start gap-2.5 text-sm text-ink-soft leading-relaxed"
                >
                  <ArrowUpRight size={14} className="text-amber-500 mt-0.5 shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Section 5: Next Recommendations */}
      <section className="pb-6">
        <h2 className="text-[13px] font-semibold text-muted uppercase tracking-wider mb-4">Next Content Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demo.nextRecommendations.map((rec, i) => (
            <RecommendationCard key={rec.id} rec={rec} index={i} />
          ))}
        </div>
      </section>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const path = usePathname()
  const searchParams = useSearchParams()
  const isDemo = searchParams.get('demo') === 'true'
  const [bannerVisible, setBannerVisible] = useState(true)

  // Persist demo mode so badge shows on all other pages
  useEffect(() => {
    if (isDemo) localStorage.setItem('strova-demo', 'true')
  }, [isDemo])
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d')

  const startup = isDemo
    ? { name: DEMO_DATA.profile.startupName, industry: DEMO_DATA.profile.industry, city: DEMO_DATA.profile.city }
    : { name: DEMO_STARTUP.name, industry: DEMO_STARTUP.industry, city: DEMO_STARTUP.city }

  const DATE_RANGES: { label: string; value: typeof dateRange }[] = [
    { label: '7 days', value: '7d' },
    { label: '30 days', value: '30d' },
    { label: '90 days', value: '90d' },
  ]

  return (
    <div className="flex h-screen flex-col bg-surface">
      {/* Top nav */}
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

      <div className="flex flex-1 overflow-hidden">
        <AppSidebar path={path} locked={!isDemo} />

        <main className="flex-1 overflow-y-auto flex flex-col">
          {/* Sub-header */}
          <div className="sticky top-0 z-20 flex items-center gap-4 border-b border-border bg-white px-4 sm:px-8 py-3">
            <div>
              <h1 className="text-[17px] font-extrabold text-ink tracking-tight leading-none">Analytics</h1>
              <p className="text-[12px] text-muted mt-0.5">Track performance across all channels</p>
            </div>
            <div className="flex-1" />
            {/* Date range toggle */}
            {isDemo && (
              <div className="hidden sm:flex rounded-lg border border-border bg-surface p-0.5 gap-0.5">
                {DATE_RANGES.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setDateRange(value)}
                    className={cn(
                      'px-3 py-1.5 rounded-md text-xs font-semibold transition-colors',
                      dateRange === value
                        ? 'bg-white text-ink shadow-sm'
                        : 'text-muted hover:text-ink',
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Demo banner */}
          <AnimatePresence>
            {isDemo && bannerVisible && (
              <motion.div
                key="banner"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <DemoBanner onDismiss={() => setBannerVisible(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content */}
          <AnimatePresence mode="wait">
            {isDemo ? (
              <motion.div
                key="demo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1"
              >
                <DemoContent demo={DEMO_ANALYTICS} />
              </motion.div>
            ) : (
              <motion.div
                key="gate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                <GateScreen />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile bottom nav */}
          <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-border flex z-30">
            {APP_NAV.map(({ label, href, icon: Icon }) => {
              const active = path === href
              return (
                <Link key={href} href={href}
                  className={cn(
                    'flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition-colors',
                    active ? 'text-emerald-dk' : 'text-muted',
                  )}
                >
                  <Icon size={18} strokeWidth={1.8} />
                  {label}
                </Link>
              )
            })}
          </nav>
        </main>
      </div>
    </div>
  )
}