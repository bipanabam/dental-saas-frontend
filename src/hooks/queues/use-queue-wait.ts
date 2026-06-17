"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import {
  getEstimatedWaitApiV1QueueQueueIdEstimatedWaitGetOptions,
} from "@/lib/api/@tanstack/react-query.gen";

export function useQueueWait(
  queueId?: string,
  options?: {
    enabled?: boolean;
  },
) {
  const { status } =
    useSession();

  return useQuery({
    ...getEstimatedWaitApiV1QueueQueueIdEstimatedWaitGetOptions({
      path: {
        queue_id: queueId!,
      },
    }),

    enabled:
      status === "authenticated" &&
      !!queueId &&
      (options?.enabled ?? true),

    staleTime: 30000,

    refetchInterval: 30000,
  });
}