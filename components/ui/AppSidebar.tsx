'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Home,
  TrendingUp,
  Lightbulb,
  LayoutTemplate,
  BarChart3,
  Lock,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Shared nav definition ────────────────────────────────────────────────────

export const APP_NAV = [
  { label: 'Dashboard', icon: Home,           href: '/dashboard' },
  { label: 'Trends',    icon: TrendingUp,     href: '/trends' },
  { label: 'Content',   icon: Lightbulb,      href: '/content' },
  { label: 'Templates', icon: LayoutTemplate, href: '/templates' },
  { label: 'Analytics', icon: BarChart3,      href: '/analytics' },
]

// ─── Sidebar ──────────────────────────────────────────────────────────────────

interface AppSidebarProps {
  path: string
  /** Show a lock icon on the Analytics item (used on the analytics page itself) */
  locked?: boolean
}

export function AppSidebar({ path, locked = true }: AppSidebarProps) {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)

    // Clear demo state
    if (typeof window !== 'undefined') {
      localStorage.removeItem('strova-demo')
      document.cookie = 'strova-demo=; path=/; max-age=0; samesite=lax'
    }

    // Sign out from Supabase when credentials are present
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { createBrowserClient } = await import('@/lib/supabase')
      const supabase = createBrowserClient()
      await supabase.auth.signOut()
    }

    router.push('/auth')
  }

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col bg-white border-r border-border">
      {/* Nav items */}
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {APP_NAV.map(({ label, href, icon: Icon }) => {
          const active  = path === href
          const isAnalytics = href === '/analytics'
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                active
                  ? 'bg-emerald-lt text-emerald-dk'
                  : 'text-ink-soft hover:bg-surface hover:text-ink',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={17} strokeWidth={1.8} />
              <span className="flex-1">{label}</span>
              {isAnalytics && locked && <Lock size={13} className="text-muted" />}
            </Link>
          )
        })}
      </nav>

      {/* Log out */}
      <div className="shrink-0 border-t border-border p-3">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors duration-150 hover:bg-red/5 hover:text-red disabled:opacity-50"
        >
          <LogOut size={17} strokeWidth={1.8} className="shrink-0" />
          <span>{loggingOut ? 'Signing out…' : 'Log out'}</span>
        </button>
      </div>
    </aside>
  )
}
