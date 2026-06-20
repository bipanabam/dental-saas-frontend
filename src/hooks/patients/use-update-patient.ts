"use client";

import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updatePatientApiV1PatientsPatientIdPut } from "@/lib/api";
import { patientQueryOptions } from "./use-patients";

import type { PatientUpdate } from "@/lib/api"; // generated type

export function useUpdatePatient(patientId: string) {
  const qc = useQueryClient();
  const query = patientQueryOptions();

  return useMutation({
    mutationFn: async (data: PatientUpdate) => {
      const res = await updatePatientApiV1PatientsPatientIdPut({
        path: { patient_id: patientId },
        body: data,
      });

      if (res.error) throw res.error;

      return res.data;
    },

    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: query.queryKey });

      // also invalidate single patient query
      qc.invalidateQueries({
        queryKey: ["patient", patientId],
      });

      toast.success("Patient updated successfully");
    },

    onError: (err: any) => {
      const message =
        err?.body?.detail ??
        err?.detail ??
        err?.message ??
        "Failed to update patient";

      toast.error(message);
      console.error("Update patient failed:", err);
    },
  });
}