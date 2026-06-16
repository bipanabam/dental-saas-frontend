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

  status?: AppointmentStatusEnum;
  appointment_type?: AppointmentTypeEnum;
  source?: AppointmentSourceEnum;
}) {
  const { status: authStatus } = useSession();

  return useQuery({
    ...listAppointmentsApiV1AppointmentsGetOptions({
      query: {
        skip: params?.skip,
        limit: params?.limit,

        doctor_id: params?.doctor_id,

        status: params?.status,

        appointment_type: params?.appointment_type,

        source: params?.source,
      },
    }),

    enabled: authStatus === "authenticated",

    retry: false,
  });
}

export function useTodaysAppointments(params?: {
  skip?: number;
  limit?: number;
}) {
  const { status } = useSession();

  return useQuery({
    ...listTodaysAppointmentsApiV1AppointmentsTodayGetOptions({
      query: {
        skip: params?.skip,
        limit: params?.limit,
      },
    }),

    enabled: status === "authenticated",

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