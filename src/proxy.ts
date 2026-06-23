import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { appConfig } from "./lib/config/app";

const { auth } = NextAuth(authConfig);

// Route classification
/** Paths that never require authentication */
const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/forgot-password",

  "/redirect-to-tenant",
];

/** Static assets and Next.js internals — skip middleware entirely */
const SKIP_PREFIXES = ["/_next", "/favicon", "/api/auth"];

// Helpers
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

function shouldSkip(pathname: string): boolean {
  return SKIP_PREFIXES.some((p) => pathname.startsWith(p));
}

/**
 * Derive subdomain from the request hostname.
 * Production:  clinic-a.buddhadental.com  →  "clinic-a"
 * Development: clinic-a.app.local:3000    →  "clinic-a"
 */
function getSubdomain(hostname: string): string | null {
  // Strip port
  const host = hostname.split(":")[0];

  const suffix = `.${appConfig.domain}`;

  if (!host.endsWith(suffix)) {
    return null;
  }

  const sub = host.replace(suffix, "");

  return sub === "www" ? null : sub;
}

function buildDashboardUrl(tenantSlug: string) {
  return `${appConfig.tenantUrl(tenantSlug)}/dashboard`;
}

function buildLoginUrl(request: NextRequest) {
  const url = new URL("/login", appConfig.rootUrl);

  if (!request.nextUrl.pathname.startsWith("/login")) {
    url.searchParams.set("callbackUrl", request.url);
  }

  return url.toString();
}

// Middleware
export default auth(function proxy(request) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") ?? "";
  const subdomain = getSubdomain(hostname);
  const session = request.auth;
  const isAuthenticated =
  !!session &&
  session.error !== "RefreshTokenExpired"; // instead of !session.error

  // 1. Skip Next.js internals and static files
  // if (pathname === "/redirect-to-tenant") {
  //   return NextResponse.next();
  // }

  if (shouldSkip(pathname)) {
    return NextResponse.next();
  }

  // 2. If the session has a refresh token error, force re-login from any page
  if (session?.error === "RefreshTokenExpired") {
    const loginUrl = buildLoginUrl(request);
    const response = NextResponse.redirect(loginUrl);
    // Clear the stale session cookie
    response.cookies.delete("authjs.session-token");
    response.cookies.delete("__Secure-authjs.session-token");
    return response;
  }

  // 3. Root domain logic
  if (!subdomain) {
    // Authenticated user on login page -> redirect to their tenant dashboard
    if (isAuthenticated && isPublicPath(pathname)) {
      return NextResponse.redirect(
        buildDashboardUrl(session.user.tenantSlug),
      );
    }

    // Authenticated user at root "/" → redirect to their tenant dashboard
    if (isAuthenticated && pathname === "/") {
      return NextResponse.redirect(
        buildDashboardUrl(session.user.tenantSlug),
      );
    }

    // Unauthenticated user trying to access a protected page on root domain
    if (!isAuthenticated && !isPublicPath(pathname)) {
      return NextResponse.redirect(buildLoginUrl(request));
    }

    return NextResponse.next();
  }

  // 4. Tenant subdomain logic
  // Unauthenticated on a tenant subdomain -> back to login
  if (!isAuthenticated) {
    return NextResponse.redirect(buildLoginUrl(request));
  }

  // Authenticated user navigating to a public page on their subdomain
  // (e.g. they bookmarked /login on the tenant domain) -> send to dashboard
  if (isPublicPath(pathname)) {
    return NextResponse.redirect(
      new URL("/dashboard", appConfig.tenantUrl(subdomain)),
    );
  }

  // Wrong tenant: the session belongs to a different clinic
  // This prevents tenant A's token from accessing tenant B's subdomain.
  if (session.user.tenantSlug !== subdomain) {
    return NextResponse.redirect(buildDashboardUrl(session.user.tenantSlug));
  }

  // All good: attach tenant context as headers so server components and
  // API route handlers can read them without parsing the session again.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-tenant-slug", session.user.tenantSlug);
  requestHeaders.set("x-tenant-id", session.user.tenantId);
  requestHeaders.set("x-user-id", session.user.id);
  requestHeaders.set("x-user-role", session.user.role);
  requestHeaders.set("x-pathname",    pathname);   // useful for active nav state

  return NextResponse.next({ request: { headers: requestHeaders } });
});

// Matcher -> run middleware on all routes except static files
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
};
