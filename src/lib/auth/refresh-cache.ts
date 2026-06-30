import { TokenError } from "./types";

type CachedToken = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;
  tenantSlug: string;
  role: string;
};

type RefreshError = { error: TokenError };
type RefreshResult = CachedToken | RefreshError | null;

export function isTokenError(result: RefreshResult): result is RefreshError {
  return !!result && "error" in result;
}

function isCachedToken(result: RefreshResult): result is CachedToken {
  return !!result && "accessToken" in result;
}

// Cache both successful refreshes AND results, so a burst of concurrent
// requests against an already-dead token doesn't each independently
// round-trip to the backend.
const resultCache = new Map<string, RefreshResult>();
const inflightCache = new Map<string, Promise<RefreshResult>>();

export async function getRefreshedToken(
  currentRefreshToken: string,
  doRefresh: () => Promise<RefreshResult>,
): Promise<RefreshResult> {
  const cached = resultCache.get(currentRefreshToken);
  if (cached !== undefined) {
    return cached;
  }

  const inFlight = inflightCache.get(currentRefreshToken);
  if (inFlight) {
    return inFlight;
  }

  const promise = doRefresh()
    .then((result) => {
      // Cache successes and permanent failures. Skip transient network
      // errors so a momentary blip doesn't get "stuck" cached as failed.
      const isPermanentFailure =
        isTokenError(result) && result.error === "RefreshTokenExpired";

      if (isCachedToken(result) || isPermanentFailure) {
        resultCache.set(currentRefreshToken, result);
        setTimeout(() => resultCache.delete(currentRefreshToken), 15_000);
      }

      return result;
    })
    .finally(() => {
      inflightCache.delete(currentRefreshToken);
    });

  inflightCache.set(currentRefreshToken, promise);
  return promise;
}