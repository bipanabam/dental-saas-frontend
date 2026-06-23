"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { FullPageLoader } from "@/components/base/loading-view";
import { useEncounterByAppointmentId } from "@/hooks/encounter/use-encounter";

import EncounterHeader from "@/components/encounter/EncounterHeader";
import EncounterStageSidebar from "@/components/encounter/EncounterStageSidebar";
import EncounterSummary from "@/components/encounter/EncounterSummary";
import EncounterWorkspace from "@/components/encounter/EncounterWorkspace";

import { ENCOUNTER_STAGES, type EncounterStage } from "@/lib/utils/encounter-stages";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EncounterPage() {
    const params = useParams();
    const appointmentId = Array.isArray(params?.appointmentId)
        ? params.appointmentId[0]
        : params?.appointmentId ?? "";

    const {
        data: encounter,
        isLoading,
        error,
    } = useEncounterByAppointmentId(appointmentId);

    const [stage, setStage] = useState<EncounterStage>("intake");

    if (isLoading) {
        return <FullPageLoader />;
    }

    if (error || !encounter) {
        return (
            <div className="p-6 text-center border rounded-xl bg-slate-50 text-slate-500 text-sm">
                Encounter data not found or failed to load.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <EncounterHeader encounter={encounter} />

            {/* Mobile / Tablet Stage Quick Switcher Tool */}
            <div className="block lg:hidden bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">
                    Current Workflow Stage
                </label>
                <Select value={stage} onValueChange={(val) => setStage(val as EncounterStage)}>
                    <SelectTrigger className="w-full h-9 text-xs font-medium">
                        <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                        {ENCOUNTER_STAGES.map((s) => (
                            <SelectItem key={s.id} value={s.id} className="text-xs">
                                {s.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Desktop Grid layout */}
            <div className="grid lg:grid-cols-[260px_minmax(0,1fr)] gap-6 items-start">
                <aside className="sticky top-6 hidden lg:flex flex-col gap-4 max-h-auto overflow-y-auto pr-1">
                    <EncounterStageSidebar
                        encounter={encounter}
                        stage={stage}
                        onStageChange={setStage}
                    />

                    <EncounterSummary
                        encounter={encounter}
                    />
                </aside>

                {/* Primary Central Form Workspace */}
                <div className="space-y-6 min-w-0">
                    <EncounterWorkspace
                        encounter={encounter}
                        stage={stage}
                        appointmentId={appointmentId}
                    />
                </div>

            </div>
        </div>
    );
}