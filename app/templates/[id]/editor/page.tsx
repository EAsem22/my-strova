'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Upload,
  Wand2,
  Download,
  Check,
  Loader2,
  Sparkles,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DEMO_STARTUP } from '@/lib/demo-data'
import { MOCK_TEMPLATES } from '@/lib/mock-templates'
import { useContentStore } from '@/lib/stores/content'
import type { Template } from '@/lib/types'

// ─── Font options ─────────────────────────────────────────────────────────────

const FONT_OPTIONS = [
  { label: 'Bricolage Grotesque', value: 'Bricolage Grotesque, sans-serif' },
  { label: 'Inter',               value: 'Inter, sans-serif' },
  { label: 'Lato',                value: 'Lato, sans-serif' },
]

// ─── Brand kit (persisted to localStorage) ────────────────────────────────────

interface BrandKit {
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  logoDataUrl: string | null
}

const DEFAULT_BRAND: BrandKit = {
  primaryColor: '#10b981',
  secondaryColor: '#111827',
  fontFamily: 'Inter, sans-serif',
  logoDataUrl: null,
}

function loadBrandKit(): BrandKit {
  if (typeof window === 'undefined') return DEFAULT_BRAND
  try {
    const raw = localStorage.getItem('strova-brand-kit')
    if (raw) return { ...DEFAULT_BRAND, ...JSON.parse(raw) }
  } catch {}
  return DEFAULT_BRAND
}

function saveBrandKit(kit: BrandKit) {
  try { localStorage.setItem('strova-brand-kit', JSON.stringify(kit)) } catch {}
}

// ─── Debounce ─────────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

// ─── Preview components ───────────────────────────────────────────────────────

interface PreviewProps {
  headline: string
  body: string
  cta: string
  brand: BrandKit
}

function LinkedInPreview({ headline, body, cta, brand }: PreviewProps) {
  return (
    <div
      className="w-full aspect-[4/3] rounded-2xl overflow-hidden flex flex-col"
      style={{ background: brand.secondaryColor, fontFamily: brand.fontFamily }}
    >
      <div className="h-1 w-full shrink-0" style={{ background: brand.primaryColor }} />
      <div className="flex-1 flex flex-col justify-between p-10">
        <div>
          {brand.logoDataUrl ? (
            <img src={brand.logoDataUrl} alt="" className="h-9 w-auto object-contain mb-7" />
          ) : (
            <div
              className="h-8 px-3 rounded-md inline-flex items-center text-[11px] font-bold tracking-widest mb-7"
              style={{ background: brand.primaryColor, color: '#fff' }}
            >
              {DEMO_STARTUP.name.toUpperCase()}
            </div>
          )}
          <h2 className="text-2xl font-bold leading-tight mb-4" style={{ color: '#fff', fontFamily: brand.fontFamily }}>
            {headline || 'Your headline goes here'}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)', fontFamily: brand.fontFamily }}>
            {body || 'Your supporting text will appear here. Keep it concise and impactful.'}
          </p>
        </div>
        <div className="flex items-center justify-between mt-8">
          <span className="text-xs font-semibold px-5 py-2 rounded-full" style={{ background: brand.primaryColor, color: '#fff' }}>
            {cta || 'Read more →'}
          </span>
          <span className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>Slide 1 / 7</span>
        </div>
      </div>
    </div>
  )
}

function SocialPostPreview({ headline, body, cta, brand }: PreviewProps) {
  return (
    <div
      className="w-full aspect-square rounded-2xl overflow-hidden flex flex-col items-center justify-center p-10 text-center"
      style={{ background: brand.primaryColor, fontFamily: brand.fontFamily }}
    >
      {brand.logoDataUrl ? (
        <img src={brand.logoDataUrl} alt="" className="h-10 w-auto object-contain mb-5" />
      ) : (
        <div className="text-[11px] font-bold tracking-widest mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {DEMO_STARTUP.name.toUpperCase()}
        </div>
      )}
      <h2 className="text-2xl font-bold leading-tight mb-3" style={{ color: '#fff', fontFamily: brand.fontFamily }}>
        {headline || 'Your headline here'}
      </h2>
      <p className="text-sm leading-relaxed mb-7" style={{ color: 'rgba(255,255,255,0.75)', fontFamily: brand.fontFamily }}>
        {body || 'Supporting text for your social post. Keep it punchy.'}
      </p>
      <span className="text-xs font-semibold px-5 py-2.5 rounded-full border-2" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}>
        {cta || 'Follow for more →'}
      </span>
    </div>
  )
}

function EmailPreview({ headline, body, cta, brand }: PreviewProps) {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-border bg-white" style={{ fontFamily: brand.fontFamily }}>
      <div className="px-8 py-5 flex items-center justify-between" style={{ background: brand.secondaryColor }}>
        {brand.logoDataUrl ? (
          <img src={brand.logoDataUrl} alt="" className="h-7 w-auto object-contain" />
        ) : (
          <span className="text-sm font-bold tracking-wider" style={{ color: brand.primaryColor }}>{DEMO_STARTUP.name}</span>
        )}
        <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>View in browser</span>
      </div>
      <div className="px-8 py-8">
        <div className="h-0.5 w-12 rounded mb-5" style={{ background: brand.primaryColor }} />
        <h2 className="text-xl font-bold text-ink leading-tight mb-3">{headline || 'Your email subject line'}</h2>
        <p className="text-sm text-ink-soft leading-relaxed mb-6">
          {body || 'Your email body content goes here. Deliver your main message and drive action.'}
        </p>
        <span className="inline-block text-sm font-semibold px-6 py-3 rounded-lg text-white" style={{ background: brand.primaryColor }}>
          {cta || 'Read more →'}
        </span>
      </div>
      <div className="px-8 py-4 border-t border-border text-[11px] text-muted">
        Unsubscribe · {DEMO_STARTUP.name} · Lagos, Nigeria
      </div>
    </div>
  )
}

function VideoScriptPreview({ headline, body, cta, brand }: PreviewProps) {
  return (
    <div className="w-full aspect-video rounded-2xl overflow-hidden flex flex-col" style={{ background: '#0a0a0a', fontFamily: brand.fontFamily }}>
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
        <div className="text-[10px] font-mono tracking-widest mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>SCENE 01 — HOOK</div>
        <h2 className="text-2xl font-bold leading-tight mb-4" style={{ color: brand.primaryColor, fontFamily: brand.fontFamily }}>
          {headline || 'Your video hook goes here'}
        </h2>
        <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: brand.fontFamily }}>
          {body || 'Script narration text. Speak directly to camera. Under 30 seconds.'}
        </p>
      </div>
      <div className="px-6 py-3 flex items-center justify-between" style={{ background: brand.primaryColor + '18', borderTop: `1px solid ${brand.primaryColor}30` }}>
        <span className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>00:00 — 00:30</span>
        <span className="text-xs font-semibold" style={{ color: brand.primaryColor }}>{cta || 'Link in bio →'}</span>
      </div>
    </div>
  )
}

function LandingPagePreview({ headline, body, cta, brand }: PreviewProps) {
  return (
    <div className="w-full rounded-2xl overflow-hidden" style={{ fontFamily: brand.fontFamily }}>
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-border">
        {brand.logoDataUrl ? (
          <img src={brand.logoDataUrl} alt="" className="h-6 w-auto object-contain" />
        ) : (
          <span className="text-sm font-bold" style={{ color: brand.secondaryColor }}>{DEMO_STARTUP.name}</span>
        )}
        <span className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white" style={{ background: brand.primaryColor }}>
          {cta || 'Get started'}
        </span>
      </div>
      <div
        className="px-10 py-14 text-center"
        style={{ background: `linear-gradient(135deg, ${brand.secondaryColor} 0%, ${brand.primaryColor}30 100%)` }}
      >
        <h1 className="text-3xl font-bold leading-tight mb-4 text-white" style={{ fontFamily: brand.fontFamily }}>
          {headline || 'Your hero headline goes here'}
        </h1>
        <p className="text-sm leading-relaxed max-w-sm mx-auto mb-8" style={{ color: 'rgba(255,255,255,0.65)', fontFamily: brand.fontFamily }}>
          {body || 'Hero subheadline. Your core value proposition in one sentence.'}
        </p>
        <span className="inline-block text-sm font-bold px-8 py-3.5 rounded-xl text-white shadow-lg" style={{ background: brand.primaryColor }}>
          {cta || 'Start for free →'}
        </span>
      </div>
    </div>
  )
}

function TemplatePreview(props: PreviewProps & { template: Template }) {
  const { template, ...rest } = props
  switch (template.category) {
    case 'LinkedIn Carousel': return <LinkedInPreview {...rest} />
    case 'Social Post':       return <SocialPostPreview {...rest} />
    case 'Email':             return <EmailPreview {...rest} />
    case 'Video Script':      return <VideoScriptPreview {...rest} />
    case 'Landing Page':      return <LandingPagePreview {...rest} />
    default:                  return <LinkedInPreview {...rest} />
  }
}

// ─── Colour swatch input ──────────────────────────────────────────────────────

function ColourInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <span className="text-xs text-ink-soft">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-mono text-muted">{value}</span>
        <div className="relative h-7 w-7 rounded-md border border-border overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
          <div className="absolute inset-0" style={{ background: value }} />
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </div>
      </div>
    </label>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4500)
    return () => clearTimeout(t)
  }, [onDismiss])
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl bg-ink px-5 py-3.5 shadow-xl"
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald shrink-0">
        <Check size={13} className="text-white" />
      </div>
      <p className="text-sm text-white font-medium">{message}</p>
      <button onClick={onDismiss} className="ml-1 text-white/50 hover:text-white transition-colors">
        <X size={14} />
      </button>
    </motion.div>
  )
}

// ─── Logo upload zone ─────────────────────────────────────────────────────────

function LogoUpload({ logoDataUrl, onChange }: { logoDataUrl: string | null; onChange: (v: string | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => onChange(e.target?.result as string)
    reader.readAsDataURL(file)
  }, [onChange])

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          const f = e.dataTransfer.files[0]
          if (f) handleFile(f)
        }}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 cursor-pointer transition-colors',
          dragging ? 'border-emerald bg-emerald/5' : 'border-border hover:border-emerald/50 hover:bg-surface',
        )}
      >
        {logoDataUrl ? (
          <div className="relative">
            <img src={logoDataUrl} alt="Logo" className="max-h-12 w-auto object-contain" />
            <button
              onClick={(e) => { e.stopPropagation(); onChange(null) }}
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red/90 flex items-center justify-center hover:bg-red"
            >
              <X size={10} className="text-white" />
            </button>
          </div>
        ) : (
          <>
            <Upload size={18} className="text-muted mb-2" />
            <p className="text-[11px] text-muted text-center">Drop logo or click to upload</p>
            <p className="text-[10px] text-muted/60 mt-0.5">PNG, SVG or JPG</p>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionHeader({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] uppercase tracking-widest text-muted font-semibold mb-3">{children}</p>
}

// ─── Main editor page ─────────────────────────────────────────────────────────

export default function EditorPage() {
  const router = useRouter()
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id ?? '')
  const template = MOCK_TEMPLATES.find((t) => t.id === id) ?? MOCK_TEMPLATES[0]

  // Brand kit — hydrate from localStorage after mount
  const [brand, setBrand] = useState<BrandKit>(DEFAULT_BRAND)
  useEffect(() => { setBrand(loadBrandKit()) }, [])
  const updateBrand = useCallback((patch: Partial<BrandKit>) => {
    setBrand((prev) => {
      const next = { ...prev, ...patch }
      saveBrandKit(next)
      return next
    })
  }, [])

  // Content fields — pre-seeded from linked idea when available
  const { selectedIdea, setSelectedIdea } = useContentStore()
  const [ideaBanner, setIdeaBanner] = useState(true)

  const [headline, setHeadline] = useState(() => selectedIdea?.title ?? '')
  const [body, setBody]         = useState(() => selectedIdea?.whyItWillWork ?? '')
  const [cta, setCta]           = useState(() => selectedIdea?.suggestedCTA ?? '')

  // Debounced preview values
  const dHeadline = useDebounce(headline)
  const dBody     = useDebounce(body)
  const dCta      = useDebounce(cta)
  const dBrand    = useDebounce(brand, 100)

  // AI suggestions
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [generating, setGenerating]   = useState(false)
  const [suggestOpen, setSuggestOpen] = useState(false)

  const handleGenerateHeadlines = useCallback(async () => {
    setGenerating(true)
    setSuggestOpen(true)
    try {
      const res = await fetch('/api/generate-headlines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template,
          profile: { name: DEMO_STARTUP.name, industry: DEMO_STARTUP.industry, id: 'demo' },
          context: `Brand: ${DEMO_STARTUP.name}. Industry: ${DEMO_STARTUP.industry}. Audience: ${DEMO_STARTUP.audience}. Template: ${template.title}.`,
        }),
      })
      const data = await res.json()
      setSuggestions(data.headlines ?? [])
    } catch {
      setSuggestions([
        `How ${DEMO_STARTUP.name} is changing ${DEMO_STARTUP.industry} in Lagos`,
        `5 things every ${DEMO_STARTUP.industry} founder needs to know`,
        `Why smart Lagos businesses are choosing ${DEMO_STARTUP.name}`,
      ])
    } finally {
      setGenerating(false)
    }
  }, [template])

  // PNG download via html2canvas
  const previewRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const handleDownload = useCallback(async () => {
    if (!previewRef.current) return
    setDownloading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      })
      const link = document.createElement('a')
      link.download = `${template.id}-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      setToast('Downloaded! Share it and come back to track performance.')
    } catch {
      setToast('Download failed — try again.')
    } finally {
      setDownloading(false)
    }
  }, [template.id])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface">

      {/* ── Top bar ── */}
      <header className="flex items-center gap-4 border-b border-border bg-white px-5 py-3 shrink-0 z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft size={15} />
          Back
        </button>
        <div className="h-4 w-px bg-border" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink truncate">{template.title}</p>
          <p className="text-[11px] text-muted">{template.category} · {template.designer_name}</p>
        </div>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 rounded-lg bg-emerald px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-dk disabled:opacity-60 transition-colors"
        >
          {downloading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
          {downloading ? 'Generating…' : 'Download PNG'}
        </button>
      </header>

      {/* ── Two-panel body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT: controls (380px) */}
        <div className="w-[380px] shrink-0 overflow-y-auto border-r border-border bg-white">
          <div className="p-5 space-y-7">

            {/* 1 — Brand Kit */}
            <section>
              <SectionHeader>Your Brand</SectionHeader>
              <div className="space-y-4">
                <LogoUpload logoDataUrl={brand.logoDataUrl} onChange={(v) => updateBrand({ logoDataUrl: v })} />
                <ColourInput label="Primary colour"   value={brand.primaryColor}   onChange={(v) => updateBrand({ primaryColor: v })} />
                <ColourInput label="Secondary colour" value={brand.secondaryColor} onChange={(v) => updateBrand({ secondaryColor: v })} />
                <div>
                  <span className="text-xs text-ink-soft block mb-1.5">Font preference</span>
                  <div className="relative">
                    <select
                      value={brand.fontFamily}
                      onChange={(e) => updateBrand({ fontFamily: e.target.value })}
                      className="w-full appearance-none rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-emerald/30 focus:border-emerald/50 pr-8"
                    >
                      {FONT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                        <path d="M1 1l4 4 4-4" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="h-px bg-border" />

            {/* 2 — Content Fields */}
            <section>
              <SectionHeader>Content</SectionHeader>
              <div className="space-y-4">
                {/* Linked idea banner */}
                {selectedIdea && ideaBanner && (
                  <div className="flex items-start gap-2.5 rounded-lg border border-emerald/30 bg-emerald/5 px-3 py-2.5">
                    <Sparkles size={13} className="text-emerald shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-emerald-dk leading-snug">Pre-filled from your idea</p>
                      <p className="text-[11px] text-ink-soft leading-snug mt-0.5 truncate">{selectedIdea.title}</p>
                    </div>
                    <button
                      onClick={() => { setIdeaBanner(false); setSelectedIdea(null) }}
                      className="shrink-0 text-muted hover:text-ink transition-colors mt-0.5"
                      aria-label="Dismiss"
                    >
                      <X size={13} />
                    </button>
                  </div>
                )}
                {/* Headline */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-ink-soft">Headline</label>
                    <span className={cn('text-[10px] font-mono', headline.length > 72 ? 'text-amber' : 'text-muted')}>{headline.length}/80</span>
                  </div>
                  <input
                    type="text"
                    maxLength={80}
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Enter your headline…"
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-emerald/30 focus:border-emerald/50"
                  />
                </div>
                {/* Body */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-ink-soft">Body text</label>
                    <span className={cn('text-[10px] font-mono', body.length > 270 ? 'text-amber' : 'text-muted')}>{body.length}/300</span>
                  </div>
                  <textarea
                    maxLength={300}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Supporting copy…"
                    rows={4}
                    className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-emerald/30 focus:border-emerald/50"
                  />
                </div>
                {/* CTA */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-ink-soft">CTA text</label>
                    <span className={cn('text-[10px] font-mono', cta.length > 34 ? 'text-amber' : 'text-muted')}>{cta.length}/40</span>
                  </div>
                  <input
                    type="text"
                    maxLength={40}
                    value={cta}
                    onChange={(e) => setCta(e.target.value)}
                    placeholder="e.g. Read more →"
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-emerald/30 focus:border-emerald/50"
                  />
                </div>
              </div>
            </section>

            <div className="h-px bg-border" />

            {/* 3 — AI Suggestions */}
            <section>
              <SectionHeader>AI Suggestions</SectionHeader>
              <button
                onClick={handleGenerateHeadlines}
                disabled={generating}
                className="flex items-center gap-2 rounded-lg border border-emerald/40 bg-emerald/5 px-3 py-2.5 text-xs font-medium text-emerald-dk hover:bg-emerald/10 disabled:opacity-60 transition-colors w-full justify-center"
              >
                {generating ? <Loader2 size={13} className="animate-spin" /> : <Wand2 size={13} />}
                {generating ? 'Generating…' : 'Generate headlines'}
              </button>
              <AnimatePresence>
                {suggestOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-3"
                  >
                    <div className="rounded-xl border border-border bg-surface p-3 space-y-2">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] uppercase tracking-widest text-muted font-semibold flex items-center gap-1.5">
                          <Sparkles size={10} /> Suggestions
                        </p>
                        <button onClick={() => setSuggestOpen(false)} className="text-muted hover:text-ink transition-colors">
                          <X size={12} />
                        </button>
                      </div>
                      {generating ? (
                        <div className="space-y-2">
                          {[1, 2, 3].map((i) => <div key={i} className="h-8 rounded-lg bg-border/60 animate-pulse" />)}
                        </div>
                      ) : suggestions.length > 0 ? (
                        suggestions.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => { setHeadline(s); setSuggestOpen(false) }}
                            className="w-full text-left rounded-lg bg-white border border-border px-3 py-2.5 text-xs text-ink hover:border-emerald/50 hover:bg-emerald/5 transition-colors leading-snug"
                          >
                            {s}
                          </button>
                        ))
                      ) : (
                        <p className="text-xs text-muted text-center py-1">No suggestions yet</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            <div className="h-px bg-border" />

            {/* 4 — Export */}
            <section>
              <SectionHeader>Export</SectionHeader>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald py-3.5 text-sm font-semibold text-white hover:bg-emerald-dk disabled:opacity-60 transition-colors shadow-sm"
              >
                {downloading
                  ? <><Loader2 size={15} className="animate-spin" /> Generating PNG…</>
                  : <><Download size={15} /> Download PNG</>
                }
              </button>
              <p className="text-[11px] text-muted text-center mt-2 leading-snug">
                Exports your live preview at 2× resolution
              </p>
            </section>

          </div>
        </div>

        {/* RIGHT: live preview */}
        <div className="flex-1 overflow-y-auto bg-[#f3f4f6]">
          <div className="flex flex-col items-center justify-start min-h-full p-10">
            {/* Live indicator */}
            <div className="flex items-center gap-2 mb-6 w-full max-w-2xl">
              <div className="h-2 w-2 rounded-full bg-emerald animate-pulse" />
              <p className="text-[11px] text-muted font-medium tracking-wide uppercase">Live preview</p>
              <span className="ml-auto text-[10px] text-muted/60 font-mono">{template.category}</span>
            </div>

            {/* Preview frame — captured by html2canvas */}
            <div ref={previewRef} className="w-full max-w-2xl">
              <TemplatePreview
                template={template}
                headline={dHeadline}
                body={dBody}
                cta={dCta}
                brand={dBrand}
              />
            </div>

            <p className="text-[11px] text-muted/50 text-center mt-6 max-w-xs leading-relaxed">
              Edit fields on the left to update the preview in real-time.
            </p>
          </div>
        </div>

      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  )
}
