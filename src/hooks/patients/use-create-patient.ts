"use client";

import { toast } from "sonner";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createPatientApiV1PatientsPost,
} from "@/lib/api";

import {
  patientQueryOptions,
} from "./use-patients";

import type {
  PatientCreateInputs,
} from "@/lib/schemas/patient";

export function useCreatePatient() {
  const qc = useQueryClient();

  const query =
    patientQueryOptions();

  return useMutation({
    mutationFn: async (
      data: PatientCreateInputs,
    ) => {
      try {
        
        const res =
          await createPatientApiV1PatientsPost({
            body: data,
          });

        if (res.error) {
          throw res.error;
        }

        return res.data;
      } catch (err: any) {
        // Actual backend response exists
        if (
          err?.body ||
          err?.detail ||
          err?.message
        ) {
          throw err;
        }

        // Real network issue
        throw new Error(
          "Unable to reach server",
        );
      }
    },

    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey:
          query.queryKey,
      });

      toast.success(
        "Patient created",
      );
    },

    onError: (err: any) => {
      const message =
        err?.body?.detail ??
        err?.detail ??
        err?.message ??
        "Failed to create patient";

      toast.error(message);

      // console.error(
      //   "Create patient failed:",
      //   err,
      // );
    },
  });
}