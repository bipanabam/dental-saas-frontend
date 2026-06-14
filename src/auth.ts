import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "./auth.config";

import { refreshAccessToken } from "./lib/auth/refresh-token";
import { decodeJwtPayload } from "./lib/auth/jwt";

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

// declare module "next-auth/jwt" {
//   interface JWT {
//     userId: string
//     email: string
//     tenantId: string
//     tenantSlug: string
//     role: string
//     accessToken: string
//     refreshToken: string
//     accessTokenExpiresAt: number
//     error?: "RefreshTokenExpired"
//   }
// }

const isProd = process.env.NODE_ENV === "production";
const cookieDomain = isProd ? ".dentalsaas.com" : ".app.local";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  cookies: {
    sessionToken: {
      name: isProd ? "__Secure-authjs.session-token" : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProd,
        domain: cookieDomain,
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
        const payload = decodeJwtPayload(user.accessToken);
        token.userId = payload?.sub ?? "";
        token.email = user.email ?? "";
        token.tenantId = payload?.tenant_id ?? "";
        token.tenantName = payload?.tenant_name ?? "";
        token.tenantSlug = user.tenantSlug;
        token.role = payload?.role ?? "";
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpiresAt = user.accessTokenExpiresAt;
        return token;
      }

      if (Date.now() < token.accessTokenExpiresAt - 60_000) {
        return token;
      }

      const refreshed = await refreshAccessToken(token.refreshToken);
      if (refreshed.error) {
        return { ...token, error: refreshed.error };
      }

      const payload = decodeJwtPayload(refreshed.accessToken!);
      return {
        ...token,
        accessToken: refreshed.accessToken!,
        refreshToken: refreshed.refreshToken!,
        accessTokenExpiresAt: refreshed.accessTokenExpiresAt!,
        tenantSlug: payload?.tenant_slug ?? token.tenantSlug,
        role: payload?.role ?? token.role,
        error: undefined,
      };
    },
  },
});
