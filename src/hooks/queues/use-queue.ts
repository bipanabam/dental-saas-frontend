"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import {
  listTodaysQueueApiV1QueueTodayGetOptions
} from "@/lib/api/@tanstack/react-query.gen";

export function useTodaysQueue(params?: {
  skip?: number;
  limit?: number;
}) {  
  const { status: authStatus } = useSession();

  return useQuery({
    ...listTodaysQueueApiV1QueueTodayGetOptions({
      query: {
        skip: params?.skip,
        limit: params?.limit,
      },
    }),

    enabled: authStatus === "authenticated",
    retry: false,
  });
}
