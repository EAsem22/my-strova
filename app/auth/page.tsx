'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Zap } from 'lucide-react'

type Mode = 'signin' | 'signup'

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkEmail, setCheckEmail] = useState(false)

  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Client created inside handler — never runs during SSR
    const supabase = createBrowserClient()

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        if (data.session) {
          router.push('/onboarding')
        } else {
          setCheckEmail(true)
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', data.user.id)
          .maybeSingle()

        router.push(profile ? '/dashboard' : '/onboarding')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setOauthLoading(true)
    const supabase = createBrowserClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  function switchMode(next: Mode) {
    setMode(next)
    setError('')
    setCheckEmail(false)
  }

  if (checkEmail) {
    return (
      <div className="min-h-screen bg-off-white flex flex-col">
        <Wordmark />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-sm bg-white border border-border rounded-xl shadow-sm p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-lt">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path
                  d="M3 10l5 5L17 5"
                  stroke="var(--emerald)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-ink mb-1">Check your email</h2>
            <p className="text-sm text-muted">
              We sent a confirmation link to{' '}
              <span className="font-medium text-ink-soft">{email}</span>.
              Click it to activate your account.
            </p>
            <button
              onClick={() => switchMode('signin')}
              className="mt-5 text-sm font-medium text-emerald transition-colors hover:text-emerald-dk"
            >
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    )
  }

  function handleTryDemo() {
    // Set cookie so middleware lets demo traffic through even with Supabase configured
    document.cookie = 'strova-demo=true; path=/; max-age=86400; samesite=lax'
    localStorage.setItem('strova-demo', 'true')
    router.push('/onboarding?demo=true')
  }

  return (
    <div className="min-h-screen bg-off-white flex flex-col">
      <Wordmark />

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white border border-border rounded-xl shadow-sm p-8">
            <h1 className="text-xl font-bold text-ink mb-1">
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-sm text-muted mb-6">
              {mode === 'signin'
                ? 'Sign in to your Strova IQ account'
                : 'Start building your marketing intelligence'}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                error={error || undefined}
              />

              <Button type="submit" loading={loading} className="w-full mt-1">
                {mode === 'signin' ? 'Sign in' : 'Create account'}
              </Button>
            </form>

            <Divider />

            <Button
              variant="secondary"
              className="w-full"
              onClick={handleGoogle}
              loading={oauthLoading}
              type="button"
            >
              <GoogleIcon />
              Continue with Google
            </Button>

            <p className="mt-5 text-center text-xs text-muted">
              {mode === 'signin' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className="font-medium text-emerald transition-colors hover:text-emerald-dk"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('signin')}
                    className="font-medium text-emerald transition-colors hover:text-emerald-dk"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Try Demo link */}
          <div className="mt-6 text-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[11px] text-muted">no account needed</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <button
              type="button"
              onClick={handleTryDemo}
              className="inline-flex items-center gap-2 rounded-xl bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#1f2937] active:scale-[0.97]"
            >
              <Zap size={15} className="text-emerald" />
              Try Demo →
            </button>
            <p className="mt-2.5 text-[11px] text-muted">
              See a live demo with Flowpay — a Lagos B2B fintech
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Wordmark() {
  return (
    <div className="p-6">
      <span
        className="text-xl font-bold text-ink"
        style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}
      >
        Strova IQ
      </span>
    </div>
  )
}

function Divider() {
  return (
    <div className="relative my-5">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-3 text-xs text-muted">or</span>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
      <path
        d="M15.68 8.18c0-.56-.05-1.09-.14-1.61H8v3.04h4.3a3.68 3.68 0 0 1-1.6 2.42v1.63h2.28c1.33-1.22 2.1-3.03 2.1-5.14z"
        fill="#4285F4"
      />
      <path
        d="M8 16c2.16 0 3.97-.71 5.3-1.93L11 12.44A5.04 5.04 0 0 1 8 13.35a5.05 5.05 0 0 1-4.74-3.49H.92v1.68A8 8 0 0 0 8 16z"
        fill="#34A853"
      />
      <path
        d="M3.26 9.86A5.08 5.08 0 0 1 3 8c0-.65.11-1.28.26-1.86V4.46H.92A8 8 0 0 0 0 8c0 1.29.31 2.51.92 3.54l2.34-1.68z"
        fill="#FBBC05"
      />
      <path
        d="M8 3.15c1.22 0 2.31.42 3.17 1.24L13.35 2.2A8 8 0 0 0 .92 4.46L3.26 6.14A5.05 5.05 0 0 1 8 3.15z"
        fill="#EA4335"
      />
    </svg>
  )
}
