'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import Link from 'next/link'
import { AppSidebar, APP_NAV } from '@/components/ui/AppSidebar'
import {
  LayoutDashboard, TrendingUp, FileText, LayoutGrid, BarChart2,
  CheckCircle2, X, Bookmark, BookmarkCheck, Star, Download,
  ChevronDown, SlidersHorizontal,
} from 'lucide-react'

import { createBrowserClient } from '@/lib/supabase'
import type { Template } from '@/lib/types'
import { useContentStore } from '@/lib/stores/content'
import { TemplateCard, CATEGORY_CONFIG } from '@/components/ui/TemplateCard'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { DEMO_STARTUP, DEMO_CHANNELS, DEMO_DATA } from '@/lib/demo-data'

// ─── Filters ─────────────────────────────────────────────────────────────────

const CATEGORIES  = ['All', 'LinkedIn Carousel', 'Video Script', 'Email', 'Landing Page', 'Social Post']
const INDUSTRIES  = ['All', 'Fintech', 'Fashion', 'Food & Beverage', 'SaaS', 'E-commerce']
const PRICE_OPTS  = ['All', 'Free', 'Premium'] as const
const SORT_OPTS   = [
  { label: 'Popular',  value: 'popular' },
  { label: 'Newest',   value: 'newest' },
  { label: 'Trending', value: 'trending' },
] as const

type PriceFilter = typeof PRICE_OPTS[number]
type SortFilter  = typeof SORT_OPTS[number]['value']

// ─── Format → category mapping (from Zustand content store) ──────────────────

const FORMAT_TO_CATEGORY: Record<string, string> = {
  'linkedin-post':     'LinkedIn Carousel',
  'carousel':          'LinkedIn Carousel',
  'video-script':      'Video Script',
  'email':             'Email',
  'twitter-thread':    'Social Post',
  'instagram-caption': 'Social Post',
}

// ─── Mock templates (dev mode — mirrors seed SQL) ─────────────────────────────

const MOCK_TEMPLATES: Template[] = [
  // LinkedIn Carousel
  { id: 'lt-01', title: 'Fintech 101: 5 Things Every Lagos Millennial Should Know', designer_name: 'Adaeze Okafor', category: 'LinkedIn Carousel', industry_tags: ['Fintech','Finance'], preview_url: 'https://placehold.co/1280x720/0f172a/3b82f6?text=Fintech+101', asset_url: null, price: 0, trend_tags: ['Educational carousels','Thought leadership','Audience growth','Trust building'], downloads: 2847, rating: 4.8, active: true, created_at: '2026-04-01T00:00:00Z' },
  { id: 'lt-02', title: 'The Startup Pitch Deck Carousel', designer_name: 'Emeka Obi', category: 'LinkedIn Carousel', industry_tags: ['SaaS','Tech','Fintech'], preview_url: 'https://placehold.co/1280x720/1e1b4b/818cf8?text=Pitch+Deck', asset_url: null, price: 0, trend_tags: ['Investor outreach','Product launches','Founder storytelling','B2B positioning'], downloads: 1203, rating: 4.5, active: true, created_at: '2026-04-05T00:00:00Z' },
  { id: 'lt-03', title: 'Competitor Takedown: Why Founders Are Switching', designer_name: 'Chidi Nwachukwu', category: 'LinkedIn Carousel', industry_tags: ['SaaS','Fintech','E-commerce'], preview_url: 'https://placehold.co/1280x720/172554/60a5fa?text=Competitor+Takedown', asset_url: null, price: 3500, trend_tags: ['Competitive positioning','Conversion content','Decision-stage buyers','Brand differentiation'], downloads: 891, rating: 4.7, active: true, created_at: '2026-04-10T00:00:00Z' },
  { id: 'lt-04', title: 'Founder Story: From ₦0 to ₦10M MRR', designer_name: 'Femi Adebayo', category: 'LinkedIn Carousel', industry_tags: ['SaaS','Fintech'], preview_url: 'https://placehold.co/1280x720/0c1445/93c5fd?text=Founder+Story', asset_url: null, price: 2500, trend_tags: ['Founder-led content','Brand credibility','Community building','Viral potential'], downloads: 654, rating: 4.6, active: true, created_at: '2026-04-15T00:00:00Z' },
  { id: 'lt-05', title: 'Product Feature Drop: 7 Slides That Convert', designer_name: 'Seun Olatunji', category: 'LinkedIn Carousel', industry_tags: ['SaaS','Tech'], preview_url: 'https://placehold.co/1280x720/162032/7dd3fc?text=Feature+Drop', asset_url: null, price: 4000, trend_tags: ['Product launches','Feature announcements','User education','Engagement campaigns'], downloads: 432, rating: 4.4, active: true, created_at: '2026-04-20T00:00:00Z' },
  // Social Post
  { id: 'lt-06', title: 'Fashion Brand Launch Set (12 templates)', designer_name: 'Kemi Adeleke', category: 'Social Post', industry_tags: ['Fashion','Lifestyle','E-commerce'], preview_url: 'https://placehold.co/1080x1080/2d1b69/c4b5fd?text=Fashion+Launch', asset_url: null, price: 0, trend_tags: ['Brand launches','Instagram feed','Product reveals','Influencer campaigns'], downloads: 3210, rating: 4.9, active: true, created_at: '2026-03-20T00:00:00Z' },
  { id: 'lt-07', title: 'Food Story: Farm to Table Social Kit', designer_name: 'Chioma Eze', category: 'Social Post', industry_tags: ['Food & Beverage','Lifestyle'], preview_url: 'https://placehold.co/1080x1080/1c1917/a16207?text=Food+Story', asset_url: null, price: 0, trend_tags: ['Brand storytelling','Community engagement','Product photography captions','Seasonal campaigns'], downloads: 1876, rating: 4.7, active: true, created_at: '2026-03-25T00:00:00Z' },
  { id: 'lt-08', title: 'Ramadan & Eid Campaign Kit', designer_name: 'Habiba Yusuf', category: 'Social Post', industry_tags: ['E-commerce','Fashion','Food & Beverage'], preview_url: 'https://placehold.co/1080x1080/1a1a2e/c084fc?text=Ramadan+Kit', asset_url: null, price: 2000, trend_tags: ['Seasonal campaigns','Cultural marketing','Holiday promotions','Community reach'], downloads: 567, rating: 4.5, active: true, created_at: '2026-04-12T00:00:00Z' },
  // Video Script
  { id: 'lt-09', title: 'Fintech Explainer: How It Works in 60 Seconds', designer_name: 'Tunde Balogun', category: 'Video Script', industry_tags: ['Fintech','Finance'], preview_url: 'https://placehold.co/1280x720/111827/10b981?text=Fintech+Explainer', asset_url: null, price: 3000, trend_tags: ['Product explainers','Paid ads','Onboarding videos','App store previews'], downloads: 723, rating: 4.6, active: true, created_at: '2026-04-08T00:00:00Z' },
  { id: 'lt-10', title: 'Brand Documentary Script: The Origin Story', designer_name: 'Seun Olatunji', category: 'Video Script', industry_tags: ['Fashion','Lifestyle','E-commerce'], preview_url: 'https://placehold.co/1280x720/0f172a/34d399?text=Origin+Story', asset_url: null, price: 6000, trend_tags: ['Brand documentaries','Investor videos','Founder storytelling','Press features'], downloads: 298, rating: 4.8, active: true, created_at: '2026-04-18T00:00:00Z' },
  // Email
  { id: 'lt-11', title: 'Newsletter Header Pack (10 designs)', designer_name: 'Bayo Adeyemi', category: 'Email', industry_tags: ['SaaS','Fintech','E-commerce'], preview_url: 'https://placehold.co/800x600/f8fafc/1e293b?text=Newsletter+Headers', asset_url: null, price: 0, trend_tags: ['Weekly newsletters','Announcement emails','Re-engagement campaigns','Subscriber growth'], downloads: 4102, rating: 4.9, active: true, created_at: '2026-03-15T00:00:00Z' },
  { id: 'lt-12', title: 'Product Launch Email Sequence (5 emails)', designer_name: 'Amara Nwosu', category: 'Email', industry_tags: ['Fintech','SaaS','E-commerce'], preview_url: 'https://placehold.co/800x600/fffbeb/92400e?text=Launch+Sequence', asset_url: null, price: 4000, trend_tags: ['Product launches','Pre-launch hype','Waitlist conversion','Revenue campaigns'], downloads: 521, rating: 4.7, active: true, created_at: '2026-04-22T00:00:00Z' },
  { id: 'lt-13', title: 'Abandoned Cart Recovery Kit (3 emails)', designer_name: 'Folake Bello', category: 'Email', industry_tags: ['E-commerce','Fashion','Food & Beverage'], preview_url: 'https://placehold.co/800x600/fef3c7/78350f?text=Cart+Recovery', asset_url: null, price: 2500, trend_tags: ['Revenue recovery','E-commerce automation','Customer retention','Conversion optimisation'], downloads: 389, rating: 4.5, active: true, created_at: '2026-04-25T00:00:00Z' },
  // Landing Page
  { id: 'lt-14', title: 'Investment App Landing Page', designer_name: 'Ngozi Chukwu', category: 'Landing Page', industry_tags: ['Fintech','Finance'], preview_url: 'https://placehold.co/1440x900/ecfdf5/065f46?text=Investment+App', asset_url: null, price: 8000, trend_tags: ['App launches','Paid ad destinations','Sign-up conversion','Investor demos'], downloads: 187, rating: 4.9, active: true, created_at: '2026-04-28T00:00:00Z' },
  { id: 'lt-15', title: 'SaaS Free Trial Landing Page', designer_name: 'Dayo Adekunle', category: 'Landing Page', industry_tags: ['SaaS','Tech'], preview_url: 'https://placehold.co/1440x900/f0fdf4/14532d?text=SaaS+Free+Trial', asset_url: null, price: 7500, trend_tags: ['Trial sign-ups','Product-led growth','Demo requests','B2B acquisition'], downloads: 143, rating: 4.8, active: true, created_at: '2026-05-01T00:00:00Z' },
]

// ─── Personalised "Recommended for" ──────────────────────────────────────────

function getRecommendedFor(template: Template): string {
  const name = DEMO_STARTUP.name
  const topCh = DEMO_CHANNELS.find((c) => c.recommended)
  switch (template.category) {
    case 'LinkedIn Carousel':
      return `${name}: LinkedIn carousels are driving ${DEMO_CHANNELS.find(c => c.platform === 'LinkedIn')?.engagement ?? 4.8}% engagement in your sector — above industry average. Educational carousel formats consistently top saves.`
    case 'Video Script':
      return `${name}: Gen Z fintech content converts 2× better in short-form video. Your audience of ${DEMO_STARTUP.audience.split(',')[0]} responds strongly to founder-narrated scripts.`
    case 'Email':
      return `${name}: Email delivers the highest ROI of any channel for your audience segment. A consistent send schedule builds habitual opens within 6 weeks.`
    case 'Landing Page':
      return `${name}: A dedicated landing page typically improves paid ad conversion by 40–60%. Given your budget range, this pays back within the first campaign.`
    case 'Social Post':
      return `${name}: ${topCh?.platform ?? 'WhatsApp'} and Instagram social posts are your fastest-growing engagement formats right now. Visual templates accelerate production by 3×.`
    default:
      return `${name}: This template aligns with your ${DEMO_STARTUP.industry} growth goals.`
  }
}

// ─── Animations ───────────────────────────────────────────────────────────────

const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}

function FilterPill({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-colors',
        active ? 'bg-ink text-white border-ink' : 'bg-white text-ink-soft border-border hover:border-ink-soft hover:text-ink',
      )}
    >
      {label}
    </button>
  )
}

// ─── Preview Modal ────────────────────────────────────────────────────────────

function PreviewModal({
  template,
  isSaved,
  onClose,
  onSave,
  onCustomise,
}: {
  template: Template
  isSaved: boolean
  onClose: () => void
  onSave: () => void
  onCustomise: () => void
}) {
  const cat = CATEGORY_CONFIG[template.category] ?? { bg: 'bg-surface', text: 'text-muted' }
  const isFree = template.price === 0
  const rating = Number(template.rating).toFixed(1)
  const recommended = getRecommendedFor(template)

  // Close on backdrop click
  const backdropRef = useRef<HTMLDivElement>(null)
  const handleBackdrop = useCallback((e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose()
  }, [onClose])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <motion.div
      ref={backdropRef}
      className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleBackdrop}
    >
      <motion.div
        className="relative w-full sm:max-w-4xl bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden max-h-[92vh] flex flex-col sm:flex-row"
        initial={{ y: 60, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.97 }}
        transition={{ type: 'spring', damping: 28, stiffness: 340 }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-ink hover:bg-off-white transition-colors shadow-sm"
        >
          <X size={15} />
        </button>

        {/* Left — preview image (60% desktop, full-width mobile) */}
        <div className="sm:w-[60%] shrink-0 bg-off-white overflow-hidden max-h-60 sm:max-h-none">
          <img
            src={template.preview_url ?? `https://placehold.co/1280x720/f1f5f9/94a3b8?text=${encodeURIComponent(template.category)}`}
            alt={template.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right — details panel (40%) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title + designer */}
          <div className="space-y-1.5">
            <h2 className="text-[22px] font-bold text-ink leading-snug">{template.title}</h2>
            <div className="flex items-center gap-1.5">
              <p className="text-sm text-muted">{template.designer_name}</p>
              <CheckCircle2 size={13} className="text-emerald" />
              <span className="text-[10px] text-muted">Verified designer</span>
            </div>
          </div>

          {/* Category + industry tags */}
          <div className="flex flex-wrap gap-1.5">
            <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', cat.bg, cat.text)}>
              {template.category}
            </span>
            {template.industry_tags?.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-full text-xs bg-off-white text-ink-soft border border-border">
                {tag}
              </span>
            ))}
          </div>

          {/* Use cases */}
          {template.trend_tags && template.trend_tags.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-widest font-semibold text-muted mb-2">Use Cases</p>
              <ul className="space-y-1">
                {template.trend_tags.map((tag) => (
                  <li key={tag} className="flex items-start gap-2 text-xs text-ink-soft">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-emerald shrink-0" />
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommended for */}
          <div className="rounded-lg bg-emerald/5 border border-emerald/20 p-3 space-y-1">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-emerald">Recommended for {DEMO_STARTUP.name}</p>
            <p className="text-xs text-ink-soft leading-relaxed">{recommended}</p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs font-mono text-muted">
            <span className="flex items-center gap-1">
              <Download size={12} />
              {template.downloads.toLocaleString()} downloads
            </span>
            <span className="flex items-center gap-1">
              <Star size={12} className="text-amber fill-amber" />
              {rating} rating
            </span>
          </div>

          {/* Price + CTAs */}
          <div className="pt-1 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-ink">
                {isFree ? 'Free' : `₦${template.price.toLocaleString()}`}
              </p>
              {!isFree && (
                <span className="text-[10px] text-muted">One-time purchase</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button size="lg" className="flex-1" onClick={onCustomise}>
                Customise
              </Button>
              <button
                onClick={onSave}
                className={cn(
                  'h-11 w-11 rounded-lg border flex items-center justify-center shrink-0 transition-colors',
                  isSaved
                    ? 'bg-emerald/10 border-emerald/30 text-emerald'
                    : 'border-border text-muted hover:text-ink hover:border-ink/30',
                )}
                title={isSaved ? 'Saved' : 'Save for later'}
              >
                {isSaved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TemplatesPage() {
  const router = useRouter()
  const path   = usePathname() ?? '/templates'
  const searchParams = useSearchParams()

  const { templateFormat } = useContentStore()

  const [templates, setTemplates]         = useState<Template[]>([])
  const [loading, setLoading]             = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [industryFilter, setIndustryFilter] = useState('All')
  const [priceFilter, setPriceFilter]       = useState<PriceFilter>('All')
  const [sortBy, setSortBy]                 = useState<SortFilter>('popular')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [savedIds, setSavedIds]             = useState<Set<string>>(new Set())
  const [isDemo, setIsDemo] = useState(searchParams.get('demo') === 'true')

  useEffect(() => {
    const stored = typeof window !== 'undefined' && localStorage.getItem('strova-demo') === 'true'
    if (stored) setIsDemo(true)
  }, [])

  const startup = isDemo
    ? { name: DEMO_DATA.profile.startupName, industry: DEMO_DATA.profile.industry, city: DEMO_DATA.profile.city }
    : { name: DEMO_STARTUP.name, industry: DEMO_STARTUP.industry, city: DEMO_STARTUP.city }

  // Apply Zustand format pre-filter on mount
  useEffect(() => {
    const formatParam = searchParams?.get('format') ?? templateFormat
    if (formatParam) {
      const mapped = FORMAT_TO_CATEGORY[formatParam]
      if (mapped) setCategoryFilter(mapped)
    }
  }, [searchParams, templateFormat])

  // Load templates
  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        if (!cancelled) { setTemplates(MOCK_TEMPLATES); setLoading(false) }
        return
      }
      try {
        const supabase = createBrowserClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.replace('/auth'); return }

        const { data, error } = await supabase
          .from('templates').select('*').eq('active', true)
        if (error) throw error
        if (!cancelled) { setTemplates(data as Template[]); setLoading(false) }
      } catch {
        if (!cancelled) { setTemplates(MOCK_TEMPLATES); setLoading(false) }
      }
    }

    load()
    return () => { cancelled = true }
  }, [router])

  // Filtered + sorted templates
  const displayTemplates = useMemo(() => {
    let list = [...templates]

    if (categoryFilter !== 'All')
      list = list.filter((t) => t.category === categoryFilter)
    if (industryFilter !== 'All')
      list = list.filter((t) => t.industry_tags?.includes(industryFilter))
    if (priceFilter === 'Free')
      list = list.filter((t) => t.price === 0)
    if (priceFilter === 'Premium')
      list = list.filter((t) => t.price > 0)

    if (sortBy === 'popular')  list.sort((a, b) => b.downloads - a.downloads)
    if (sortBy === 'newest')   list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    if (sortBy === 'trending') list.sort((a, b) => Number(b.rating) - Number(a.rating))

    return list
  }, [templates, categoryFilter, industryFilter, priceFilter, sortBy])

  function toggleSave(id: string) {
    setSavedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="flex h-screen flex-col bg-off-white overflow-hidden">

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
        <AppSidebar path={path} />

        <main className="flex-1 overflow-y-auto pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-6">

            {/* Page header */}
            <div>
              <h1 className="text-[28px] font-bold text-ink leading-tight">Template Library</h1>
              <div className="flex items-center gap-1.5 mt-1">
                <p className="text-sm text-muted">Curated by vetted African designers</p>
                <CheckCircle2 size={14} className="text-emerald" />
              </div>
            </div>

            {/* Filter bar */}
            <div className="space-y-3">
              {/* Category */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-muted shrink-0">Category</span>
                {CATEGORIES.map((cat) => (
                  <FilterPill key={cat} label={cat} active={categoryFilter === cat} onClick={() => setCategoryFilter(cat)} />
                ))}
              </div>

              {/* Industry + Price + Sort row */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Industry */}
                <div className="flex items-center gap-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-muted shrink-0">Industry</span>
                  {INDUSTRIES.map((ind) => (
                    <FilterPill key={ind} label={ind} active={industryFilter === ind} onClick={() => setIndustryFilter(ind)} />
                  ))}
                </div>

                <div className="h-4 w-px bg-border hidden sm:block mx-1" />

                {/* Price */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-muted shrink-0">Price</span>
                  {PRICE_OPTS.map((p) => (
                    <FilterPill key={p} label={p} active={priceFilter === p} onClick={() => setPriceFilter(p)} />
                  ))}
                </div>

                <div className="ml-auto flex items-center gap-1.5">
                  <SlidersHorizontal size={12} className="text-muted" />
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-muted">Sort</span>
                  {SORT_OPTS.map((s) => (
                    <FilterPill key={s.value} label={s.label} active={sortBy === s.value} onClick={() => setSortBy(s.value)} />
                  ))}
                </div>
              </div>
            </div>

            {/* Result count */}
            <p className="text-xs text-muted font-mono">
              {loading ? 'Loading...' : `${displayTemplates.length} template${displayTemplates.length !== 1 ? 's' : ''}`}
            </p>

            {/* Template grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-xl bg-white border border-border overflow-hidden">
                    <div className="aspect-video bg-off-white animate-pulse" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 w-24 bg-off-white rounded animate-pulse" />
                      <div className="h-4 w-full bg-off-white rounded animate-pulse" />
                      <div className="h-3 w-32 bg-off-white rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : displayTemplates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
                <p className="text-sm font-medium text-ink">No templates match — try a different filter</p>
                <p className="text-xs text-muted">Every Lagos founder has a format that works for them. Try broadening your search.</p>
                <Button variant="secondary" size="sm" onClick={() => { setCategoryFilter('All'); setIndustryFilter('All'); setPriceFilter('All') }}>
                  Clear all filters
                </Button>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                variants={gridVariants}
                initial="hidden"
                animate="show"
              >
                <AnimatePresence mode="popLayout">
                  {displayTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onPreview={() => setSelectedTemplate(template)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-border flex">
        {APP_NAV.slice(0, 4).map(({ label, href, icon: Icon }) => {
          const active = path === href
          return (
            <Link key={href} href={href}
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

      {/* Preview modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <PreviewModal
            template={selectedTemplate}
            isSaved={savedIds.has(selectedTemplate.id)}
            onClose={() => setSelectedTemplate(null)}
            onSave={() => toggleSave(selectedTemplate.id)}
            onCustomise={() => router.push(`/templates/${selectedTemplate.id}/editor`)}
          />
        )}
      </AnimatePresence>

    </div>
  )
}
