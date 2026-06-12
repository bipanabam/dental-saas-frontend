import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    // Only the JWT shape/session callbacks are needed here.
    // The authorize() provider is NOT included — that runs server-side only.
    async session({ session, token }) {
      session.user.id = token.userId as string
      session.user.email = token.email as string
      session.user.tenantId = token.tenantId as string
      session.user.tenantSlug = token.tenantSlug as string
      session.user.role = token.role as string
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      session.accessTokenExpiresAt = token.accessTokenExpiresAt as number
      session.error = token.error as "RefreshTokenExpired" | undefined
      return session
    },
  },
  providers: [], // required by NextAuth — credentials go in auth.ts only
}