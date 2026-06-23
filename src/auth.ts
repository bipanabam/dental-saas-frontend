import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "./auth.config";
import { appConfig } from "@/lib/config/app";

import { refreshAccessToken } from "./lib/auth/refresh-token";
import { decodeJwtPayload } from "./lib/auth/jwt";
import { getRefreshedToken, isTokenError } from "./lib/auth/refresh-cache";

import { LoginSchema } from "@/lib/schemas/auth";
import type { UserRole } from "@/lib/auth/types";
import { isUserRole } from "@/lib/auth/types";

import { loginForAccessTokenApiV1AuthTokenPost } from "@/lib/api/sdk.gen";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;

      tenantId: string;
      tenantName: string;
      tenantSlug: string;

      role: UserRole;
    } & DefaultSession["user"];

    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: number;

    error?: "RefreshTokenExpired";
  }

  interface User {
    id: string;
    email: string;

    tenantId: string;
    tenantName: string;
    tenantSlug: string;

    role: UserRole;

    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: number;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    userId: string;
    email: string;

    tenantId: string;
    tenantName: string;
    tenantSlug: string;

    role: string;

    accessToken: string;
    refreshToken: string;

    accessTokenExpiresAt: number;

    error?: "RefreshTokenExpired";
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
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
        maxAge: 60 * 60 * 24 * 7, // 7 days -> same as backend
      },
    },
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { data, error } = await loginForAccessTokenApiV1AuthTokenPost({
          body: {
            username: parsed.data.username,
            password: parsed.data.password,
          },
        });

        if (error || !data) return null;

        const payload = decodeJwtPayload(data.access_token);
        if (!payload) return null;

        if (!isUserRole(payload.role)) {
          return null;
        }

        return {
          id: payload.sub,
          email: parsed.data.username,
          tenantId: payload.tenant_id,
          tenantName: payload.tenant_name,
          tenantSlug: data.tenant_slug,
          role: payload.role,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          accessTokenExpiresAt: Date.now() + data.expires_in * 1000,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        return{
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
        }
      }

      // Already known dead — bail immediately.
      // The session-side error flag + middleware redirect will handle
      // forcing re-login; further refresh attempts here just spam the
      // backend with 401s.
      if (token.error === "RefreshTokenExpired") {
        return token;
      }

      // auth.ts
      if (Date.now() < token.accessTokenExpiresAt - 120_000) {
        return token;
      }

      console.log("[jwt] attempting refresh for user:", token.userId)

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
          }
        }
      )
      
      // null → unexpected, treat as permanent failure
      if (!refreshed) {
        console.log("[jwt] refresh failed for user:", token.userId)
        return { ...token, error: "RefreshTokenExpired" as const }
      }
      if (isTokenError(refreshed)) {
        if (refreshed.error === "RefreshNetworkError") {
          // Transient -> keep existing token, retry next request
          console.log("[jwt] transient refresh error, keeping token");
          return token;
        }
        // Permanent -> force re-login
        console.log("[jwt] refresh token expired for user:", token.userId);
        return { ...token, error: "RefreshTokenExpired" as const };
      }

      console.log("[jwt] refresh success for user:", token.userId)
      return {
        ...token,
        ...refreshed,
        error: undefined,
      }
    },
  },
});
