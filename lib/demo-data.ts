export interface DemoStartup {
  name: string
  industry: string
  city: string
  audience: string
  channels: string[]
  competitors: string[]
  goal: string
  updatedAt: string
}

export interface DemoIndustry {
  snapshot: string
  growthYoY: number
  activityLevel: 'High Activity' | 'Moderate Activity' | 'Low Activity'
  keyTheme: string
}

export interface DemoTopic {
  id: string
  label: string
  category: string
  trend: 'Rising' | 'Stable' | 'Declining'
  sparkline: number[]
  format: string
  volume: string
  // Trends page detail fields
  volumeContext: string
  whyTrending: string
  whosTalking: string[]
  topPerformingHook: string
  competitorActivity: string
  theGap: string
}

export interface DemoChannel {
  id: string
  platform: string
  icon: 'Linkedin' | 'Instagram' | 'Twitter' | 'MessageCircle'
  engagement: number
  audienceFit: 'Excellent' | 'Good' | 'Fair'
  recommended: boolean
  weeklyReach: string
  note: string
}

export interface DemoCompetitor {
  id: string
  name: string
  followers: string
  postFreq: string
  topFormat: string
  gapUrgency: 'High' | 'Medium' | 'Low'
  gapLabel: string
}

export interface DemoNews {
  id: string
  headline: string
  source: string
  publishedAt: string
  relevance: 'Regulatory' | 'Competitor' | 'Market Signal' | 'Channel Insight' | 'Funding'
  url: string
  summary: string
}

export interface DemoOpportunity {
  id: string
  title: string
  why: string
  urgency: 'Act now' | 'This week' | 'This month'
  formats: string[]
  trendTags: string[]
}

// ─── Data ───────────────────────────────────────────────────────────────────

export const DEMO_STARTUP: DemoStartup = {
  name: 'Huti',
  industry: 'Fintech',
  city: 'Lagos',
  audience: 'Young professionals aged 22–35 saving and investing for the first time',
  channels: ['LinkedIn', 'Instagram', 'WhatsApp'],
  competitors: ['PiggyVest', 'Cowrywise', 'Carbon', 'Kuda'],
  goal: 'Grow brand awareness and convert first-time savers into active investors',
  updatedAt: '2026-05-14',
}

export const DEMO_INDUSTRY: DemoIndustry = {
  snapshot:
    'Nigerian fintech is experiencing its fastest growth cycle in five years, driven by CBN regulatory reform, a surge in mobile-first banking adoption, and a new generation of financially curious young adults who distrust traditional banks. Competition for the savings-and-investment segment is intensifying as incumbents launch creator programmes and aggressive referral campaigns. Brands that publish authoritative, educational content are consistently outperforming those relying solely on performance ads.',
  growthYoY: 18,
  activityLevel: 'High Activity',
  keyTheme: 'Education-led growth is winning across every channel',
}

export const DEMO_TOPICS: DemoTopic[] = [
  {
    id: 'bnpl',
    label: 'BNPL for SMEs',
    category: 'Product Trend',
    trend: 'Rising',
    sparkline: [12, 18, 15, 24, 31, 28, 42],
    format: 'LinkedIn Post',
    volume: 'High',
    volumeContext: 'Mentioned 340 times this week in Lagos fintech conversations',
    whyTrending: 'Cash flow pressure on Lagos SMEs has intensified post-inflation surge. Business owners are actively searching for buy-now-pay-later solutions that fit their irregular revenue cycles. Fintech brands covering this topic are seeing 3× the usual engagement on LinkedIn.',
    whosTalking: ['SME Owners', 'Finance Managers', 'Founders'],
    topPerformingHook: 'Your Lagos business can now buy equipment today and pay in 6 instalments — here\'s what the banks won\'t tell you',
    competitorActivity: 'Paystack published one developer-focused blog post. No brand has covered the SME or non-technical business owner angle.',
    theGap: 'Nobody has explained BNPL from the SME owner\'s perspective in plain, practical language.',
  },
  {
    id: 'cbn-reform',
    label: 'CBN Policy Reform',
    category: 'Regulatory',
    trend: 'Rising',
    sparkline: [8, 10, 9, 14, 20, 33, 38],
    format: 'Twitter Thread',
    volume: 'Very High',
    volumeContext: 'Mentioned 890 times this week across Lagos fintech Twitter and LinkedIn',
    whyTrending: 'The CBN open banking deadline has created urgency among fintech operators. Decision-makers are actively researching implications, driving a spike in content consumption. Most existing coverage is technical — there is a clear gap for plain-language explainers.',
    whosTalking: ['Compliance Officers', 'Founders', 'Finance Managers'],
    topPerformingHook: 'What the CBN open banking update actually means for your Lagos business (not the tech jargon version)',
    competitorActivity: 'Cowrywise published a compliance FAQ aimed at developers. PiggyVest has been silent. No one has produced video or carousel content on this topic.',
    theGap: 'No brand has translated the CBN reform into plain language for non-technical founders and SME owners.',
  },
  {
    id: 'gen-z-saving',
    label: 'Gen Z Saving Habits',
    category: 'Audience Insight',
    trend: 'Rising',
    sparkline: [20, 22, 25, 23, 29, 34, 37],
    format: 'Carousel',
    volume: 'High',
    volumeContext: 'Mentioned 420 times this week in fintech and personal finance communities',
    whyTrending: 'Gen Z professionals aged 22–27 entering the Lagos workforce are actively seeking savings advice on Instagram and TikTok. This cohort distrusts traditional banks and is highly responsive to peer-led, relatable financial content from founder voices.',
    whosTalking: ['Gen Z Professionals', 'University Students', 'Young Founders'],
    topPerformingHook: 'I started saving ₦5,000 a month at 22. Here\'s what happened to it in 3 years',
    competitorActivity: 'Kuda runs meme-led Gen Z content but avoids savings education. Cowrywise targets millennials. No competitor owns the Gen Z savings education space.',
    theGap: 'No fintech brand is producing relatable, aspirational savings content specifically for Lagos Gen Z — the fastest-growing depositor cohort.',
  },
  {
    id: 'crypto-alt',
    label: 'Crypto Alternatives',
    category: 'Competitor Move',
    trend: 'Stable',
    sparkline: [35, 32, 34, 31, 33, 30, 32],
    format: 'Video Script',
    volume: 'Medium',
    volumeContext: 'Mentioned 210 times this week — steady but not accelerating',
    whyTrending: 'Following CBN crypto restrictions, Lagos investors are actively seeking regulated alternatives — dollar savings, mutual funds, and commodity-backed products. The conversation has stabilised at a high baseline rather than spiking, indicating sustained interest.',
    whosTalking: ['Crypto-curious Investors', 'Young Professionals', 'Developers'],
    topPerformingHook: 'You don\'t need crypto to beat naira inflation — here are 4 CBN-approved alternatives doing better right now',
    competitorActivity: 'Carbon published a comparison blog post in March. No brand has produced video content on regulated crypto alternatives targeting a Lagos audience.',
    theGap: 'No brand has produced a short-form video series making regulated investment alternatives feel as exciting as crypto for the Lagos market.',
  },
  {
    id: 'dollar-savings',
    label: 'Dollar Savings Accounts',
    category: 'Product Trend',
    trend: 'Rising',
    sparkline: [5, 8, 11, 14, 19, 25, 31],
    format: 'Instagram Caption',
    volume: 'Medium',
    volumeContext: 'Mentioned 290 times this week — fastest week-on-week growth of any topic',
    whyTrending: 'Naira volatility has driven a surge in demand for dollar-denominated savings products. Lagos professionals aged 25–35 are actively asking how to protect earnings from devaluation. The topic is underserved relative to its search and social volume.',
    whosTalking: ['Diaspora-connected Professionals', 'Remote Workers', 'Entrepreneurs'],
    topPerformingHook: 'How I moved 30% of my salary into dollars last month without leaving Lagos (and why my bank never told me I could)',
    competitorActivity: 'PiggyVest and Cowrywise offer dollar products but have published minimal educational content on them this quarter. No competitor has run an Instagram Reels series on this topic.',
    theGap: 'Dollar savings content on Instagram is almost entirely absent from Nigerian fintech brands — despite surging search demand from Lagos users.',
  },
  {
    id: 'referral-fatigue',
    label: 'Referral Programme Fatigue',
    category: 'Market Signal',
    trend: 'Declining',
    sparkline: [40, 38, 33, 28, 22, 18, 14],
    format: 'Email',
    volume: 'Low',
    volumeContext: 'Mentioned 95 times this week — declining from a peak of 380 in February',
    whyTrending: 'Users are becoming desensitised to "invite a friend, earn ₦500" mechanics as every fintech in Lagos runs near-identical programmes. The conversation is shifting from excitement to criticism, representing a signal to differentiate your acquisition strategy now.',
    whosTalking: ['Marketers', 'Founders', 'Growth Analysts'],
    topPerformingHook: 'Why we killed our referral programme and what we\'re doing instead (our honest take after 18 months)',
    competitorActivity: 'PiggyVest still heavily promotes their referral scheme. No competitor has publicly addressed or pivoted away from the model — the authentic counter-narrative is wide open.',
    theGap: 'No fintech brand has positioned themselves as the alternative to referral-spam culture. A transparent "why we\'re different" campaign would stand out sharply right now.',
  },
]

export const DEMO_CHANNELS: DemoChannel[] = [
  {
    id: 'whatsapp',
    platform: 'WhatsApp',
    icon: 'MessageCircle',
    engagement: 8.9,
    audienceFit: 'Excellent',
    recommended: true,
    weeklyReach: '~14,000',
    note: 'Highest ROI channel for Nigerian fintech. Broadcast lists convert 3× better than social feeds.',
  },
  {
    id: 'linkedin',
    platform: 'LinkedIn',
    icon: 'Linkedin',
    engagement: 4.8,
    audienceFit: 'Excellent',
    recommended: false,
    weeklyReach: '~9,200',
    note: 'Founder-led content is outperforming brand pages 5:1. Carousel posts drive the most saves.',
  },
  {
    id: 'instagram',
    platform: 'Instagram',
    icon: 'Instagram',
    engagement: 3.2,
    audienceFit: 'Good',
    recommended: false,
    weeklyReach: '~6,800',
    note: 'Reels with trending audio and financial education hooks are getting 2× organic reach.',
  },
  {
    id: 'twitter',
    platform: 'Twitter / X',
    icon: 'Twitter',
    engagement: 2.1,
    audienceFit: 'Fair',
    recommended: false,
    weeklyReach: '~4,100',
    note: 'Niche but vocal fintech community. Threads from founders get disproportionate amplification.',
  },
]

export const DEMO_COMPETITORS: DemoCompetitor[] = [
  {
    id: 'piggyvest',
    name: 'PiggyVest',
    followers: '486K',
    postFreq: 'Daily',
    topFormat: 'Testimonial Carousels',
    gapUrgency: 'High',
    gapLabel: 'No long-form founder content',
  },
  {
    id: 'cowrywise',
    name: 'Cowrywise',
    followers: '212K',
    postFreq: '3–4× / week',
    topFormat: 'Educational Threads',
    gapUrgency: 'High',
    gapLabel: 'Weak WhatsApp presence',
  },
  {
    id: 'carbon',
    name: 'Carbon',
    followers: '178K',
    postFreq: '2× / week',
    topFormat: 'Product Announcements',
    gapUrgency: 'Medium',
    gapLabel: 'No Gen Z-targeted content',
  },
  {
    id: 'kuda',
    name: 'Kuda',
    followers: '391K',
    postFreq: '5× / week',
    topFormat: 'Meme & Culture',
    gapUrgency: 'Medium',
    gapLabel: 'Avoids regulatory topics',
  },
]

export const DEMO_COMPETITOR_GAP =
  "None of your four competitors publish consistent founder-led educational content. The biggest open channel is WhatsApp broadcast — Cowrywise has fewer than 2,000 broadcast subscribers despite 212K Instagram followers. A structured weekly WhatsApp drop from Huti could dominate this channel within 60 days."

export const DEMO_NEWS: DemoNews[] = [
  {
    id: 'n1',
    headline: 'CBN mandates new KYC tiers for digital lenders by Q3 2026',
    source: 'TechCabal',
    publishedAt: '2026-05-15',
    relevance: 'Regulatory',
    url: 'https://techcabal.com',
    summary:
      'New central bank directive requires all digital lenders to implement three-tier KYC by September 2026, creating an educational content opportunity for brands that simplify compliance for users.',
  },
  {
    id: 'n2',
    headline: 'PiggyVest launches creator ambassador programme with ₦5M in grants',
    source: 'Nairametrics',
    publishedAt: '2026-05-13',
    relevance: 'Competitor',
    url: 'https://nairametrics.com',
    summary:
      'PiggyVest is paying 50 micro-creators to produce savings content across Instagram and TikTok. Expect a surge in competitor content volume over the next 8 weeks.',
  },
  {
    id: 'n3',
    headline: 'Nigerian fintech sector raises $340M in Q1 2026 — highest since 2021',
    source: 'Disrupt Africa',
    publishedAt: '2026-05-10',
    relevance: 'Market Signal',
    url: 'https://disrupt-africa.com',
    summary:
      'Investor confidence is recovering sharply. Content that positions your brand as a stable, well-governed fintech will resonate with both users and potential partners watching from abroad.',
  },
  {
    id: 'n4',
    headline: 'WhatsApp Business API adoption among Nigerian fintechs up 340% YoY',
    source: 'Techpoint Africa',
    publishedAt: '2026-05-08',
    relevance: 'Channel Insight',
    url: 'https://techpoint.africa',
    summary:
      'Data from Meta shows Nigerian financial services are the fastest-growing segment on WhatsApp Business API. Brands investing now are locking in an audience before the channel saturates.',
  },
  {
    id: 'n5',
    headline: 'Kuda raises $20M Series B extension, eyes East Africa expansion',
    source: 'TechCabal',
    publishedAt: '2026-05-05',
    relevance: 'Competitor',
    url: 'https://techcabal.com',
    summary:
      'Kuda is about to get louder. Expect increased ad spend and influencer activity from them in Lagos over the next quarter. Now is the time to own your niche before budgets escalate.',
  },
]

// ─── Analytics types ─────────────────────────────────────────────────────────

export interface DemoContentPerformance {
  id: string
  title: string
  format: 'linkedin-post' | 'carousel' | 'twitter-thread' | 'instagram-caption' | 'email'
  channel: 'LinkedIn' | 'Instagram' | 'Twitter' | 'WhatsApp'
  publishedAt: string
  impressions: number
  engagementRate: number
  saves: number
  status: 'top-performer' | 'average' | 'underperforming'
  whatWorked: string
  whatToImprove: string
}

export interface DemoChannelBreakdown {
  id: string
  platform: 'LinkedIn' | 'Instagram' | 'Twitter' | 'WhatsApp'
  icon: 'Linkedin' | 'Instagram' | 'Twitter' | 'MessageCircle'
  engagementRate: number
  impressions: string
  followersGained: number
  postsPublished: number
  barChart: number[]
  bestFormat: string
  recommendation: string
}

export interface DemoRecommendation {
  id: string
  title: string
  reasoning: string
  priority: 'high' | 'this-week' | 'experiment'
  trendTag: string
  channelTag: string
}

export interface DemoAnalytics {
  overview: {
    impressions: { value: number; change: string; sparkline: number[] }
    engagementRate: { value: number; change: string; sparkline: number[] }
    contentPublished: { value: number; channels: number; formats: Array<{ label: string; color: string }> }
    topChannel: { name: string; engagement: number }
  }
  contentPerformance: DemoContentPerformance[]
  channelBreakdown: DemoChannelBreakdown[]
  aiAnalysis: { whatWorked: string[]; whatToImprove: string[] }
  nextRecommendations: DemoRecommendation[]
}

export const DEMO_ANALYTICS: DemoAnalytics = {
  overview: {
    impressions: {
      value: 48200,
      change: '+22%',
      sparkline: [18000, 22000, 19500, 25000, 28000, 31000, 38000, 42000, 45000, 48200],
    },
    engagementRate: {
      value: 4.6,
      change: '+0.8%',
      sparkline: [3.1, 3.4, 3.2, 3.8, 4.0, 3.9, 4.2, 4.4, 4.5, 4.6],
    },
    contentPublished: {
      value: 14,
      channels: 3,
      formats: [
        { label: '8 LinkedIn', color: 'bg-blue-100 text-blue-700' },
        { label: '4 Carousel', color: 'bg-violet-100 text-violet-700' },
        { label: '2 Thread',   color: 'bg-sky-100 text-sky-700' },
      ],
    },
    topChannel: { name: 'LinkedIn', engagement: 6.2 },
  },
  contentPerformance: [
    { id: 'cp1', title: 'CBN open banking: what every Lagos fintech founder needs to know', format: 'linkedin-post', channel: 'LinkedIn', publishedAt: '2026-05-08', impressions: 12400, engagementRate: 8.2, saves: 347, status: 'top-performer', whatWorked: 'Regulatory topic with a plain-language hook drove 3× organic amplification in Lagos fintech circles.', whatToImprove: 'Adding a data table or infographic would increase saves by an estimated 40%.' },
    { id: 'cp2', title: '5 saving habits Gen Z Lagos professionals are getting right', format: 'carousel', channel: 'LinkedIn', publishedAt: '2026-05-10', impressions: 9800, engagementRate: 7.1, saves: 289, status: 'top-performer', whatWorked: 'Carousel format with numbered steps performed 2.4× better than single-image posts this period.', whatToImprove: 'Post at 8–9am Lagos time for 20% additional reach on this audience segment.' },
    { id: 'cp3', title: 'Why most Nigerians never see returns on savings — and what to do', format: 'linkedin-post', channel: 'LinkedIn', publishedAt: '2026-05-05', impressions: 7200, engagementRate: 5.8, saves: 198, status: 'top-performer', whatWorked: 'Contrarian framing drove comments from finance managers, boosting algorithmic reach.', whatToImprove: 'A follow-up case study post would convert engaged readers into followers.' },
    { id: 'cp4', title: 'Dollar savings in 2026: the complete guide for Lagos professionals', format: 'carousel', channel: 'LinkedIn', publishedAt: '2026-05-12', impressions: 5100, engagementRate: 4.9, saves: 156, status: 'average', whatWorked: 'Practical guide format with a clear CTA generated strong saves relative to impressions.', whatToImprove: 'The hook on slide 1 needs more urgency — lead with a dollar/naira rate stat.' },
    { id: 'cp5', title: 'Thread: what I learned investing my first ₦500k', format: 'twitter-thread', channel: 'Twitter', publishedAt: '2026-05-07', impressions: 4700, engagementRate: 4.2, saves: 92, status: 'average', whatWorked: 'Personal finance confessional format resonated with early-career Lagos tech professionals.', whatToImprove: 'End the thread with a question to drive replies and extend reach.' },
    { id: 'cp6', title: '3 money moves every Lagos professional should make before 30', format: 'instagram-caption', channel: 'Instagram', publishedAt: '2026-05-11', impressions: 3900, engagementRate: 3.7, saves: 84, status: 'average', whatWorked: 'Age-specific framing ("before 30") drove strong engagement from the 25–32 cohort.', whatToImprove: 'Include a text overlay on the image — caption-only posts get 35% less reach.' },
    { id: 'cp7', title: 'BNPL for your business: how to use it without hurting cash flow', format: 'linkedin-post', channel: 'LinkedIn', publishedAt: '2026-05-14', impressions: 3400, engagementRate: 3.1, saves: 67, status: 'average', whatWorked: 'SME-focused framing differentiated this from consumer BNPL content flooding the feed.', whatToImprove: 'Add a specific ₦ amount in the hook to make the value concrete.' },
    { id: 'cp8', title: 'Crypto vs regulated savings: which one actually wins in Nigeria?', format: 'twitter-thread', channel: 'Twitter', publishedAt: '2026-05-03', impressions: 2800, engagementRate: 2.4, saves: 38, status: 'underperforming', whatWorked: 'The debate format attracted crypto-community engagement, widening reach slightly.', whatToImprove: 'Take a clearer stance — neutral framing underperforms on Twitter.' },
    { id: 'cp9', title: 'Mid-week money check: are you on track for your savings goal?', format: 'email', channel: 'WhatsApp', publishedAt: '2026-05-06', impressions: 2400, engagementRate: 6.8, saves: 0, status: 'top-performer', whatWorked: 'WhatsApp broadcast had 6.8% click-through — 3× higher than industry average.', whatToImprove: 'Personalise the opening line with the reader name to increase open rates by ~15%.' },
    { id: 'cp10', title: 'The referral programme myth: what actually drives growth in 2026', format: 'linkedin-post', channel: 'LinkedIn', publishedAt: '2026-05-09', impressions: 2100, engagementRate: 2.2, saves: 29, status: 'underperforming', whatWorked: 'Counter-narrative positioning attracted founder-segment engagement.', whatToImprove: 'Lead with a specific data point — the current hook is too abstract.' },
    { id: 'cp11', title: 'How to set up a dollar savings account from Lagos (step by step)', format: 'carousel', channel: 'Instagram', publishedAt: '2026-05-04', impressions: 1900, engagementRate: 3.2, saves: 71, status: 'average', whatWorked: 'Step-by-step format drove saves — people bookmarked this to reference later.', whatToImprove: 'Boost this carousel with ₦5k — the high save rate signals strong ad potential.' },
    { id: 'cp12', title: 'Gen Z and money: the generation rewriting the rules of saving', format: 'carousel', channel: 'LinkedIn', publishedAt: '2026-05-02', impressions: 1700, engagementRate: 2.8, saves: 44, status: 'average', whatWorked: 'Audience-identity framing ("Gen Z and money") drove reshares within the demographic.', whatToImprove: 'Use specific statistics — "18% of Lagos Gen Z have no savings" outperforms vague claims.' },
    { id: 'cp13', title: 'Q&A: Your biggest questions about investing as a Lagos millennial', format: 'instagram-caption', channel: 'Instagram', publishedAt: '2026-05-01', impressions: 1500, engagementRate: 2.1, saves: 22, status: 'underperforming', whatWorked: 'Q&A format encouraged comments — 2× the comment rate of other posts.', whatToImprove: 'Instagram captions over 150 words get hidden — reformat as a carousel.' },
    { id: 'cp14', title: 'Weekly WhatsApp: The 3 financial moves to make this week', format: 'email', channel: 'WhatsApp', publishedAt: '2026-04-29', impressions: 1100, engagementRate: 5.9, saves: 0, status: 'average', whatWorked: 'Actionable weekly format builds habitual opens. Click-through was 40% above broadcast average.', whatToImprove: 'Split-test the send time — 7am vs 8am Lagos time could yield 10–15% more opens.' },
  ],
  channelBreakdown: [
    { id: 'linkedin',  platform: 'LinkedIn',   icon: 'Linkedin',      engagementRate: 6.2, impressions: '31,400', followersGained: 284, postsPublished: 8, barChart: [40, 55, 48, 72, 88, 94, 100], bestFormat: 'LinkedIn Carousel',     recommendation: 'Post carousels on Tuesday and Thursday at 8–9am. Your audience is most active during Lagos commute hours.' },
    { id: 'instagram', platform: 'Instagram',  icon: 'Instagram',     engagementRate: 3.7, impressions: '7,300',  followersGained: 91,  postsPublished: 4, barChart: [50, 60, 45, 70, 65, 80, 72], bestFormat: 'Step-by-step Carousel', recommendation: 'Your save rate (4.2% vs 1.8% benchmark) signals strong content-market fit. Increase to 3×/week.' },
    { id: 'whatsapp',  platform: 'WhatsApp',   icon: 'MessageCircle', engagementRate: 6.4, impressions: '3,500',  followersGained: 0,   postsPublished: 2, barChart: [60, 70, 65, 80, 90, 85, 95], bestFormat: 'Weekly Broadcast',      recommendation: 'WhatsApp has your highest click-through rate. Double broadcast frequency — your open rate can sustain it.' },
    { id: 'twitter',   platform: 'Twitter',    icon: 'Twitter',       engagementRate: 3.3, impressions: '6,000',  followersGained: 47,  postsPublished: 2, barChart: [30, 45, 55, 40, 60, 50, 65], bestFormat: 'Founder Thread',        recommendation: 'Post threads on Sunday evenings — Nigerian tech Twitter is most active between 7–10pm.' },
  ],
  aiAnalysis: {
    whatWorked: [
      'Regulatory and educational content (CBN reform, savings guides) consistently outperformed promotional posts by 3.1× on impressions.',
      'Posts published Tuesday–Thursday between 8–10am generated 42% more impressions than off-peak posts.',
      'Carousel format drove 2.4× more saves than single-image posts — saves signal content that converts to followers over time.',
    ],
    whatToImprove: [
      '3 of your 14 posts underperformed — all three used abstract hooks. Add a specific ₦ amount or data point in the first line.',
      'Instagram is your lowest-performing channel despite good save rates — increase posting frequency from 1×/week to 3×.',
      'Twitter threads ended without a clear CTA — always close with a question or link to drive replies and shares.',
    ],
  },
  nextRecommendations: [
    { id: 'nr1', title: 'Publish a CBN open banking explainer carousel on LinkedIn', reasoning: 'This topic has the highest volume of any Lagos fintech trend. Your plain-language regulatory content consistently outperforms competitors. First mover gets significant organic amplification.', priority: 'high', trendTag: 'CBN Reform', channelTag: 'LinkedIn' },
    { id: 'nr2', title: 'Start a weekly WhatsApp broadcast series on dollar savings', reasoning: 'Dollar savings is the fastest-rising topic in your segment and WhatsApp has your best click-through rate. A structured weekly series builds habitual opens within 3 weeks.', priority: 'this-week', trendTag: 'Dollar Savings', channelTag: 'WhatsApp' },
    { id: 'nr3', title: 'Test a founder transparency thread: "What I got wrong about building a fintech"', reasoning: 'Your highest-performing content uses personal voice and specific numbers. Nigerian tech Twitter disproportionately amplifies authentic founder stories — low effort, high potential return.', priority: 'experiment', trendTag: 'Founder-led Content', channelTag: 'Twitter' },
  ],
}

export const DEMO_OPPORTUNITIES: DemoOpportunity[] = [
  {
    id: 'op1',
    title: 'CBN Regulatory Explainer Series',
    why: 'The new KYC mandate is confusing users across every platform. No competitor has published a plain-English explainer yet. First mover gets massive organic reach and trust signals.',
    urgency: 'Act now',
    formats: ['Twitter Thread', 'LinkedIn Post', 'Email'],
    trendTags: ['CBN Policy Reform', 'Regulatory'],
  },
  {
    id: 'op2',
    title: 'Founder Transparency Thread',
    why: "Nigerian fintech Twitter amplifies authentic founder voices disproportionately. Cowrywise's CEO thread in March got 4.2M impressions. Your audience is primed for this format.",
    urgency: 'This week',
    formats: ['Twitter Thread', 'LinkedIn Post'],
    trendTags: ['Gen Z Saving Habits', 'Founder-led content'],
  },
  {
    id: 'op3',
    title: 'Gen Z Dollar Savings Short-Form Video',
    why: 'Dollar savings accounts are the fastest-rising topic in your segment and Gen Z is the least served audience. A 30-second Reels series could own this niche before competitors react.',
    urgency: 'This month',
    formats: ['Video Script', 'Instagram Caption'],
    trendTags: ['Dollar Savings Accounts', 'Gen Z Saving Habits'],
  },
]

// ─── DEMO_DATA — Flowpay pitch (CMU Africa / investor demos) ─────────────────
// A single structured object used by demo mode. All other exports above are
// the default Huti (B2C savings) dataset used by the app outside demo mode.

export const DEMO_DATA = {

  profile: {
    startupName: "Flowpay",
    tagline: "B2B payments infrastructure for Nigerian SMEs",
    industry: "Fintech",
    city: "Lagos",
    audience: "Small business owners and finance managers at Lagos-based SMEs processing ₦1M–₦50M monthly",
    competitors: ["Flutterwave", "Moniepoint", "Paystack"],
    channels: ["LinkedIn", "Twitter/X", "WhatsApp"],
    budget: "₦200,000 – ₦500,000",
    goal: "Lead Generation",
  },

  industryOverview: {
    tag: "Fintech · Lagos",
    snapshot: "Lagos fintech is consolidating rapidly after a 2024–2025 funding slowdown, with B2B payments and embedded finance emerging as the clearest growth vectors. SME-focused infrastructure plays are gaining traction as large players compete for enterprise contracts, leaving the ₦5M–₦50M monthly transaction segment underserved. Regulatory clarity from the CBN on open banking is creating new product surface areas for well-positioned startups.",
    marketGrowth: { direction: "up", value: "18%", label: "YoY sector growth" },
    activityLevel: "High",
    updatedAt: "May 14, 2026",
  },

  trendingTopics: [
    { topic: "AI credit scoring for Lagos SMEs", trend: "Rising", sparkline: [12,18,15,24,31,28,42], bestFormat: "LinkedIn Carousel", relevance: "High" },
    { topic: "CBN open banking rollout — what it means for fintechs", trend: "Rising", sparkline: [8,9,14,22,38,44,51], bestFormat: "Twitter Thread", relevance: "High" },
    { topic: "Dollar vs naira payment rails for African exporters", trend: "Stable", sparkline: [30,28,32,29,31,30,33], bestFormat: "LinkedIn Post", relevance: "Medium" },
    { topic: "Embedded finance for Nigerian e-commerce platforms", trend: "Rising", sparkline: [5,8,12,11,18,22,29], bestFormat: "Video Script", relevance: "Medium" },
    { topic: "Moniepoint vs Paystack — SME owner comparisons", trend: "Stable", sparkline: [40,38,42,39,41,40,38], bestFormat: "LinkedIn Post", relevance: "High" },
    { topic: "POS agent network decline — digital shift accelerating", trend: "Rising", sparkline: [10,12,16,21,25,30,36], bestFormat: "Twitter Thread", relevance: "Medium" },
  ],

  channelIntelligence: [
    { platform: "LinkedIn", recommended: true, engagementBenchmark: "4.8% avg engagement", topFormat: "Carousels (8–12 slides)", postingFrequency: "4x per week", audienceFit: "High", note: "Lagos fintech founders and finance decision-makers are most active here." },
    { platform: "Twitter/X", recommended: false, engagementBenchmark: "2.1% avg engagement", topFormat: "Threads (5–8 tweets)", postingFrequency: "Daily", audienceFit: "Medium", note: "Good for thought leadership and brand building. Less direct lead gen than LinkedIn." },
    { platform: "Instagram", recommended: false, engagementBenchmark: "3.4% avg engagement", topFormat: "Reels (30–60s)", postingFrequency: "3x per week", audienceFit: "Low", note: "Audience skews B2C. Lower relevance for SME-facing B2B infrastructure." },
    { platform: "WhatsApp", recommended: false, engagementBenchmark: "N/A — direct channel", topFormat: "Broadcast messages + voice notes", postingFrequency: "2–3x per week", audienceFit: "High", note: "Effective for retention and nurturing. Best used after LinkedIn generates the lead." },
  ],

  competitorLandscape: {
    competitors: [
      { name: "Flutterwave", primaryChannel: "LinkedIn + Twitter/X", postingFrequency: "Daily", dominantTheme: "Global expansion, partnerships, developer ecosystem", messagingGap: "Never speaks to the day-to-day pain of the Lagos SME finance manager.", gapUrgency: "High" },
      { name: "Moniepoint", primaryChannel: "LinkedIn + Instagram", postingFrequency: "4–5x per week", dominantTheme: "Agent network stories, financial inclusion, SME success stories", messagingGap: "Focused on micro-merchants. Underserves the ₦5M–₦50M SME segment needing real B2B infrastructure.", gapUrgency: "High" },
      { name: "Paystack", primaryChannel: "Twitter/X + LinkedIn", postingFrequency: "3x per week", dominantTheme: "Developer-first content, product updates, e-commerce integrations", messagingGap: "Speaks to developers and e-commerce founders only. No content for the CFO or finance manager at growing SMEs.", gapUrgency: "Medium" },
    ],
    gapSummary: "All three major competitors are either talking to developers, micro-merchants, or enterprise CFOs. The Lagos SME finance manager — processing ₦5M–₦50M monthly, frustrated with reconciliation and FX exposure — has no brand speaking directly to them. That is Flowpay's content white space.",
  },

  newsAndInsights: [
    { headline: "CBN issues updated open banking framework — implementation deadline set for Q3 2026", source: "TechCabal", date: "May 12, 2026", summary: "The Central Bank of Nigeria has released final guidelines for API-based open banking, requiring licensed fintechs to expose standardised data endpoints by September 2026.", relevanceTag: "Regulatory" },
    { headline: "Moniepoint raises $110M Series C to deepen SME banking play across West Africa", source: "Disrupt Africa", date: "May 9, 2026", summary: "The round values Moniepoint at $1.2B and will fund expansion into Ghana and Côte d'Ivoire, plus new credit and insurance products for Nigerian SMEs.", relevanceTag: "Competitor" },
    { headline: "Nigeria's informal sector digitisation accelerating faster than projected — World Bank", source: "Nairametrics", date: "May 7, 2026", summary: "62% of Nigerian SMEs that adopted digital payment rails in 2024 reported meaningful revenue growth, accelerating demand for B2B fintech infrastructure.", relevanceTag: "Market Signal" },
    { headline: "FX volatility pushing Nigerian exporters toward multi-currency payment solutions", source: "BusinessDay", date: "May 5, 2026", summary: "Lagos-based export businesses are seeking payment infrastructure that handles FX conversion at the transaction level as naira trades in a wide band against the dollar.", relevanceTag: "Market Signal" },
    { headline: "LinkedIn Nigeria reports 340% increase in B2B content engagement from Lagos accounts in Q1 2026", source: "LinkedIn Marketing Blog", date: "April 28, 2026", summary: "Lagos-based B2B brands are seeing dramatically higher organic reach as LinkedIn's algorithm increasingly favours African-market content.", relevanceTag: "Channel Insight" },
  ],

  contentOpportunities: [
    { title: "No one is explaining open banking to the Lagos SME finance manager", why: "CBN framework just dropped. All competitor content is too technical (for devs) or too vague. The finance manager persona has no good content to follow.", format: "LinkedIn Carousel — 10 slides", urgency: "Act now", trendTiedTo: "CBN open banking rollout" },
    { title: "The real cost of bad payment infrastructure for a ₦20M/month Lagos business", why: "No one is quantifying reconciliation, FX, and failed transaction costs for the mid-market SME. This positions Flowpay as the solution without naming it.", format: "LinkedIn Post — data-led storytelling", urgency: "This week", trendTiedTo: "SME digitisation acceleration" },
    { title: "5 questions to ask before switching your business payment infrastructure", why: "SMEs are actively evaluating options after Moniepoint's raise created market noise. A decision-framework piece captures high-intent buyers in consideration mode.", format: "Twitter Thread — 7 tweets", urgency: "This week", trendTiedTo: "Moniepoint Series C" },
  ],

  contentIdeas: [
    { id: "demo-1", title: "Why Lagos SME finance managers are quietly switching payment providers", format: "linkedin-post" as const, audienceSegment: "SME finance managers", trendTiedTo: "Moniepoint vs Paystack comparisons", competitorGap: "None of the big three speak to this persona", tone: "storytelling" as const, suggestedCTA: "What's your experience? Comment below.", whyItWillWork: "Personal finance manager perspective is completely unoccupied by competitors. LinkedIn algorithm rewards first-person professional narratives from African accounts right now." },
    { id: "demo-2", title: "Open banking in 10 slides: what every Lagos business owner needs to know", format: "carousel" as const, audienceSegment: "SME owners and founders", trendTiedTo: "CBN open banking rollout", competitorGap: "Competitors only covering developer angle", tone: "educational" as const, suggestedCTA: "Save this for your next team meeting.", whyItWillWork: "Regulatory content in plain language consistently outperforms technical posts with this audience. Saves are the highest-value LinkedIn signal." },
    { id: "demo-3", title: "Thread: I tracked Flutterwave, Moniepoint, and Paystack's content for 30 days. Here's what I found.", format: "twitter-thread" as const, audienceSegment: "Fintech-interested founders", trendTiedTo: "Competitor landscape analysis", competitorGap: "No brand does transparent competitor analysis content", tone: "data-driven" as const, suggestedCTA: "RT if you've noticed the same gaps.", whyItWillWork: "Competitor analysis threads consistently go viral in the Lagos fintech Twitter community. Positions Flowpay as the informed, confident alternative." },
    { id: "demo-4", title: "The hidden cost of FX exposure for Nigerian SMEs paying international suppliers", format: "linkedin-post" as const, audienceSegment: "SME owners with international supplier relationships", trendTiedTo: "Dollar vs naira payment rails", competitorGap: "No competitor addresses FX pain for the mid-market SME", tone: "data-driven" as const, suggestedCTA: "How much is FX volatility costing your business? Let's calculate it together.", whyItWillWork: "Quantifying pain is the most effective lead generation hook for B2B infrastructure. Finance managers will share this with their CEOs." },
    { id: "demo-5", title: "We analysed 200 Lagos SME payment failures. Here's the pattern no one talks about.", format: "carousel" as const, audienceSegment: "CFOs and finance managers at Lagos SMEs", trendTiedTo: "SME digitisation acceleration", competitorGap: "Competitors focus on features, not failure patterns", tone: "provocative" as const, suggestedCTA: "Does this match your experience? Tag a Lagos finance manager who needs to see this.", whyItWillWork: "Data-backed provocative content with a specific claim outperforms generic educational posts by 4× on LinkedIn. The 'pattern no one talks about' hook creates scroll-stopping urgency." },
    { id: "demo-6", title: "From ₦5M to ₦50M/month: what your payment infrastructure needs to change at each stage", format: "carousel" as const, audienceSegment: "Growing Lagos SME founders", trendTiedTo: "SME B2B infrastructure demand", competitorGap: "No competitor creates stage-specific infrastructure guidance", tone: "educational" as const, suggestedCTA: "Which stage are you at? Comment your monthly volume and I'll tell you what to prioritise.", whyItWillWork: "Stage-specific content creates high relevance for readers at exactly the right moment in their growth journey. Comment prompts drive engagement that compounds organic reach." },
  ],

} as const