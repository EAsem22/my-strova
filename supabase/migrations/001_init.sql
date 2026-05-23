-- Users handled by Supabase Auth

-- Startup Profiles
create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  industry text not null,
  audience text,
  competitors text[],
  channels text[],
  budget text,
  goal text,
  created_at timestamptz default now()
);

-- Intelligence outputs
create table intelligence (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  score integer,
  channel_rec jsonb,
  trends jsonb,
  competitor_pulse jsonb,
  content_ideas jsonb,
  raw_output text,
  generated_at timestamptz default now()
);

-- Templates
create table templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  designer_name text,
  category text not null,
  industry_tags text[],
  preview_url text,
  asset_url text,
  price integer default 0,
  trend_tags text[],
  downloads integer default 0,
  rating numeric default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- Template saves by users
create table template_saves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  template_id uuid references templates(id),
  created_at timestamptz default now(),
  unique(user_id, template_id)
);

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table intelligence enable row level security;
alter table template_saves enable row level security;

-- RLS: users can only access their own data
create policy "Users own their profiles" on profiles for all using (auth.uid() = user_id);
create policy "Users own their intelligence" on intelligence for all using (
  profile_id in (select id from profiles where user_id = auth.uid())
);
create policy "Templates are public readable" on templates for select using (active = true);
create policy "Users own their saves" on template_saves for all using (auth.uid() = user_id);
