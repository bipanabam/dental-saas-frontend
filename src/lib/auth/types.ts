export const USER_ROLES = ["admin", "doctor", "receptionist", "accountant"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const AUTH_ERRORS = ["RefreshTokenExpired"] as const;
export type AuthError = typeof AUTH_ERRORS[number];
export type TokenError =
  | "RefreshTokenExpired"   // token is genuinely dead -> force re-login
  | "RefreshNetworkError";  // transient failure -> retry next request

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && USER_ROLES.includes(value as UserRole);
}

export type AppSession = {
  user: {
    id: string;
    email: string;

    tenantId: string;
    tenantName: string;
    tenantSlug: string;

    role: UserRole;
    name?: string;
  };

  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;

  error?: "RefreshTokenExpired";
};
