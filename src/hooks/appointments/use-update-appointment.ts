"use client";

import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAppointmentApiV1AppointmentsAppointmentIdPut } from "@/lib/api";
import type { AppointmentInputs } from "@/lib/schemas/appointment";

type UpdateAppointmentVariables = {
  appointmentId: string;
  payload: AppointmentInputs;
};

export function useUpdateAppointment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ appointmentId, payload }: UpdateAppointmentVariables) => {
      try {
        const res = await updateAppointmentApiV1AppointmentsAppointmentIdPut({
          path: { appointment_id: appointmentId },
          body: payload,
        });

        if (res.error) throw res.error;
        return res.data;
      } catch (err: any) {
        if (err?.body || err?.detail || err?.message) throw err;
        throw new Error("Unable to reach server");
      }
    },

    onSuccess: async (_data, { appointmentId }) => {
      // Invalidate both the list and the specific detail query
      await qc.invalidateQueries({ queryKey: ["appointments"] });
      await qc.invalidateQueries({ queryKey: ["appointment", appointmentId] });
      toast.success("Appointment updated successfully.");
    },

    onError: (err: any) => {
      const message =
        err?.body?.detail ?? err?.detail ?? err?.message ?? "Failed to update appointment";
      toast.error(message);
    },
  });
}