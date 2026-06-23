"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import type { EncounterStatusEnum } from "@/lib/api";

import {
  getEncounterByAppointmentApiV1EncountersByAppointmentAppointmentIdGetOptions,
  listEncountersApiV1EncountersGetOptions,
} from "@/lib/api/@tanstack/react-query.gen";


export function useEncounterByAppointmentId(
  appointmentId?: string,
) {
  const { status } = useSession();

  return useQuery({
      ...getEncounterByAppointmentApiV1EncountersByAppointmentAppointmentIdGetOptions({
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

interface QueryParams {
  skip?: number;
  limit?: number;

  doctor_id?: string;
  patient_id?: string;
  today?: boolean;

  status?: EncounterStatusEnum;
}


export function useListEncounters(params?: QueryParams, options?: { enabled?: boolean }) {  
  const { status: authStatus } = useSession();

  return useQuery({
    ...listEncountersApiV1EncountersGetOptions({
      query: {
        skip: params?.skip,
        limit: params?.limit,

        doctor_id: params?.doctor_id,
        patient_id: params?.patient_id,
        today: params?.today,
        
        status: params?.status,
      }
    }),

    enabled: authStatus === "authenticated" && (options?.enabled ?? true),
    retry: false,
  });
}