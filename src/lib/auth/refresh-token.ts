export async function refreshAccessToken(
  refreshToken: string
) {
  // Token refresh helper -> calls /auth/refresh endpoint
  try {
    const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(
      `${API_URL}/api/v1/auth/refresh`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${refreshToken}`,
        },
         body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      }
    )

    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      console.error("[refresh] failed:", response.status, body)
      throw new Error(body?.detail ?? "RefreshTokenExpired")
    }

    const tokens = await response.json()

    return {
      accessToken: tokens.access_token as string,
      refreshToken:
        tokens.refresh_token as string,
      accessTokenExpiresAt:
        Date.now() +
        tokens.expires_in * 1000,
      error: undefined,
    }
  } catch (e) {
    console.error("[refresh] exception:", e)
    return { error: "RefreshTokenExpired" as const }
  }
}