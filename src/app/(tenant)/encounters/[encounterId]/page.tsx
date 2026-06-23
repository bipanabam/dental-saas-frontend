"use client";

import { useParams } from "next/navigation";

import { useEncounterByEncounterId } from "@/hooks/encounter/use-encounter";
import { SectionLoader } from "@/components/base/loading-view";

import EncounterHeader from "@/components/encounter/detail/encounter-header";
import EncounterTimeline from "@/components/encounter/detail/encounter-timeline";
import ClinicalRecord from "@/components/encounter/detail/clinical-record";
import SideSummary from "@/components/encounter/detail/side-summary";

export default function EncountersDetailPage() {
    const params = useParams();
    const encounterId = Array.isArray(params?.encounterId)
        ? params.encounterId[0]
        : params?.encounterId ?? "";

    const {
        data: encounter,
        isLoading,
        error,
    } = useEncounterByEncounterId(encounterId);

    if (isLoading) {
        return <SectionLoader message="" />;
    }

    if (error || !encounter) {
        return (
            <div className="p-6 text-center border rounded-xl bg-slate-50 text-slate-500 text-sm">
                Encounter data not found or failed to load.
            </div>
        );
    }

    const handlePrint = () => window.print();
    const handleExportPdf = () => {
        // TODO: wire to a real export endpoint once available
        window.print();
    };
    const handleReopen = () => {
        // TODO: wire to a reopen-encounter mutation once exposed by the API
    };

    return (
        <div className="space-y-6">
            <EncounterHeader encounter={encounter} />

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
                <main className="space-y-6">
                    <EncounterTimeline encounter={encounter} />
                    <ClinicalRecord encounter={encounter} />
                </main>

                <aside>
                    <SideSummary
                        encounter={encounter}
                        onPrint={handlePrint}
                        onExportPdf={handleExportPdf}
                        onReopen={handleReopen}
                    />
                </aside>
            </div>
        </div>
    );
}