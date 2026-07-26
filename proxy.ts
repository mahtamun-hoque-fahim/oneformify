import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = getSessionCookie(request)

  // Protect dashboard routes — no session → login
  if (pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Fix C6 — proxy-level admin guard (defense-in-depth; layout also checks role)
  // Session cookie presence is checked here; role is enforced in admin/layout.tsx
  // We can only read the cookie token here (role is not in the JWT by default),
  // so we redirect unauthenticated users and let the server layout handle role checks.
  // This ensures unauthenticated users never hit the admin RSC at all.
  if (pathname.startsWith('/admin') && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect logged-in users away from auth pages
  if (session && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/signup'],
}
