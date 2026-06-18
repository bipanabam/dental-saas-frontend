import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { 
    listPatientMedicalHistoryApiV1PatientsPatientIdMedicalHistoryGetOptions,
    listPatientAppointmentsApiV1PatientsPatientIdAppointmentsGetOptions,
    listPatientEncountersApiV1PatientsPatientIdEncountersGetOptions,
    listPatientTreatmentPlansApiV1PatientsPatientIdTreatmentPlansGetOptions,
    listPatientProceduresApiV1PatientsPatientIdProceduresGetOptions,
} from "@/lib/api/@tanstack/react-query.gen";

import {
  AppointmentStatusEnum,
  AppointmentTypeEnum,
  AppointmentSourceEnum,
} from "@/lib/api";

export function usePatientAppointments(id: string, params?: {
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
    ...listPatientAppointmentsApiV1PatientsPatientIdAppointmentsGetOptions({
      path: { patient_id: id },
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
    enabled:
        authStatus === "authenticated" &&
        !!id &&
        (options?.enabled ?? true),

    retry: false,
  });
}

export function usePaginatedPatientQuery<T>(
  queryOptions: any,
  patientId: string
) {
  const { status } = useSession();

  return useQuery({
    ...queryOptions({
      path: { patient_id: patientId },
    }),
    enabled: status === "authenticated" && !!patientId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function usePatientMedicalHistory(id: string) {
  const { status } = useSession();

  return useQuery({
    ...listPatientMedicalHistoryApiV1PatientsPatientIdMedicalHistoryGetOptions({
      path: { patient_id: id },
    }),
    enabled: status === "authenticated" && !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function usePatientEncounters(id: string) {
  const { status } = useSession();

  return useQuery({
    ...listPatientEncountersApiV1PatientsPatientIdEncountersGetOptions({
      path: { patient_id: id },
    }),
    enabled: status === "authenticated" && !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function usePatientTreatmentPlans(id: string) {
  const { status } = useSession();

  return useQuery({
    ...listPatientTreatmentPlansApiV1PatientsPatientIdTreatmentPlansGetOptions({
      path: { patient_id: id },
    }),
    enabled: status === "authenticated" && !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function usePatientProcedures(id: string) {
  const { status } = useSession();

  return useQuery({
    ...listPatientProceduresApiV1PatientsPatientIdProceduresGetOptions({
      path: { patient_id: id },
    }),
    enabled: status === "authenticated" && !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}