"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
    callForNextPatientApiV1QueueQueueIdCallPostMutation,
    skipTheTokenApiV1QueueQueueIdSkipPostMutation,
    recallSkippedTokenApiV1QueueQueueIdRecallPostMutation,
    listTodaysQueueApiV1QueueTodayGetOptions,
    getQueueForDoctorApiV1QueueDoctorsDoctorIdTodayGetOptions,
} from "@/lib/api/@tanstack/react-query.gen";

import { getApiError } from "@/lib/utils/get-api-error";


export function useQueueActions() {
    const qc = useQueryClient();

    const refresh = () =>
        Promise.all([
            qc.invalidateQueries({
                queryKey: listTodaysQueueApiV1QueueTodayGetOptions().queryKey,
            }),
            qc.invalidateQueries({
                queryKey: getQueueForDoctorApiV1QueueDoctorsDoctorIdTodayGetOptions(
                    { path: { doctor_id: "" } } // invalidates all doctor queue queries
                ).queryKey.slice(0, 1), // match on the operation key only
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
        callQueue: call.mutateAsync,   // mutateAsync so callers can await + catch
        skipQueue: skip.mutate,
        recallQueue: recall.mutate,
        loading: call.isPending || skip.isPending || recall.isPending,
    };
}