"use client";

import { useState } from "react";

import PageHeader from "@/components/shared/page/PageHeader";

import { SectionLoader } from "@/components/base/loading-view";

import { useListEncounters } from "@/hooks/encounter/use-encounter";

import ActiveEncounterStrip from "./ActiveEncounterStrip";
import EncounterHistoryTable from "./EncounterHistoryTable";

import type {
    EncounterStatusEnum,
} from "@/lib/api";

export default function EncountersOverview() {
    const [filters, setFilters] = useState<{
        status?: EncounterStatusEnum;
        doctor_id?: string;
        patient_id?: string;
        today?: boolean;
    }>({});

    /**
     * Active encounters
     * independent from table filters
     */
    const {
        data: activeData,
        isLoading: activeLoading,
    } = useListEncounters({
        status: "IN_PROGRESS",
    });

    /**
     * History query
     * only this reloads
     */
    const {
        data: historyData,
        isLoading: historyLoading,
        isFetching,
    } = useListEncounters({
        ...filters,
        // status:
        //     filters.status === "IN_PROGRESS"
        //         ? undefined
        //         : filters.status,
    });

    if (activeLoading && !activeData) {
        return <SectionLoader />;
    }

    return (
        <div className="space-y-6">

            <PageHeader
                title="Encounters"
                description="Resume active work and review encounter history"
            />

            {/* NEVER disappears */}
            <ActiveEncounterStrip
                encounters={activeData?.items ?? []}
            />

            {/* ONLY this updates */}
            <EncounterHistoryTable
                encounters={historyData?.items}
                total={historyData?.total}
                activeCount={activeData?.active_count}
                isLoading={historyLoading}
                isFetching={isFetching}
                filters={filters}
                onFiltersChange={setFilters}
            />

        </div>
    );
}