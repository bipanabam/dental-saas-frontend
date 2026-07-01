"use client";

import { useState } from "react";

import PageHeader from "@/components/shared/page/PageHeader";
import { SectionLoader } from "@/components/base/loading-view";

import {
    useMyActiveEncounters,
    useMyEncounterHistory,
} from "@/hooks/encounter/use-doctor-encounters";

import ActiveEncounterStrip from "@/components/encounter/list/ActiveEncounterStrip";
import EncounterHistoryTable from "@/components/encounter/list/EncounterHistoryTable";
import ClinicalInboxPanel from "./ClinicalInboxPanel";
import MyQueuePanel from "./MyQueuePanel";

import type { EncounterStatusEnum } from "@/lib/api";

export default function DoctorEncountersOverview() {
    const [filters, setFilters] = useState<{
        status?: EncounterStatusEnum;
        patient_id?: string;
        today?: boolean;
    }>({ today: true });

    const { data: activeData, isLoading: activeLoading } = useMyActiveEncounters();
    const { data: historyData, isLoading: historyLoading, isFetching } = useMyEncounterHistory(filters);

    if (activeLoading && !activeData) {
        return <SectionLoader />;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="My Encounters"
                description="Resume active work and review your patient visits"
            />

            <div className="grid gap-6 xl:grid-cols-4 items-start">
                <div className="xl:col-span-3">
                    <ActiveEncounterStrip
                        encounters={activeData?.items ?? []}
                        compact
                    />
                </div>

                {/* Rail: situational awareness panels, stacked */}
                <div className="xl:col-span-1 space-y-4">
                    <MyQueuePanel />
                    <ClinicalInboxPanel />
                </div>
            </div>

            <EncounterHistoryTable
                encounters={historyData?.items}
                total={historyData?.total}
                activeCount={activeData?.active_count}
                isLoading={historyLoading}
                isFetching={isFetching}
                filters={filters}
                onFiltersChange={setFilters}
                showDoctorFilter={false}
            />
        </div>
    );
}