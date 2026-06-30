import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "./auth.config";
import { appConfig } from "@/lib/config/app";

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
    refreshToken: string; // stays in the JWT (server-side, encrypted) only
    accessTokenExpiresAt: number;
    error?: "RefreshTokenExpired";
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
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
        if (!payload || !isUserRole(payload.role)) return null;

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
  // No callbacks block needed -> authConfig already supplies jwt/session.
});