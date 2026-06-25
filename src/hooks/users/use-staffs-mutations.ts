"use client";

import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createUserApiV1UsersPost,
  updateUserApiV1UsersUserIdPut,
  deleteUserApiV1UsersUserIdDelete,
  restoreUserApiV1UsersUserIdRestorePut,
  updateUserAccessApiV1UsersUserIdAccessPut,
  resetUserPasswordApiV1UsersUserIdSecurityPasswordPut,
  updateUserProfileApiV1UsersUserIdProfilePut,
} from "@/lib/api";
import type { GenderEnum } from "@/lib/api";

import { getUserProfileApiV1UsersUserIdProfileGetOptions, getUsersApiV1UsersGetOptions } from "@/lib/api/@tanstack/react-query.gen";

function extractError(err: any, fallback: string): string {
  return (
    err?.body?.detail ??
    err?.error?.detail ?? 
    err?.detail ??
    err?.message ??
    fallback
  );
}

export function useCreateUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      email: string;
      username: string;
      password: string;
      phone_number?: string;
      role: string;
    }) => {
      const res = await createUserApiV1UsersPost({ body: payload });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: getUsersApiV1UsersGetOptions().queryKey,
      });
      toast.success("User created successfully.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to create user")),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      payload,
    }: {
      userId: string;
      payload: {
        email?: string;
        username?: string;
        phone_number?: string;
        role?: string;
        is_active?: boolean;
        is_verified?: boolean;
      };
    }) => {
      const res = await updateUserApiV1UsersUserIdPut({
        path: { user_id: userId },
        body: payload,
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: getUsersApiV1UsersGetOptions().queryKey,
      });
      toast.success("User updated.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to update user")),
  });
}

export function useDisableUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await deleteUserApiV1UsersUserIdDelete({
        path: { user_id: userId },
      });
      if (res.error) throw res.error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: getUsersApiV1UsersGetOptions().queryKey });
      toast.success("User disabled.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to disable user")),
  });
}

export function useRestoreUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await restoreUserApiV1UsersUserIdRestorePut({
        path: { user_id: userId },
      });
      if (res.error) throw res.error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: getUsersApiV1UsersGetOptions().queryKey });
      toast.success("User restored.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to restore user")),
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, roleId }: { userId: string; roleId: string }) => {
      const res = await updateUserAccessApiV1UsersUserIdAccessPut({
        path: { user_id: userId },
        body: { role_id: roleId },
      });
      if (res.error) throw res.error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: getUsersApiV1UsersGetOptions().queryKey });
      toast.success("Role updated.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to update role")),
  });
}

export function useAdminResetPassword() {
  return useMutation({
    mutationFn: async ({
      userId,
      newPassword,
    }: {
      userId: string;
      newPassword: string;
    }) => {
      const res = await resetUserPasswordApiV1UsersUserIdSecurityPasswordPut({
        path: { user_id: userId },
        body: { new_password: newPassword },
      });
      if (res.error) throw res.error;
    },
    onSuccess: () => toast.success("Password reset successfully."),
    onError: (err: any) => toast.error(extractError(err, "Failed to reset password")),
  });
}

export function useUpdateUserProfile(userId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      bio?: string | null;
      gender?: GenderEnum | null;
      date_of_birth?: string | null;
      address?: string | null;
      specialization?: string | null;
      nmc_reg_no?: string | null;
      qualification?: string | null;
      experience_years?: number | null;
      consultation_fee?: number | null;
    }) => {
      const res = await updateUserProfileApiV1UsersUserIdProfilePut({
        path: { user_id: userId },
        body: payload,
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (data) => {
      // Patch directly — no need to refetch
      qc.setQueryData(
        getUserProfileApiV1UsersUserIdProfileGetOptions({
          path: { user_id: userId },
        }).queryKey,
        data
      );
      toast.success("Profile updated.");
    },
    onError: (err: any) =>
      toast.error(extractError(err, "Failed to update profile")),
  });
}