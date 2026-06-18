"use client";

import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { listPatientsApiV1PatientsGetOptions, 
  getPatientApiV1PatientsPatientIdGetOptions ,
  getPatientSummaryApiV1PatientsPatientIdSummaryGetOptions,
  searchPatientsApiV1PatientsSearchGetOptions,
} from "@/lib/api/@tanstack/react-query.gen";


import {
  PatientStatusEnum,
  PatientCategoryEnum,
  GenderEnum,
  BloodGroupEnum,
} from "@/lib/api";

export function usePatients(params?: {
  skip?: number;
  limit?: number;

  category?: PatientCategoryEnum;
  status?: PatientStatusEnum;

  gender?: GenderEnum;

  blood_group?: BloodGroupEnum;
}) {
  const { status } = useSession();

  return useQuery({
    ...listPatientsApiV1PatientsGetOptions({
      query: {
        skip: params?.skip,
        limit: params?.limit,

        category: params?.category,
        status: params?.status,

        gender: params?.gender,

        blood_group: params?.blood_group,
      },
    }),

    enabled: status === "authenticated",
    retry: false,
  });
}


export function usePatientDetail(
  id: string,
) {
  return useQuery({
    ...getPatientApiV1PatientsPatientIdGetOptions({
      path: {
        patient_id: id,
      },
    }),

    enabled: !!id,

  });
}

export function usePatientSummary(
  id: string,
) {
  const { status } =
    useSession();

  return useQuery({
    ...getPatientSummaryApiV1PatientsPatientIdSummaryGetOptions({
      path: {
        patient_id: id,
      },
    }),

    enabled:
      status ===
        "authenticated" &&
      !!id,

    staleTime:
      1000 * 60 * 5,

    gcTime:
      1000 * 60 * 10,
  });
}


export function useSearchPatients(
  query: string,
  enabled = true,
) {
  return useQuery({
    ...searchPatientsApiV1PatientsSearchGetOptions({
      query: {
        query: query,
      },
    }),

    enabled:
      enabled &&
      !!query &&
      query.length >= 2,

    staleTime:
      1000 *
      60 *
      2,
  });
}
