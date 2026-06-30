import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";

import { appConfig } from "@/lib/config/app";

const COOKIE_NAME = appConfig.isProd
  ? "__Secure-authjs.session-token"
  : "authjs.session-token";

/**
 * Server-only helper to read the raw refresh token straight off the
 * encrypted session cookie.
 */
export async function getServerRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return null;

  const token = await decode({
    token: raw,
    secret: process.env.AUTH_SECRET!,
    salt: COOKIE_NAME,
  });

  return (token?.refreshToken as string) ?? null;
}