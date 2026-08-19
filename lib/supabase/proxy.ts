import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname;

  // Define protected routes
  const isProtectedAdminRoute = pathname.startsWith('/admin');
  const isProtectedDashboardRoute = pathname.startsWith('/dashboard');
  const isProtectedPackageRoute = pathname.startsWith('/packages/') && pathname !== '/packages' && !pathname.endsWith('/opengraph-image');
  const isProfileRoute = pathname.startsWith('/profile');

  // Allow social media crawlers & bots through protected package routes
  // so that generateMetadata can produce correct og:image/og:title tags.
  const isProtectedForBots = isProtectedPackageRoute;
  if (isProtectedForBots) {
    const ua = (request.headers.get('user-agent') || '').toLowerCase();
    const BOT_PATTERNS = [
      'facebookexternalhit', 'twitterbot', 'linkedinbot', 'whatsapp',
      'slackbot', 'telegrambot', 'discordbot', 'googlebot', 'bingbot',
      'applebot', 'ia_archiver', 'embedly', 'showyoubot', 'rogerbot',
      'quora link preview', 'vercel', 'next.js', 'validator', 'axios',
      'curl', 'lighthouse', 'chrome-lighthouse', 'postman', 'node-fetch'
    ];
    if (BOT_PATTERNS.some((p) => ua.includes(p))) {
      return NextResponse.next({ request });
    }
  }

  
  // Check role and custom email_verified status if we have a user
  let userRole = null;
  let isEmailVerified = true;
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('role, email_verified')
      .eq('id', user.id)
      .maybeSingle();
    userRole = profile?.role || 'user';
    if (profile && profile.email_verified === false) {
      isEmailVerified = false;
    }
  }

  if (isProtectedAdminRoute || isProtectedDashboardRoute || isProtectedPackageRoute || isProfileRoute) {
    if (!user) {
      // User is not logged in, redirect them to login page securely with redirect param
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    if (!isEmailVerified && userRole !== 'admin') {
      // Non-admin user has not verified their email via Nodemailer custom flow
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('error', 'unverified_email')
      return NextResponse.redirect(url)
    }

    if (isProtectedAdminRoute && userRole !== 'admin') {
      // User is logged in but is NOT an admin
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('error', 'admin_required')
      return NextResponse.redirect(url)
    }
    
    // Disable caching for protected routes to prevent back-button access after logout
    supabaseResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    supabaseResponse.headers.set('Pragma', 'no-cache');
    supabaseResponse.headers.set('Expires', '0');
  }

  // Redirect if logged in and verified when visiting login page
  if (pathname === '/login' && user) {
    if (!user.email_confirmed_at && userRole !== 'admin') {
      // Allow unverified non-admin users to stay on the login page to see errors or resend email
      return supabaseResponse;
    }
    const url = request.nextUrl.clone()
    const redirectUrl = request.nextUrl.searchParams.get('redirect')
    
    if (redirectUrl && redirectUrl.startsWith('/') && !redirectUrl.startsWith('//')) {
      // If the redirect URL is an admin route, ensure they have admin rights
      if (redirectUrl.startsWith('/admin') && userRole !== 'admin') {
        url.pathname = '/'
        url.searchParams.delete('redirect')
      } else {
        url.pathname = redirectUrl
        url.searchParams.delete('redirect')
      }
    } else {
      url.pathname = userRole === 'admin' ? '/admin/dashboard' : '/'
    }
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
