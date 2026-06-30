"use server";

import { signOut } from "@/auth";
import { appConfig } from "@/lib/config/app";
import { getServerRefreshToken } from "@/lib/auth/server-token";

export async function logout(): Promise<void> {
  const refreshToken = await getServerRefreshToken();

  if (refreshToken) {
    try {
      const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

      await fetch(`${API_URL}/api/v1/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    } catch (e) {
      console.error(e);
    }
  }

  await signOut({
    redirectTo: `${appConfig.rootUrl}/login?clearAuth=1`,
  });
}