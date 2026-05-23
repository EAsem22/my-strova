import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { generateContentIdeas, type RichContentIdea } from '@/lib/claude'
import type { StartupProfile } from '@/lib/types'

// ─── Mock fallback (no API key) ───────────────────────────────────────────────

const MOCK_IDEAS: RichContentIdea[] = [
  {
    id: '1',
    title: 'The ₦500k mistake most Lagos founders make with paid ads',
    format: 'linkedin-post',
    audienceSegment: 'Early-stage founders, Lagos',
    trendTiedTo: 'Rising ad costs on Meta in Nigeria',
    competitorGap: 'No competitor is publishing founder-led cautionary content',
    tone: 'provocative',
    suggestedCTA: 'Comment "GUIDE" for our free paid ads audit template',
    whyItWillWork:
      'Founder pain points around wasted ad spend resonate deeply in Lagos startup circles. Provocative framing drives shares among peer founder communities on LinkedIn.',
  },
  {
    id: '2',
    title: 'How we grew our WhatsApp broadcast to 10k subscribers without ads',
    format: 'carousel',
    audienceSegment: 'SME owners, West Africa',
    trendTiedTo: 'WhatsApp Business adoption surge in West Africa',
    competitorGap: 'Competitors focus on Instagram; WhatsApp content is underserved',
    tone: 'storytelling',
    suggestedCTA: 'Save this post and follow for more growth breakdowns',
    whyItWillWork:
      'WhatsApp is the primary communication channel for SMEs in Nigeria and Ghana. A practical "how we did it" format builds credibility and is highly shareable in group chats.',
  },
  {
    id: '3',
    title: '5 Instagram hooks that doubled our reach in 30 days',
    format: 'instagram-caption',
    audienceSegment: 'Content creators and brand managers, Nigeria',
    trendTiedTo: 'Algorithm favouring early engagement signals on Reels',
    competitorGap: 'Competitors post reels without optimised caption hooks',
    tone: 'educational',
    suggestedCTA: 'Which hook will you try first? Drop it in the comments',
    whyItWillWork:
      'Practical, numbered frameworks perform well among Nigerian Instagram audiences who actively seek growth tactics. Educational content in this format drives saves, boosting algorithmic reach.',
  },
  {
    id: '4',
    title: 'What our biggest Nigerian client taught us about B2B trust',
    format: 'video-script',
    audienceSegment: 'B2B decision-makers, Lagos and Abuja',
    trendTiedTo: 'Trust-based selling trending in Nigerian B2B LinkedIn circles',
    competitorGap: 'No competitor is doing authentic B2B case study videos',
    tone: 'storytelling',
    suggestedCTA: "DM us to see if we're a fit for your team",
    whyItWillWork:
      'LinkedIn video content from Nigerian B2B brands is rare and high-signal. Client success stories with named outcomes drive inbound leads among professional Lagos networks.',
  },
  {
    id: '5',
    title: 'Your mid-week growth check: the 3 metrics that actually matter',
    format: 'email',
    audienceSegment: 'Subscribed founders and marketers',
    trendTiedTo: 'Email newsletters resurging as algorithm-free channel',
    competitorGap: "Competitors don't have a consistent email programme",
    tone: 'conversational',
    suggestedCTA: 'Reply and tell us your biggest metric challenge right now',
    whyItWillWork:
      'Email has the highest ROI of any channel for African startup audiences tired of inconsistent social algorithms. A consistent mid-week send builds habitual opens.',
  },
  {
    id: '6',
    title: 'Thread: everything I learned building a startup in Lagos (so far)',
    format: 'twitter-thread',
    audienceSegment: 'Nigerian tech Twitter community',
    trendTiedTo: 'Founder transparency gaining traction on Nigerian Twitter',
    competitorGap: "Competitors don't engage the Nigerian tech Twitter ecosystem",
    tone: 'conversational',
    suggestedCTA: 'Retweet if this resonates. Follow for weekly founder threads',
    whyItWillWork:
      'Nigerian tech Twitter has a tight-knit community that amplifies authentic founder voices. Thread format drives sustained engagement over 24–48 hours.',
  },
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

  const { profile, trigger } = body as { profile: StartupProfile; trigger?: string }

  if (!profile?.name || !profile?.industry) {
    return NextResponse.json({ error: 'profile.name and profile.industry are required' }, { status: 400 })
  }

  // Dev bypass: no Supabase credentials → skip auth, return mock data
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ ideas: MOCK_IDEAS })
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
    const ideas = process.env.ANTHROPIC_API_KEY
      ? await generateContentIdeas(profile, trigger)
      : MOCK_IDEAS

    console.log(
      `[generate-content-ideas] user=${user.id} profile=${profile.id ?? 'unknown'} trigger=${trigger ?? 'general'}`,
    )
    return NextResponse.json({ ideas })
  } catch (error) {
    console.error('[generate-content-ideas]', error instanceof Error ? error.message : String(error))
    return NextResponse.json({ error: 'Failed to generate content ideas' }, { status: 500 })
  }
}
