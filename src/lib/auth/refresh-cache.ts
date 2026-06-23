import { TokenError } from "./types";

type CachedToken = {
  accessToken: string
  refreshToken: string
  accessTokenExpiresAt: number
  tenantSlug: string
  role: string
}

// the refresh token that was used
type RefreshError = { error: TokenError };
type RefreshResult = CachedToken | RefreshError | null;
export function isTokenError(result: RefreshResult): result is RefreshError {
  return !!result && "error" in result;
}

function isCachedToken(result: RefreshResult): result is CachedToken {
  return !!result && "accessToken" in result;
}

const tokenCache    = new Map<string, CachedToken>();
const inflightCache = new Map<string, Promise<RefreshResult>>();

export async function getRefreshedToken(
  currentRefreshToken: string,
  doRefresh: () => Promise<RefreshResult>,
): Promise<RefreshResult> {


  // 1. Already refreshed this exact token in the last ~10s -> return result
  const cached = tokenCache.get(currentRefreshToken);
  if (cached) {
    console.log("[refresh-cache] returning cached result for token");
    return cached;
  }

  // 2. A refresh for this exact token is in-flight → join it
  const inFlight = inflightCache.get(currentRefreshToken);
  if (inFlight) {
    console.log("[refresh-cache] joining in-flight refresh");
    return inFlight;
  }


  // 3. First request for this token → do the refresh
  const promise = doRefresh()
    .then((result) => {
      if (result) {
        if (isCachedToken(result)) {
          tokenCache.set(currentRefreshToken, result);
          // Hold long enough to absorb any concurrent requests
          setTimeout(() => tokenCache.delete(currentRefreshToken), 15_000);
        }
      }
      return result;
    })
    .finally(() => {
      inflightCache.delete(currentRefreshToken);
    });

  inflightCache.set(currentRefreshToken, promise);
  return promise;
}