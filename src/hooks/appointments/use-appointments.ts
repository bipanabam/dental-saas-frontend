"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import {
  listAppointmentsApiV1AppointmentsGetOptions,
  listTodaysAppointmentsApiV1AppointmentsTodayGetOptions,
  getAppointmentDetailApiV1AppointmentsAppointmentIdGetOptions,
} from "@/lib/api/@tanstack/react-query.gen";

import {
  AppointmentStatusEnum,
  AppointmentTypeEnum,
  AppointmentSourceEnum,
} from "@/lib/api";

export function useAppointments(params?: {
  skip?: number;
  limit?: number;

  doctor_id?: string;

  date_range?: string;

  date_start?: string;
  date_end?: string;

  status?: AppointmentStatusEnum;
  appointment_type?: AppointmentTypeEnum;
  source?: AppointmentSourceEnum;
}, options?: { enabled?: boolean }) {  
  const { status: authStatus } = useSession();

  return useQuery({
    ...listAppointmentsApiV1AppointmentsGetOptions({
      query: {
        skip: params?.skip,
        limit: params?.limit,

        doctor_id: params?.doctor_id,
        
        date_range: params?.date_range,

        date_start: params?.date_start,
        date_end: params?.date_end,

        status: params?.status,
        appointment_type: params?.appointment_type,
        source: params?.source,
      },
    }),

    enabled: authStatus === "authenticated" && (options?.enabled ?? true),

    retry: false,
  });
}

export function useTodaysAppointments(params?: {
  skip?: number;
  limit?: number;
}, options?: { enabled?: boolean }) {
  const { status } = useSession();

  return useQuery({
    ...listTodaysAppointmentsApiV1AppointmentsTodayGetOptions({
      query: {
        skip: params?.skip,
        limit: params?.limit,
      },
    }),

    enabled: status === "authenticated" && (options?.enabled ?? true),

    retry: false,
  });
}

export function useAppointmentDetail(
  appointmentId?: string,
) {
  const { status } = useSession();

  return useQuery({
    ...getAppointmentDetailApiV1AppointmentsAppointmentIdGetOptions({
      path: {
        appointment_id: appointmentId ?? "",
      },
    }),

    enabled:
      status === "authenticated" &&
      Boolean(appointmentId),

    retry: false,

    staleTime: 30_000,
  });
}