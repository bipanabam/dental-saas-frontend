import { useTenant } from "@/providers/tenant-provider";
import {
  getPermissionsFromRole,
  type Permission,
  Role
} from "@/lib/rbac/roles";

export const usePermissions = () => {
  const { session } = useTenant();

  const role = (session?.user?.role as Role) ?? "receptionist";
  const permissions = getPermissionsFromRole(role);

  const can = (permission: Permission) =>
    permissions.includes("*") ||
    permissions.includes(permission);

  return { role, permissions, can };
};