import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { generateIntelligenceProfile, type IntelligenceReport } from '@/lib/claude'

// ─── Mock fallback (no API key) ───────────────────────────────────────────────

const MOCK_REPORT: IntelligenceReport = {
  score: 65,
  scoreBreakdown: { channelFit: 70, contentGap: 60, audienceClarity: 65, competitivePosition: 65 },
  channelRecommendation: {
    primary: 'Instagram',
    reason:
      'High engagement for consumer brands in your sector. Nigerian Instagram users aged 18–35 drive significant brand discovery. Reels currently outperform static posts 3:1 in reach.',
    weeklyChange: '+8% reach this week',
    secondaryChannels: ['WhatsApp', 'LinkedIn'],
  },
  trends: [
    {
      topic: 'Short-form video',
      relevance: 'Reels are outperforming static posts 3:1 in your industry segment.',
      format: 'Video (15–60s)',
      urgency: 'high',
    },
    {
      topic: 'Localised storytelling',
      relevance: 'Brands using local languages and cultural references see 40% higher engagement.',
      format: 'Carousel',
      urgency: 'medium',
    },
  ],
  competitorPulse: {
    summary: 'Competitors are relying heavily on static posts with promotional messaging.',
    gap: 'No one in your space is using behind-the-scenes or founder story content.',
    recommendation: 'Lead with founder story reels to build trust before the sale.',
  },
  audienceInsight: {
    primarySegment: 'Urban professionals, 24–35',
    whereTheyAre: ['Instagram', 'LinkedIn', 'WhatsApp'],
    whatTheyRespond: 'Authentic problem-solution stories, peer testimonials, and practical value tips.',
    bestTimeToPost: '7–9pm WAT, Tuesday to Thursday',
  },
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(
  body: unknown,
): { ok: true; data: Record<string, unknown> } | { ok: false; error: string } {
  if (typeof body !== 'object' || body === null) return { ok: false, error: 'Invalid request body' }
  const d = body as Record<string, unknown>
  if (!d.startupName || typeof d.startupName !== 'string') return { ok: false, error: 'startupName is required' }
  if (!d.industry || typeof d.industry !== 'string') return { ok: false, error: 'industry is required' }
  return { ok: true, data: d }
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const validation = validate(body)
  if (!validation.ok) return NextResponse.json({ error: validation.error }, { status: 400 })
  const { data } = validation

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

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, payload: unknown) =>
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`),
        )

      try {
        send('progress', { message: 'Saving your startup profile...' })

        await supabase.from('profiles').delete().eq('user_id', user.id)

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            name: data.startupName as string,
            industry: data.industry as string,
            audience: (data.audience as string | undefined) ?? null,
            competitors: ((data.competitors as string[] | undefined) ?? []).filter(Boolean),
            channels: (data.channels as string[] | undefined) ?? [],
            budget: (data.budget as string | undefined) ?? null,
            goal: (data.goal as string | undefined) ?? null,
          })
          .select()
          .single()

        if (profileError) throw profileError

        send('progress', { message: 'Generating your intelligence report...' })

        const report = process.env.ANTHROPIC_API_KEY
          ? await generateIntelligenceProfile(profile)
          : MOCK_REPORT

        send('progress', { message: 'Finalising your profile...' })

        await supabase.from('intelligence').insert({
          profile_id: profile.id,
          score: report.score,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          channel_rec: [report.channelRecommendation] as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          trends: report.trends as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          competitor_pulse: [report.competitorPulse] as any,
          content_ideas: null,
          raw_output: JSON.stringify(report),
        })

        console.log(`[generate-profile] user=${user.id} profile=${profile.id} score=${report.score}`)
        send('done', { profileId: profile.id })
      } catch (error) {
        console.error('[generate-profile]', error instanceof Error ? error.message : String(error))
        send('error', { message: 'Failed to generate profile. Please try again.' })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
