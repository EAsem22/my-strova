'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion, type Variants } from 'framer-motion'

import { useOnboardingStore } from '@/lib/stores/onboarding'
import { DEMO_DATA } from '@/lib/demo-data'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Button } from '@/components/ui/Button'

import { StartupBasics } from '@/components/onboarding/StartupBasics'
import { Audience } from '@/components/onboarding/Audience'
import { Competitors } from '@/components/onboarding/Competitors'
import { Channels } from '@/components/onboarding/Channels'
import { Budget } from '@/components/onboarding/Budget'
import { Goal } from '@/components/onboarding/Goal'

// ─── Slide transition ─────────────────────────────────────────────────────────

const slideVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 48 : -48,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.28,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -48 : 48,
    opacity: 0,
    transition: { duration: 0.2 },
  }),
}

// ─── Loading screen ───────────────────────────────────────────────────────────

function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 bg-white">
      <motion.span
        className="text-2xl font-bold text-ink"
        animate={{ opacity: [1, 0.35, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        Strova IQ
      </motion.span>

      <AnimatePresence mode="wait">
        {message && (
          <motion.p
            key={message}
            className="text-sm text-muted"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Wizard ───────────────────────────────────────────────────────────────────

const TOTAL = 6

function useStepValid(step: number) {
  const store = useOnboardingStore()
  switch (step) {
    case 1: return !!store.startupName.trim() && !!store.industry
    case 2: return !!store.audience.trim()
    case 3: return true
    case 4: return store.channels.length > 0
    case 5: return !!store.budget
    case 6: return !!store.goal
    default: return false
  }
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [dir, setDir] = useState(1)
  const [loading, setLoading] = useState(false)
  const [progressMessage, setProgressMessage] = useState('')
  const [submitError, setSubmitError] = useState('')
  const store = useOnboardingStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isDemo = searchParams.get('demo') === 'true'
  const isValid = useStepValid(step)

  // Pre-fill store with Flowpay data when in demo mode
  useEffect(() => {
    if (!isDemo) return
    const p = DEMO_DATA.profile
    store.update({
      startupName: p.startupName,
      tagline:     p.tagline,
      industry:    p.industry,
      audience:    p.audience,
      competitors: [p.competitors[0], p.competitors[1], p.competitors[2]] as [string, string, string],
      channels:    [...p.channels],
      budget:      p.budget,
      goal:        p.goal,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemo])

  function goNext() {
    setDir(1)
    setStep((s) => s + 1)
  }

  function goBack() {
    setDir(-1)
    setStep((s) => s - 1)
  }

  async function handleGenerate() {
    setLoading(true)
    setProgressMessage('')
    setSubmitError('')

    // Demo mode: skip API, show fake progress, go to dashboard
    if (isDemo) {
      const lines = [
        'Scanning Lagos fintech landscape...',
        'Mapping competitor signals...',
        'Identifying content opportunities...',
        'Your intelligence is ready.',
      ]
      for (const line of lines) {
        setProgressMessage(line)
        await new Promise((r) => setTimeout(r, 500))
      }
      store.reset()
      router.push('/dashboard?demo=true')
      return
    }

    try {
      const res = await fetch('/api/generate-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startupName: store.startupName,
          tagline: store.tagline,
          industry: store.industry,
          audience: store.audience,
          personaTags: store.personaTags,
          competitors: store.competitors,
          channels: store.channels,
          budget: store.budget,
          goal: store.goal,
        }),
      })

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({}))
        throw new Error(error ?? 'Failed to generate')
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response stream')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const chunks = buffer.split('\n\n')
        buffer = chunks.pop() ?? ''

        for (const chunk of chunks) {
          const eventMatch = chunk.match(/^event: (.+)$/m)
          const dataMatch = chunk.match(/^data: (.+)$/m)
          if (!eventMatch || !dataMatch) continue

          const eventType = eventMatch[1].trim()
          const payload = JSON.parse(dataMatch[1].trim()) as Record<string, string>

          if (eventType === 'progress') {
            setProgressMessage(payload.message)
          } else if (eventType === 'done') {
            store.reset()
            router.push('/dashboard')
            return
          } else if (eventType === 'error') {
            throw new Error(payload.message)
          }
        }
      }

      store.reset()
      router.push('/dashboard')
    } catch (err) {
      setLoading(false)
      setProgressMessage('')
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong — try regenerating.')
    }
  }

  const steps = [
    <StartupBasics key="1" />,
    <Audience key="2" />,
    <Competitors key="3" />,
    <Channels key="4" />,
    <Budget key="5" />,
    <Goal key="6" />,
  ]

  if (loading) return <LoadingScreen message={progressMessage || 'Scanning your market...'} />

  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      {/* ── Top chrome ─────────────────────────────────────────────────── */}
      <div className="px-6 pb-4 pt-6">
        <div className="mx-auto max-w-xl">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xl font-bold text-ink">Strova IQ</span>
            <SectionLabel>Step {step} of {TOTAL}</SectionLabel>
          </div>
          <ProgressBar value={step} max={TOTAL} />
        </div>
      </div>

      {/* ── Step content ────────────────────────────────────────────────── */}
      <div className="flex flex-1 items-start justify-center px-6 py-10">
        <div className="w-full max-w-xl overflow-hidden">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {steps[step - 1]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Footer nav ──────────────────────────────────────────────────── */}
      <div className="px-6 pb-10">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          {step > 1 && (
            <Button variant="ghost" onClick={goBack} className="shrink-0">
              ← Back
            </Button>
          )}

          <div className="ml-auto flex flex-col items-end gap-1.5">
            {submitError && (
              <div className="flex items-center gap-2 rounded-lg bg-red/5 border border-red/20 px-3 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red shrink-0" />
                <p className="text-xs text-red">{submitError}</p>
              </div>
            )}
            <Button
              disabled={!isValid}
              onClick={step === TOTAL ? handleGenerate : goNext}
              size={step === TOTAL ? 'lg' : 'md'}
            >
              {step === TOTAL ? 'Build Your Intelligence Profile →' : 'Continue →'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
