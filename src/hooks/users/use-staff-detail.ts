"use client";

import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateUserAccessApiV1UsersUserIdAccessPut,
  revokeUserSessionApiV1UsersUserIdSessionsSessionIdDelete,
  revokeAllUserSessionsApiV1UsersUserIdSessionsDelete,
  updateUserPreferencesApiV1UsersUserIdPreferencesPut,
} from "@/lib/api";

import {
  getUserAccessApiV1UsersUserIdAccessGetOptions,
  listUserSessionsApiV1UsersUserIdSessionsGetOptions,
  getUserPreferencesApiV1UsersUserIdPreferencesGetOptions,
  getUsersSummaryApiV1UsersSummaryGetOptions,
  getUsersApiV1UsersGetOptions,
} from "@/lib/api/@tanstack/react-query.gen";

function extractError(err: any, fallback: string) {
  return err?.body?.detail ?? err?.detail ?? err?.message ?? fallback;
}


// Summary
export function useStaffSummary() {
  const { status } = useSession();
  return useQuery({
    ...getUsersSummaryApiV1UsersSummaryGetOptions(),
    enabled: status === "authenticated",
    staleTime: 2 * 60 * 1000,
  });
}


// Access
export function useUserAccess(userId: string) {
  const { status } = useSession();
  return useQuery({
    ...getUserAccessApiV1UsersUserIdAccessGetOptions({ path: { user_id: userId } }),
    enabled: status === "authenticated" && Boolean(userId),
    staleTime: 60_000,
  });
}

export function useUpdateUserAccess(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (roleId: string) => {
      const res = await updateUserAccessApiV1UsersUserIdAccessPut({
        path: { user_id: userId },
        body: { role_id: roleId },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (data) => {
      qc.setQueryData(
        getUserAccessApiV1UsersUserIdAccessGetOptions({ path: { user_id: userId } }).queryKey,
        data
      );
      qc.invalidateQueries({ queryKey: getUsersApiV1UsersGetOptions().queryKey });
      toast.success("Role updated.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to update role")),
  });
}


// Sessions
export function useUserSessions(userId: string) {
  const { status } = useSession();
  return useQuery({
    ...listUserSessionsApiV1UsersUserIdSessionsGetOptions({ path: { user_id: userId } }),
    enabled: status === "authenticated" && Boolean(userId),
    staleTime: 30_000,
  });
}

export function useRevokeSession(userId: string) {
  const qc = useQueryClient();
  const key = listUserSessionsApiV1UsersUserIdSessionsGetOptions({ path: { user_id: userId } }).queryKey;

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await revokeUserSessionApiV1UsersUserIdSessionsSessionIdDelete({
        path: { user_id: userId, session_id: sessionId },
      });
      if (res.error) throw res.error;
    },
    onSuccess: (_data, sessionId) => {
      qc.setQueryData(key, (old: any) =>
        old
          ? { ...old, sessions: old.sessions.filter((s: any) => s.id !== sessionId) }
          : old
      );
      toast.success("Session revoked.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to revoke session")),
  });
}

export function useRevokeAllSessions(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await revokeAllUserSessionsApiV1UsersUserIdSessionsDelete({
        path: { user_id: userId },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: listUserSessionsApiV1UsersUserIdSessionsGetOptions({ path: { user_id: userId } }).queryKey,
      });
      toast.success("All sessions revoked.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to revoke sessions")),
  });
}


export function useRevokeAnySession() {
  return useMutation({
    mutationFn: async ({ sessionId, userId }: { sessionId: string; userId: string }) => {
      const res = await revokeUserSessionApiV1UsersUserIdSessionsSessionIdDelete({
        path: { user_id: userId, session_id: sessionId },
      });
      if (res.error) throw res.error;
    },
    onSuccess: () => toast.success("Session revoked."),
    onError: (err: any) => toast.error(extractError(err, "Failed to revoke session")),
  });
}


// Preferences
export function useUserPreferences(userId: string) {
  const { status } = useSession();
  return useQuery({
    ...getUserPreferencesApiV1UsersUserIdPreferencesGetOptions({ path: { user_id: userId } }),
    enabled: status === "authenticated" && Boolean(userId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateUserPreferences(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      notify_appointment?: boolean | null;
      notify_waiting?: boolean | null;
      notify_lab_results?: boolean | null;
      notify_draft_reminder?: boolean | null;
      notify_daily_summary?: boolean | null;
      require_otp?: boolean | null;
    }) => {
      const res = await updateUserPreferencesApiV1UsersUserIdPreferencesPut({
        path: { user_id: userId },
        body: payload,
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (data) => {
      qc.setQueryData(
        getUserPreferencesApiV1UsersUserIdPreferencesGetOptions({ path: { user_id: userId } }).queryKey,
        data
      );
      toast.success("Preferences saved.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to save preferences")),
  });
}