"use client";

import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import {
  getMyTenantApiV1TenantMeGet,
  updateMyTenantApiV1TenantMePut,
  getMyTenantSettingsApiV1TenantMeSettingsGet,
  updateMyTenantSettingsApiV1TenantMeSettingsPut,
} from "@/lib/api";

import {
  getMyTenantApiV1TenantMeGetOptions,
  getMyTenantSettingsApiV1TenantMeSettingsGetOptions,
} from "@/lib/api/@tanstack/react-query.gen";

function extractError(err: any, fallback: string) {
  return err?.body?.detail ?? err?.detail ?? err?.message ?? fallback;
}

export function useTenantIdentity() {
  const { status } = useSession();
  return useQuery({
    ...getMyTenantApiV1TenantMeGetOptions(),
    enabled: status === "authenticated",
    staleTime: 5 * 60 * 1000,
  });
}

export function useTenantSettings() {
  const { status } = useSession();
  return useQuery({
    ...getMyTenantSettingsApiV1TenantMeSettingsGetOptions(),
    enabled: status === "authenticated",
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateTenantIdentity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      name?: string | null;
      legal_name?: string | null;
      registration_number?: string | null;
      tax_number?: string | null;
      billing_email?: string | null;
      country_code?: string | null;
      currency?: string | null;
      timezone?: string | null;
      language?: string | null;
      logo_url?: string | null;
    }) => {
      const res = await updateMyTenantApiV1TenantMePut({ body: payload });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (data) => {
      qc.setQueryData(
        getMyTenantApiV1TenantMeGetOptions().queryKey,
        data
      );
      toast.success("Clinic profile updated.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to update clinic profile")),
  });
}

export function useUpdateTenantSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      appointment_duration_minutes?: number | null;
      enable_waitlist?: boolean | null;
      enable_sms?: boolean | null;
      enable_lab?: boolean | null;
      patient_code_prefix?: string | null;
      encounter_number_prefix?: string | null;
    }) => {
      const res = await updateMyTenantSettingsApiV1TenantMeSettingsPut({ body: payload });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (data) => {
      qc.setQueryData(
        getMyTenantSettingsApiV1TenantMeSettingsGetOptions().queryKey,
        data
      );
      toast.success("Clinic settings saved.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to save settings")),
  });
}