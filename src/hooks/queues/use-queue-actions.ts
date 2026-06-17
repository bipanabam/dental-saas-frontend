"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  callForNextPatientApiV1QueueQueueIdCallPostMutation,
  skipTheTokenApiV1QueueQueueIdSkipPostMutation,
  recallSkippedTokenApiV1QueueQueueIdRecallPostMutation,
} from "@/lib/api/@tanstack/react-query.gen";

import { toast } from "sonner";

import { getApiError } from "@/lib/utils/get-api-error";

export function useQueueActions() {
  const qc = useQueryClient();

  const refresh = () =>
    Promise.all([
      qc.invalidateQueries({
        queryKey: ["listTodaysQueue"],
      }),

      qc.invalidateQueries({
        queryKey: ["getQueueForDoctor"],
      }),
    ]);

  const call = useMutation({
    ...callForNextPatientApiV1QueueQueueIdCallPostMutation(),

    onSuccess: (res) => {
      toast.success(res.message || "Patient called");

      refresh();
    },

    onError: (e) => toast.error(getApiError(e)),
  });

  const skip = useMutation({
    ...skipTheTokenApiV1QueueQueueIdSkipPostMutation(),

    onSuccess: (res) => {
      toast.success(res.message);

      refresh();
    },

    onError: (e) => toast.error(getApiError(e)),
  });

  const recall = useMutation({
    ...recallSkippedTokenApiV1QueueQueueIdRecallPostMutation(),

    onSuccess: (res) => {
      toast.success(res.message);

      refresh();
    },

    onError: (e) => toast.error(getApiError(e)),
  });

  return {
    callQueue: call.mutate,

    skipQueue: skip.mutate,

    recallQueue: recall.mutate,

    loading: call.isPending || skip.isPending || recall.isPending,
  };
}
