"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import {
  listTodaysQueueApiV1QueueTodayGetOptions,
  getQueueForDoctorApiV1QueueDoctorsDoctorIdTodayGetOptions,
} from "@/lib/api/@tanstack/react-query.gen";

export function useTodaysQueue(params?: {
  skip?: number;
  limit?: number;
}) {
  const { status } = useSession();

  return useQuery({
    ...listTodaysQueueApiV1QueueTodayGetOptions({
      query: {
        skip: params?.skip,
        limit: params?.limit,
      },
    }),

    enabled: status === "authenticated",
    retry: false,
  });
}

export function useDoctorQueue(
  doctorId?: string,
  params?: {
    skip?: number;
    limit?: number;
  },
  options?: {
    enabled?: boolean;
  },
) {
  const { status } = useSession();

  return useQuery({
    ...getQueueForDoctorApiV1QueueDoctorsDoctorIdTodayGetOptions({
      path: {
        doctor_id: doctorId!,
      },

      query: {
        skip: params?.skip,
        limit: params?.limit,
      },
    }),

    enabled:
      status === "authenticated" &&
      !!doctorId &&
      (options?.enabled ?? true),

    refetchInterval: 15000,
    staleTime: 5000,
  });
}