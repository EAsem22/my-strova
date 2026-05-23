import Anthropic from '@anthropic-ai/sdk'
import type { StartupProfile, Template } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

const SYSTEM_PROMPT = `You are a senior marketing strategist specialising in African startup ecosystems, with deep knowledge of Lagos, Accra, Nairobi, and emerging tech markets across West and East Africa. You understand channel behaviour, content trends, and consumer psychology specific to these markets.

When given a startup profile, you generate a precise, actionable intelligence report. You never give generic Western-market advice. You reference real platform behaviours in African markets — e.g. LinkedIn engagement patterns among Lagos professionals, Instagram vs TikTok dynamics for Nigerian consumer brands, WhatsApp as a primary B2B channel in West Africa.

Always respond with valid JSON only. No markdown, no prose outside the JSON structure.`

// ─── Exported types ───────────────────────────────────────────────────────────

export interface IntelligenceReport {
  score: number
  scoreBreakdown: {
    channelFit: number
    contentGap: number
    audienceClarity: number
    competitivePosition: number
  }
  channelRecommendation: {
    primary: string
    reason: string
    weeklyChange: string
    secondaryChannels: string[]
  }
  trends: Array<{
    topic: string
    relevance: string
    format: string
    urgency: 'high' | 'medium' | 'low'
  }>
  competitorPulse: {
    summary: string
    gap: string
    recommendation: string
  }
  audienceInsight: {
    primarySegment: string
    whereTheyAre: string[]
    whatTheyRespond: string
    bestTimeToPost: string
  }
}

export interface RichContentIdea {
  id: string
  title: string
  format: 'linkedin-post' | 'carousel' | 'video-script' | 'email' | 'twitter-thread' | 'instagram-caption'
  audienceSegment: string
  trendTiedTo: string
  competitorGap: string
  tone: 'educational' | 'provocative' | 'storytelling' | 'data-driven' | 'conversational'
  suggestedCTA: string
  whyItWillWork: string
}

// ─── Internal helper ──────────────────────────────────────────────────────────

async function callClaude(userPrompt: string): Promise<string> {
  if (!client) throw new Error('ANTHROPIC_API_KEY is not configured')
  const message = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  })
  if (message.content[0].type !== 'text') throw new Error('Unexpected response type from Claude')
  return message.content[0].text
}

// ─── Exported functions ───────────────────────────────────────────────────────

export async function generateIntelligenceProfile(profile: StartupProfile): Promise<IntelligenceReport> {
  const text = await callClaude(`Generate a Startup Intelligence Profile for the following startup:

Name: ${profile.name}
Industry: ${profile.industry}
Target Audience: ${profile.audience ?? 'not specified'}
Competitors / Inspiration: ${(profile.competitors ?? []).join(', ') || 'none specified'}
Current Channels: ${(profile.channels ?? []).join(', ') || 'none specified'}
Monthly Budget: ${profile.budget ?? 'not specified'}
Primary Goal: ${profile.goal ?? 'not specified'}

Return a JSON object with this exact structure:
{
  "score": number (0-100, overall intelligence score),
  "scoreBreakdown": {
    "channelFit": number (0-100),
    "contentGap": number (0-100),
    "audienceClarity": number (0-100),
    "competitivePosition": number (0-100)
  },
  "channelRecommendation": {
    "primary": string (channel name),
    "reason": string (2-3 sentences, Africa-specific),
    "weeklyChange": string (e.g. "+12% reach this week"),
    "secondaryChannels": [string]
  },
  "trends": [
    {
      "topic": string,
      "relevance": string (1 sentence why this matters for them),
      "format": string (best content format for this trend),
      "urgency": "high" | "medium" | "low"
    }
  ],
  "competitorPulse": {
    "summary": string (what's working for competitors right now),
    "gap": string (the opportunity they're missing),
    "recommendation": string (how to exploit the gap)
  },
  "audienceInsight": {
    "primarySegment": string,
    "whereTheyAre": [string],
    "whatTheyRespond": string,
    "bestTimeToPost": string
  }
}`)

  return JSON.parse(text) as IntelligenceReport
}

export async function generateContentIdeas(
  profile: StartupProfile,
  trigger = 'general',
): Promise<RichContentIdea[]> {
  const text = await callClaude(`Generate 6 specific, platform-native content ideas for this startup:

Profile: ${JSON.stringify({
    name: profile.name,
    industry: profile.industry,
    audience: profile.audience,
    channels: profile.channels,
    goal: profile.goal,
  })}
Trigger: ${trigger}

Each idea must be tied to a real market signal, a specific audience segment, and a content gap vs competitors.

Return a JSON array of 6 objects:
[
  {
    "id": string,
    "title": string (the content hook/headline),
    "format": "linkedin-post" | "carousel" | "video-script" | "email" | "twitter-thread" | "instagram-caption",
    "audienceSegment": string,
    "trendTiedTo": string,
    "competitorGap": string,
    "tone": "educational" | "provocative" | "storytelling" | "data-driven" | "conversational",
    "suggestedCTA": string,
    "whyItWillWork": string (2 sentences, Africa-market specific reasoning)
  }
]`)

  return JSON.parse(text) as RichContentIdea[]
}

export async function generateHeadlines(
  template: Template,
  profile: StartupProfile,
  context: string,
): Promise<string[]> {
  const text = await callClaude(`Generate 3 compelling headline options for the following:

Template: ${template.title} (${template.category})
Startup: ${profile.name} — ${profile.industry}
Target Audience: ${profile.audience ?? 'general'}
Context: ${context}

The headlines must be platform-native for African markets, speak to the specific audience, and feel fresh — not generic.

Return a JSON array of exactly 3 headline strings. No other text.
["headline 1", "headline 2", "headline 3"]`)

  return JSON.parse(text) as string[]
}
