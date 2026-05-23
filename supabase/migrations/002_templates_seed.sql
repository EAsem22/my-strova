-- ─── Template seed data ───────────────────────────────────────────────────────
-- 15 templates: 5 free, 10 paid (₦2,000–₦8,000)
-- Run after 001_init.sql

insert into templates (title, designer_name, category, industry_tags, preview_url, asset_url, price, trend_tags, downloads, rating, active)
values

-- ── LinkedIn Carousel (5) ─────────────────────────────────────────────────────
(
  'Fintech 101: 5 Things Every Lagos Millennial Should Know',
  'Adaeze Okafor', 'LinkedIn Carousel', array['Fintech','Finance'],
  'https://placehold.co/1280x720/0f172a/3b82f6?text=Fintech+101',
  null, 0,
  array['Educational carousels','Thought leadership','Audience growth','Trust building'],
  2847, 4.8, true
),
(
  'The Startup Pitch Deck Carousel',
  'Emeka Obi', 'LinkedIn Carousel', array['SaaS','Tech','Fintech'],
  'https://placehold.co/1280x720/1e1b4b/818cf8?text=Pitch+Deck',
  null, 0,
  array['Investor outreach','Product launches','Founder storytelling','B2B positioning'],
  1203, 4.5, true
),
(
  'Competitor Takedown: Why Founders Are Switching',
  'Chidi Nwachukwu', 'LinkedIn Carousel', array['SaaS','Fintech','E-commerce'],
  'https://placehold.co/1280x720/172554/60a5fa?text=Competitor+Takedown',
  null, 3500,
  array['Competitive positioning','Conversion content','Decision-stage buyers','Brand differentiation'],
  891, 4.7, true
),
(
  'Founder Story: From ₦0 to ₦10M MRR',
  'Femi Adebayo', 'LinkedIn Carousel', array['SaaS','Fintech'],
  'https://placehold.co/1280x720/0c1445/93c5fd?text=Founder+Story',
  null, 2500,
  array['Founder-led content','Brand credibility','Community building','Viral potential'],
  654, 4.6, true
),
(
  'Product Feature Drop: 7 Slides That Convert',
  'Seun Olatunji', 'LinkedIn Carousel', array['SaaS','Tech'],
  'https://placehold.co/1280x720/162032/7dd3fc?text=Feature+Drop',
  null, 4000,
  array['Product launches','Feature announcements','User education','Engagement campaigns'],
  432, 4.4, true
),

-- ── Social Post (3) ───────────────────────────────────────────────────────────
(
  'Fashion Brand Launch Set (12 templates)',
  'Kemi Adeleke', 'Social Post', array['Fashion','Lifestyle','E-commerce'],
  'https://placehold.co/1080x1080/2d1b69/c4b5fd?text=Fashion+Launch',
  null, 0,
  array['Brand launches','Instagram feed','Product reveals','Influencer campaigns'],
  3210, 4.9, true
),
(
  'Food Story: Farm to Table Social Kit',
  'Chioma Eze', 'Social Post', array['Food & Beverage','Lifestyle'],
  'https://placehold.co/1080x1080/1c1917/a16207?text=Food+Story',
  null, 0,
  array['Brand storytelling','Community engagement','Product photography captions','Seasonal campaigns'],
  1876, 4.7, true
),
(
  'Ramadan & Eid Campaign Kit',
  'Habiba Yusuf', 'Social Post', array['E-commerce','Fashion','Food & Beverage'],
  'https://placehold.co/1080x1080/1a1a2e/c084fc?text=Ramadan+Kit',
  null, 2000,
  array['Seasonal campaigns','Cultural marketing','Holiday promotions','Community reach'],
  567, 4.5, true
),

-- ── Video Script (2) ─────────────────────────────────────────────────────────
(
  'Fintech Explainer: How It Works in 60 Seconds',
  'Tunde Balogun', 'Video Script', array['Fintech','Finance'],
  'https://placehold.co/1280x720/111827/10b981?text=Fintech+Explainer',
  null, 3000,
  array['Product explainers','Paid ads','Onboarding videos','App store previews'],
  723, 4.6, true
),
(
  'Brand Documentary Script: The Origin Story',
  'Seun Olatunji', 'Video Script', array['Fashion','Lifestyle','E-commerce'],
  'https://placehold.co/1280x720/0f172a/34d399?text=Origin+Story',
  null, 6000,
  array['Brand documentaries','Investor videos','Founder storytelling','Press features'],
  298, 4.8, true
),

-- ── Email (3) ────────────────────────────────────────────────────────────────
(
  'Newsletter Header Pack (10 designs)',
  'Bayo Adeyemi', 'Email', array['SaaS','Fintech','E-commerce'],
  'https://placehold.co/800x600/f8fafc/1e293b?text=Newsletter+Headers',
  null, 0,
  array['Weekly newsletters','Announcement emails','Re-engagement campaigns','Subscriber growth'],
  4102, 4.9, true
),
(
  'Product Launch Email Sequence (5 emails)',
  'Amara Nwosu', 'Email', array['Fintech','SaaS','E-commerce'],
  'https://placehold.co/800x600/fffbeb/92400e?text=Launch+Sequence',
  null, 4000,
  array['Product launches','Pre-launch hype','Waitlist conversion','Revenue campaigns'],
  521, 4.7, true
),
(
  'Abandoned Cart Recovery Kit (3 emails)',
  'Folake Bello', 'Email', array['E-commerce','Fashion','Food & Beverage'],
  'https://placehold.co/800x600/fef3c7/78350f?text=Cart+Recovery',
  null, 2500,
  array['Revenue recovery','E-commerce automation','Customer retention','Conversion optimisation'],
  389, 4.5, true
),

-- ── Landing Page (2) ─────────────────────────────────────────────────────────
(
  'Investment App Landing Page',
  'Ngozi Chukwu', 'Landing Page', array['Fintech','Finance'],
  'https://placehold.co/1440x900/ecfdf5/065f46?text=Investment+App',
  null, 8000,
  array['App launches','Paid ad destinations','Sign-up conversion','Investor demos'],
  187, 4.9, true
),
(
  'SaaS Free Trial Landing Page',
  'Dayo Adekunle', 'Landing Page', array['SaaS','Tech'],
  'https://placehold.co/1440x900/f0fdf4/14532d?text=SaaS+Free+Trial',
  null, 7500,
  array['Trial sign-ups','Product-led growth','Demo requests','B2B acquisition'],
  143, 4.8, true
)

on conflict do nothing;
