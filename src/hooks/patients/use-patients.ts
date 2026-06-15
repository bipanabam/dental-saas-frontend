"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import { listPatientsApiV1PatientsGetOptions } from "@/lib/api/@tanstack/react-query.gen";

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
