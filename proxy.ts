import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Public routes
  if (
    pathname === '/login' ||
    pathname.startsWith('/auth/callback') ||
    pathname.startsWith('/api/stripe/webhook')
  ) {
    return supabaseResponse
  }

  // Handle mockup routes dynamically based on privacy settings
  const isMockupView = pathname.startsWith('/view/')
  const isMockupApi = pathname.startsWith('/api/mockups/') && !pathname.endsWith('/upload')

  if (isMockupView || isMockupApi) {
    const segments = pathname.split('/')
    const token = segments[segments.length - 1]

    if (token) {
      const { data: mockup } = await supabase
        .from('mockups')
        .select('is_private, client_id')
        .eq('share_token', token)
        .single()

      if (mockup && !mockup.is_private) {
        return supabaseResponse
      }

      if (mockup && mockup.is_private) {
        if (!user) {
          return NextResponse.redirect(
            new URL(`/login?next=${encodeURIComponent(pathname)}`, request.url)
          )
        }

        // Check user role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        const role = profile?.role

        if (role === 'admin') {
          return supabaseResponse
        }

        if (role === 'client') {
          const { data: client } = await supabase
            .from('clients')
            .select('profile_id')
            .eq('id', mockup.client_id)
            .single()

          if (client && client.profile_id === user.id) {
            return supabaseResponse
          }
        }

        // Authenticated but unauthorized for this specific private mockup
        const dest = role === 'admin' ? '/admin/dashboard' : '/portal'
        return NextResponse.redirect(new URL(dest, request.url))
      }
    }

    return supabaseResponse
  }

  // Redirect unauthenticated users to login
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Get user role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role

  // Admin-only routes
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/portal', request.url))
  }

  // Client-only routes
  if (pathname.startsWith('/portal') && role !== 'client') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  // Root redirect
  if (pathname === '/') {
    const dest = role === 'admin' ? '/admin/dashboard' : '/portal'
    return NextResponse.redirect(new URL(dest, request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
