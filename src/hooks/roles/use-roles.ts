"use client";

import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  listRolesApiV1RolesGet,
  getRoleDetailApiV1RolesRoleIdGet,
  createRoleApiV1RolesPost,
  updateRoleApiV1RolesRoleIdPut,
  deleteRoleApiV1RolesRoleIdDelete,
  replaceRolePermissionsApiV1RolesRoleIdPermissionsPut,
  listPermissionsApiV1SystemPermissionsGet,
} from "@/lib/api";

import {
  listRolesApiV1RolesGetOptions,
  listPermissionsApiV1SystemPermissionsGetOptions,
  getRoleDetailApiV1RolesRoleIdGetOptions
} from "@/lib/api/@tanstack/react-query.gen";

function extractError(err: any, fallback: string) {
  return err?.body?.detail ?? err?.detail ?? err?.message ?? fallback;
}

// Queries
export function useRoles() {
  const { status } = useSession();
  return useQuery({
    ...listRolesApiV1RolesGetOptions(),
    enabled: status === "authenticated",
    staleTime: 2 * 60 * 1000,
  });
}

export function usePermissions() {
  const { status } = useSession();
  return useQuery({
    ...listPermissionsApiV1SystemPermissionsGetOptions(),
    enabled: status === "authenticated",
    staleTime: 10 * 60 * 1000, // permissions rarely change
    gcTime: 30 * 60 * 1000,
  });
}

export function useRoleDetail(roleId?: string) {
  const { status } = useSession();
  return useQuery({
    ...getRoleDetailApiV1RolesRoleIdGetOptions({ path: { role_id: roleId ?? "" } }),
    enabled: status === "authenticated" && Boolean(roleId),
    staleTime: 30_000,
  });
}


// Mutations
export function useCreateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; permission_ids?: string[] }) => {
      const res = await createRoleApiV1RolesPost({ body: payload });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listRolesApiV1RolesGetOptions().queryKey });
      toast.success("Role created.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to create role")),
  });
}

export function useUpdateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      roleId,
      payload,
    }: {
      roleId: string;
      payload: { name?: string; is_active?: boolean; permission_ids?: string[] };
    }) => {
      const res = await updateRoleApiV1RolesRoleIdPut({
        path: { role_id: roleId },
        body: payload,
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listRolesApiV1RolesGetOptions().queryKey });
      toast.success("Role updated.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to update role")),
  });
}

export function useDeleteRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (roleId: string) => {
      const res = await deleteRoleApiV1RolesRoleIdDelete({
        path: { role_id: roleId },
      });
      if (res.error) throw res.error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listRolesApiV1RolesGetOptions().queryKey });
      toast.success("Role deleted.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to delete role")),
  });
}

export function useReplaceRolePermissions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      roleId,
      permissionIds,
    }: {
      roleId: string;
      permissionIds: string[];
    }) => {
      const res = await replaceRolePermissionsApiV1RolesRoleIdPermissionsPut({
        path: { role_id: roleId },
        body: { permission_ids: permissionIds },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listRolesApiV1RolesGetOptions().queryKey });
      toast.success("Permissions updated.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to update permissions")),
  });
}