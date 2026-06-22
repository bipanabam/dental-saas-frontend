"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { FullPageLoader } from "@/components/base/loading-view";
import { useEncounterByAppointmentId } from "@/hooks/encounter/use-encounter";

import EncounterHeader from "@/components/encounter/EncounterHeader";
import EncounterStageSidebar from "@/components/encounter/EncounterStageSidebar";
import EncounterSummary from "@/components/encounter/EncounterSummary";
import EncounterWorkspace from "@/components/encounter/EncounterWorkspace";

import type { EncounterStage } from "@/lib/utils/encounter-stages";


const EncounterPage = () => {
    const { appointmentId } = useParams();
    const {
        data: encounter,
        isLoading,
        error,
    } = useEncounterByAppointmentId(appointmentId as string);

    const [stage, setStage] = useState<EncounterStage>("intake");

    if (isLoading) {
        return <FullPageLoader />; 
    }

    if (!encounter) {
        return <div>Encounter data not found</div>;
    }

    return (
        <div className="space-y-6">
            <EncounterHeader encounter={encounter} />
            <div className="grid lg:grid-cols-[260px_minmax(0,1fr)] gap-6">

                <aside className="sticky top-6 self-start">
                    <EncounterStageSidebar
                        encounter={encounter}
                        stage={stage}
                        onStageChange={setStage}
                    />
                </aside>

                <div className="space-y-6 min-w-0">

                    <EncounterWorkspace
                        encounter={encounter}
                        stage={stage}
                        appointmentId={appointmentId as string}
                    />

                    <EncounterSummary
                        encounter={encounter}
                    />

                </div>

            </div>
            {/* <div className="rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-sm text-slate-400 min-h-96">
                Workspace for "{stage}" stage coming next...
            </div> */}
        </div>
    );
};

export default EncounterPage;