"use client";

import { toast } from "sonner";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deletePatientApiV1PatientsPatientIdDelete,
} from "@/lib/api";

import { patientQueryOptions } from "./use-patients";

export function useDeactivatePatient() {
  const qc = useQueryClient();
  const query = patientQueryOptions();

  return useMutation({
    mutationFn: async (patient_id: string) => {
      return deletePatientApiV1PatientsPatientIdDelete({
        path: {
          patient_id,
        },
      });
    },

    onSuccess: async (_, patient_id) => {
      await Promise.all([
        qc.invalidateQueries({
          queryKey: query.queryKey,
        }),

        qc.removeQueries({
          queryKey: ["patient", patient_id],
        }),
      ]);

      toast.success("Patient deleted");
    },

    onError: (err: any) => {
      toast.error(
        err?.body?.detail ??
          "Failed to delete patient"
      );
    },
  });
}