import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/lib/types'

export async function middleware(req: NextRequest) {
  // Allow pass-through in environments without Supabase credentials (local dev / portfolio preview)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next()
  }

  // Allow pass-through for demo mode — ?demo=true or strova-demo cookie bypasses auth
  const isDemoUrl  = req.nextUrl.searchParams.get('demo') === 'true'
  const isDemoCookie = req.cookies.get('strova-demo')?.value === 'true'
  if (isDemoUrl || isDemoCookie) return NextResponse.next()

  let response = NextResponse.next({ request: { headers: req.headers } })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (toSet) => {
          toSet.forEach(({ name, value }) => req.cookies.set(name, value))
          response = NextResponse.next({ request: { headers: req.headers } })
          toSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session cookie if needed — do not remove this call
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/content/:path*',
    '/templates/:path*',
    '/trends/:path*',
    '/onboarding/:path*',
  ],
}
