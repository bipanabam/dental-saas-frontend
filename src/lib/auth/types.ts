export const USER_ROLES = ["admin", "doctor", "receptionist", "accountant"] as const;

export type UserRole = (typeof USER_ROLES)[number];

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
