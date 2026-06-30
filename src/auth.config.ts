import type { NextAuthConfig } from "next-auth";

import { appConfig } from "./lib/config/app";

import { isUserRole } from "@/lib/auth/types";
import { refreshAccessToken } from "@/lib/auth/refresh-token";
import { decodeJwtPayload } from "@/lib/auth/jwt";
import { getRefreshedToken, isTokenError } from "@/lib/auth/refresh-cache";

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
   cookies: {
    sessionToken: {
      name: appConfig.isProd
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: appConfig.isProd,
        domain: appConfig.cookieDomain,
        maxAge: 60 * 60 * 24 * 7,
      },
    },
  },
  // No providers here -> Credentials (with its DB/fetch calls tied to
  // the Node runtime SDK) stays in auth.ts only.
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          userId: user.id ?? "",
          email: user.email ?? "",
          tenantId: user.tenantId,
          tenantName: user.tenantName,
          tenantSlug: user.tenantSlug,
          role: user.role,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpiresAt: user.accessTokenExpiresAt,
          error: undefined,
        };
      }

      if (token.error === "RefreshTokenExpired") {
        return token;
      }

      if (Date.now() < token.accessTokenExpiresAt - 120_000) {
        return token;
      }

      const refreshed = await getRefreshedToken(
        token.refreshToken,
        async () => {
          const result = await refreshAccessToken(token.refreshToken);
          if (result.error) return { error: result.error };

          const payload = decodeJwtPayload(result.accessToken!);
          if (!payload) return null;

          return {
            accessToken: result.accessToken!,
            refreshToken: result.refreshToken!,
            accessTokenExpiresAt: result.accessTokenExpiresAt!,
            tenantSlug: payload?.tenant_slug ?? token.tenantSlug,
            role: payload?.role ?? token.role,
          };
        },
      );

      if (!refreshed) {
        return { ...token, error: "RefreshTokenExpired" as const };
      }
      if (isTokenError(refreshed)) {
        if (refreshed.error === "RefreshNetworkError") {
          return token;
        }
        return { ...token, error: "RefreshTokenExpired" as const };
      }

      return { ...token, ...refreshed, error: undefined };
    },

    async session({ session, token }) {
      session.user.id = token.userId as string;
      session.user.email = token.email as string;
      session.user.tenantId = token.tenantId as string;
      session.user.tenantName = token.tenantName as string;
      session.user.tenantSlug = token.tenantSlug as string;
      session.user.role = isUserRole(token.role) ? token.role : "receptionist";

      session.accessToken = token.accessToken as string;
      session.accessTokenExpiresAt = token.accessTokenExpiresAt as number;
      session.error = token.error as "RefreshTokenExpired" | undefined;
      return session;
    },
  },
};