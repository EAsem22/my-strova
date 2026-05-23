// ─── Domain types ────────────────────────────────────────────────────────────

export interface StartupProfile {
  id: string
  user_id: string
  name: string
  industry: string
  audience: string | null
  competitors: string[] | null
  channels: string[] | null
  budget: string | null
  goal: string | null
  created_at: string
}

export interface ContentIdea {
  title: string
  hook: string
  format: string
  channel: string
  estimated_reach?: string
}

export interface Intelligence {
  id: string
  profile_id: string
  score: number | null
  channel_rec: Record<string, unknown>[] | null
  trends: Record<string, unknown>[] | null
  competitor_pulse: Record<string, unknown>[] | null
  content_ideas: ContentIdea[] | null
  raw_output: string | null
  generated_at: string
}

export interface Template {
  id: string
  title: string
  designer_name: string | null
  category: string
  industry_tags: string[] | null
  preview_url: string | null
  asset_url: string | null
  price: number
  trend_tags: string[] | null
  downloads: number
  rating: number
  active: boolean
  created_at: string
}

export interface TemplateSave {
  id: string
  user_id: string
  template_id: string
  created_at: string
}

// ─── Supabase Database type ───────────────────────────────────────────────────
// Matches the exact shape required by @supabase/supabase-js v2

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: StartupProfile
        Insert: {
          id?: string
          user_id: string
          name: string
          industry: string
          audience?: string | null
          competitors?: string[] | null
          channels?: string[] | null
          budget?: string | null
          goal?: string | null
          created_at?: string
        }
        Update: Partial<StartupProfile>
        Relationships: []
      }
      intelligence: {
        Row: Intelligence
        Insert: {
          id?: string
          profile_id: string
          score?: number | null
          channel_rec?: Record<string, unknown>[] | null
          trends?: Record<string, unknown>[] | null
          competitor_pulse?: Record<string, unknown>[] | null
          content_ideas?: ContentIdea[] | null
          raw_output?: string | null
          generated_at?: string
        }
        Update: Partial<Intelligence>
        Relationships: []
      }
      templates: {
        Row: Template
        Insert: {
          id?: string
          title: string
          designer_name?: string | null
          category: string
          industry_tags?: string[] | null
          preview_url?: string | null
          asset_url?: string | null
          price?: number
          trend_tags?: string[] | null
          downloads?: number
          rating?: number
          active?: boolean
          created_at?: string
        }
        Update: Partial<Template>
        Relationships: []
      }
      template_saves: {
        Row: TemplateSave
        Insert: {
          id?: string
          user_id: string
          template_id: string
          created_at?: string
        }
        Update: Partial<TemplateSave>
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
