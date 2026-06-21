"use client";

import { toast } from "sonner";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createAppointmentApiV1AppointmentsPost
} from "@/lib/api";


import type {
  AppointmentInputs,
} from "@/lib/schemas/appointment";


export function useCreateAppointment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: AppointmentInputs,
    ) => {
      try {
        
        const res =
          await createAppointmentApiV1AppointmentsPost({
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
        queryKey: ["appointments"],
      });

      toast.success(
        "Appointment created successfully.",
      );
    },

    onError: (err: any) => {
      const message =
        err?.body?.detail ??
        err?.detail ??
        err?.message ??
        "Failed to create appointment";

      toast.error(message);

    //   console.error(
    //     "Create appointment failed:",
    //     err,
    //   );
    },
  });
}