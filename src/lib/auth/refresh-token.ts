export async function refreshAccessToken(
  refreshToken: string
) {
  // Token refresh helper -> calls /auth/refresh endpoint
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    )

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error?.detail ?? "RefreshTokenExpired")
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
  } catch {
    return {
      error:
        "RefreshTokenExpired" as const,
    }
  }
}