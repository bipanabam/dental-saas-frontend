"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import {
  getEncounterByAppointmentApiV1EncountersByAppointmentAppointmentIdGetOptions
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