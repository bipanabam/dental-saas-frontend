"use client";

import { useMemo, useState } from "react";
import { ListOrdered, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useTodaysQueue, useDoctorQueue } from "@/hooks/queues/use-queue";
import { normalizeTodaysItem, normalizeDoctorItem } from "@/lib/queue/normalize-queue";


import DoctorFilter from "@/components/shared/DoctorFilter";
import QueueOverview from "@/components/queue/QueueOverview";
import QueueBoard from "@/components/queue/QueueBoard";
import QueueSidebar from "@/components/queue/QueueSidebar";

const QueuePage = () => {
    const [doctorId, setDoctorId] = useState<string | undefined>(undefined);

    const allQuery = useTodaysQueue({ limit: 50 });
    const doctorQuery = useDoctorQueue(doctorId!);

    const activeQuery = doctorId ? doctorQuery : allQuery;
    const isLoading = activeQuery.isLoading;
    const isFetching = activeQuery.isFetching;

    const queue = useMemo(() => {
        if (doctorId) {
            return (doctorQuery.data?.items ?? []).map(normalizeDoctorItem);
        }
        return (allQuery.data?.items ?? []).map(normalizeTodaysItem);
    }, [doctorId, allQuery.data, doctorQuery.data]);

    const stats = useMemo(() => ({
        total: activeQuery.data?.total ?? 0,
        waiting: queue.filter((q) => q.status === "WAITING").length,
        serving: queue.filter((q) => q.status === "IN_PROGRESS").length,
        completed: queue.filter((q) => q.status === "COMPLETED").length,
    }), [queue, activeQuery.data]);

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto p-1">
            {/* Dynamic Header Deck Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <ListOrdered className="h-6 w-6 text-brand-700 stroke-[2.5]" />
                        Queue Workspace
                    </h1>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">
                        Live patient triage timeline management
                    </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                    <DoctorFilter value={doctorId} onChange={setDoctorId} />
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => activeQuery.refetch()}
                        disabled={isLoading || isFetching}
                        className="h-10 w-10 rounded-xl border-slate-200 shadow-2xs hover:bg-slate-50 relative"
                    >
                        <RefreshCw className={`h-4 w-4 text-slate-500 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

            <QueueOverview stats={stats} isLoading={isLoading} onRefresh={() => activeQuery.refetch()} />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* Dynamic Workflow Column Boards Grid (8 Columns) */}
                <div className="xl:col-span-8">
                    <QueueBoard queue={queue} isLoading={isLoading} />
                </div>

                {/* Realtime Analytical Focus Rail (4 Columns) */}
                <div className="xl:col-span-4">
                    <QueueSidebar queue={queue} />
                </div>
            </div>
        </div>
    );
};

export default QueuePage;