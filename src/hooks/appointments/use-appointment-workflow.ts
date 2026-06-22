"use client";

import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  confirmAppointmentApiV1AppointmentsAppointmentIdConfirmPost,
  checkInAppointmentApiV1AppointmentsAppointmentIdCheckInPost,
  startAppointmentApiV1AppointmentsAppointmentIdStartPost,
  completeAppointmentApiV1AppointmentsAppointmentIdCompletePost,
  markNoShowApiV1AppointmentsAppointmentIdNoShowPost,
  rescheduleAppointmentApiV1AppointmentsAppointmentIdReschedulePost,
  createFollowUpApiV1AppointmentsAppointmentIdFollowUpPost,
} from "@/lib/api";

import type {
  AppointmentReschedule,
  AppointmentFollowUpCreate,
} from "@/lib/api";

import { appointmentQueryOptions } from "./use-appointments";

// Shared error normalizer — matches your useCreateAppointment pattern
function extractError(err: any, fallback: string) {
  return err?.body?.detail ?? err?.detail ?? err?.message ?? fallback;
}

// Invalidate everything that could show this appointment's state
function useInvalidateAppointments() {
  const qc = useQueryClient();
   const query =
      appointmentQueryOptions();
  return (appointmentId?: string) => {
    qc.invalidateQueries({ queryKey: query.queryKey });
    if (appointmentId) {
      qc.invalidateQueries({
        queryKey: ["getAppointmentDetailApiV1AppointmentsAppointmentIdGet", { path: { appointment_id: appointmentId } }],
      });
    }
  };
}

export function useConfirmAppointment() {
  const invalidate = useInvalidateAppointments();
  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const res = await confirmAppointmentApiV1AppointmentsAppointmentIdConfirmPost({
        path: { appointment_id: appointmentId },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (_data, appointmentId) => {
      invalidate(appointmentId);
      toast.success("Appointment confirmed.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to confirm appointment")),
  });
}

export function useCheckInAppointment() {
  const invalidate = useInvalidateAppointments();
  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const res = await checkInAppointmentApiV1AppointmentsAppointmentIdCheckInPost({
        path: { appointment_id: appointmentId },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (data, appointmentId) => {
      invalidate(appointmentId);
      toast.success(`Checked in — token #${data?.token_number}`);
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to check in")),
  });
}

export function useStartAppointment() {
  const invalidate = useInvalidateAppointments();
  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const res = await startAppointmentApiV1AppointmentsAppointmentIdStartPost({
        path: { appointment_id: appointmentId },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (_data, appointmentId) => {
      invalidate(appointmentId);
      toast.success("Encounter started.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to start appointment")),
  });
}

export function useCompleteAppointment() {
  const invalidate = useInvalidateAppointments();
  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const res = await completeAppointmentApiV1AppointmentsAppointmentIdCompletePost({
        path: { appointment_id: appointmentId },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (_data, appointmentId) => {
      invalidate(appointmentId);
      toast.success("Visit completed.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to complete appointment")),
  });
}

export function useMarkNoShow() {
  const invalidate = useInvalidateAppointments();
  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const res = await markNoShowApiV1AppointmentsAppointmentIdNoShowPost({
        path: { appointment_id: appointmentId },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (_data, appointmentId) => {
      invalidate(appointmentId);
      toast.success("Marked as no-show.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to mark no-show")),
  });
}

export function useRescheduleAppointment() {
  const invalidate = useInvalidateAppointments();
  return useMutation({
    mutationFn: async ({
      appointmentId,
      payload,
    }: {
      appointmentId: string;
      payload: AppointmentReschedule;
    }) => {
      const res = await rescheduleAppointmentApiV1AppointmentsAppointmentIdReschedulePost({
        path: { appointment_id: appointmentId },
        body: payload,
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (_data, vars) => {
      invalidate(vars.appointmentId);
      toast.success("Appointment rescheduled.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to reschedule")),
  });
}

export function useCreateFollowUp() {
  const invalidate = useInvalidateAppointments();
  return useMutation({
    mutationFn: async ({
      appointmentId,
      payload,
    }: {
      appointmentId: string;
      payload: AppointmentFollowUpCreate;
    }) => {
      const res = await createFollowUpApiV1AppointmentsAppointmentIdFollowUpPost({
        path: { appointment_id: appointmentId },
        body: payload,
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Follow-up created.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to create follow-up")),
  });
}