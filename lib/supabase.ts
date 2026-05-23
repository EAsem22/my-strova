import { createBrowserClient as _createBrowserClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from './types'

/**
 * Browser client — call inside Client Components.
 * Reads env vars at call time so it works in both dev and prod.
 */
export function createBrowserClient() {
  return _createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
