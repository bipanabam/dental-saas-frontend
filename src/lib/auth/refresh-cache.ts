type CachedToken = {
  accessToken: string
  refreshToken: string
  accessTokenExpiresAt: number
  tenantSlug: string
  role: string
}

// userId -> refreshed token (held briefly to absorb concurrent requests)
const tokenCache = new Map<string, CachedToken>()
const refreshPromises = new Map<string, Promise<CachedToken | null>>()

export async function getRefreshedToken(
  userId: string,
  currentRefreshToken: string,
  doRefresh: () => Promise<CachedToken | null>
): Promise<CachedToken | null> {

  // 1. Return cached result if it's fresh (another request already refreshed)
  const cached = tokenCache.get(userId)
  if (cached && Date.now() < cached.accessTokenExpiresAt - 60_000) {
    console.log("[refresh-cache] returning cached token for", userId)
    return cached
  }

  // 2. If a refresh is already in-flight, wait for that same promise
  const inFlight = refreshPromises.get(userId)
  if (inFlight) {
    console.log("[refresh-cache] waiting for in-flight refresh for", userId)
    return inFlight
  }

  // 3. We're first — do the refresh
  const promise = doRefresh()
    .then((result) => {
      if (result) {
        tokenCache.set(userId, result)
        // Clear cache after 10s — long enough to absorb burst, short enough
        // to not serve stale tokens
        setTimeout(() => tokenCache.delete(userId), 10_000)
      }
      return result
    })
    .finally(() => {
      refreshPromises.delete(userId)
    })

  refreshPromises.set(userId, promise)
  return promise
}