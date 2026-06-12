import NextAuth from "next-auth";
import { authConfig } from "./auth.config" ;

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig)

// Route classification
/** Paths that never require authentication */
const PUBLIC_PATHS = ["/login", "/register", "/forgot-password"]

/** Static assets and Next.js internals — skip middleware entirely */
const SKIP_PREFIXES = ["/_next", "/favicon", "/api/auth"]

// Helpers
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))
}

function shouldSkip(pathname: string): boolean {
  return SKIP_PREFIXES.some((p) => pathname.startsWith(p))
}

/**
 * Derive subdomain from the request hostname.
 * Production:  clinic-a.buddhadental.com  →  "clinic-a"
 * Development: clinic-a.localhost:3000    →  "clinic-a"
 */
function getSubdomain(hostname: string): string | null {
  // Strip port
  const host = hostname.split(":")[0]

  const isProd = host.endsWith(".dentalsaas.com")
  const isDev = host.endsWith(".localhost")

  if (isProd) {
    const sub = host.replace(".dentalsaas.com", "")
    return sub === "www" ? null : sub
  }

  if (isDev) {
    const sub = host.replace(".localhost", "")
    return sub || null
  }

  return null
}

function buildDashboardUrl(tenantSlug: string, request: NextRequest): string {
  const isDev = process.env.NODE_ENV === "development"
  const base = isDev
    ? `http://${tenantSlug}.localhost:3000`
    : `https://${tenantSlug}.dentalsaas.com`
  return `${base}/dashboard`
}

function buildLoginUrl(request: NextRequest): string {
  const isDev = process.env.NODE_ENV === "development"
  const base = isDev ? "http://localhost:3000" : "https://dentalsaas.com"
  const callbackUrl = encodeURIComponent(request.url)
  return `${base}/login?callbackUrl=${callbackUrl}`
}


// Middleware
export default auth(function proxy(request) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get("host") ?? ""
  const subdomain = getSubdomain(hostname)
  const session = request.auth
  const isAuthenticated = !!session && !session.error

  // 1. Skip Next.js internals and static files
  if (shouldSkip(pathname)) {
    return NextResponse.next()
  }

  // 2. If the session has a refresh token error, force re-login from any page
  if (session?.error === "RefreshTokenExpired") {
    const loginUrl = buildLoginUrl(request)
    const response = NextResponse.redirect(loginUrl)
    // Clear the stale session cookie
    response.cookies.delete("authjs.session-token")
    response.cookies.delete("__Secure-authjs.session-token")
    return response
  }

  // 3. Root domain logic
  if (!subdomain) {
    // Authenticated user on login page -> redirect to their tenant dashboard
    if (isAuthenticated && isPublicPath(pathname)) {
      return NextResponse.redirect(
        buildDashboardUrl(session.user.tenantSlug, request)
      )
    }

    // Authenticated user at root "/" → redirect to their tenant dashboard
    if (isAuthenticated && pathname === "/") {
      return NextResponse.redirect(
        buildDashboardUrl(session.user.tenantSlug, request)
      )
    }

    // Unauthenticated user trying to access a protected page on root domain
    if (!isAuthenticated && !isPublicPath(pathname)) {
      return NextResponse.redirect(buildLoginUrl(request))
    }

    return NextResponse.next()
  }

  // 4. Tenant subdomain logic

  // Unauthenticated on a tenant subdomain → back to login
  if (!isAuthenticated) {
    return NextResponse.redirect(buildLoginUrl(request))
  }

  // Wrong tenant: the session belongs to a different clinic
  // This prevents tenant A's token from accessing tenant B's subdomain.
  if (session.user.tenantSlug !== subdomain) {
    return NextResponse.redirect(
      buildDashboardUrl(session.user.tenantSlug, request)
    )
  }

  // All good — attach tenant context as headers so server components and
  // API route handlers can read them without parsing the session again.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-tenant-slug", session.user.tenantSlug)
  requestHeaders.set("x-tenant-id", session.user.tenantId)
  requestHeaders.set("x-user-id", session.user.id)
  requestHeaders.set("x-user-role", session.user.role)

  return NextResponse.next({ request: { headers: requestHeaders } })
})


// Matcher — run middleware on all routes except static files
export const config = {
  matcher: [
    /*
     * Match everything except:
     * - _next/static  (static files)
     * - _next/image   (image optimisation)
     * - favicon.ico
     * - Public image/font assets in /public
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf)$).*)",
  ],
}