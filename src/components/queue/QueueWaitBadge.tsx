"use client";

import { useQueueWait } from "@/hooks/queues/use-queue-wait";

interface Props {
    queueId: string;
    fallback?: number | null;
}

const QueueWaitBadge = ({ queueId, fallback }: Props) => {
    const { data, isLoading } = useQueueWait(queueId);
    const wait = data?.estimated_wait_mins ?? fallback;

    return (
        <div className="flex flex-col items-end justify-center min-h-9">
            {isLoading ? (
                <div className="h-5 w-12 bg-slate-100 rounded animate-pulse border border-slate-200/50" />
            ) : (
                <span className="text-[11px] font-mono font-black px-1.5 py-0.5 rounded border bg-amber-50 text-amber-700 border-amber-100 shadow-3xs shrink-0">
                    {wait != null ? `${wait}m` : "—"}
                </span>
            )}

            {!isLoading && data && (
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1 whitespace-nowrap">
                    {data.patients_ahead} {data.patients_ahead === 1 ? "patient" : "patients"} ahead
                </span>
            )}
        </div>
    );
};

export default QueueWaitBadge;