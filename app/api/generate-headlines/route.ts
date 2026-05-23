import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { generateHeadlines } from '@/lib/claude'
import type { StartupProfile, Template } from '@/lib/types'

// ─── Mock fallback (no API key) ───────────────────────────────────────────────

const MOCK_HEADLINES = [
  'Your brand, your story — built for Lagos',
  'Why growing African brands choose this',
  "The growth edge your competitors don't have yet",
]

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { template, profile, context } = body as {
    template: Template
    profile: StartupProfile
    context: string
  }

  if (!template?.title) return NextResponse.json({ error: 'template.title is required' }, { status: 400 })
  if (!profile?.name) return NextResponse.json({ error: 'profile.name is required' }, { status: 400 })
  if (!context || typeof context !== 'string') {
    return NextResponse.json({ error: 'context is required' }, { status: 400 })
  }

  // Dev bypass: no Supabase credentials → skip auth, return mock headlines
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ headlines: MOCK_HEADLINES })
  }

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) =>
          toSet.forEach(({ name, value, options }) => cookieStore.set({ name, value, ...options })),
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const headlines = process.env.ANTHROPIC_API_KEY
      ? await generateHeadlines(template, profile, context)
      : MOCK_HEADLINES

    console.log(`[generate-headlines] user=${user.id} template=${template.id ?? template.title}`)
    return NextResponse.json({ headlines })
  } catch (error) {
    console.error('[generate-headlines]', error instanceof Error ? error.message : String(error))
    return NextResponse.json({ error: 'Failed to generate headlines' }, { status: 500 })
  }
}
