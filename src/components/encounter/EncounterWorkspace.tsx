"use client";

import IntakeSection from "./sections/IntakeSection";
import MedicalHistorySection from "./sections/MedicalHistorySection";
import ExaminationSection from "./sections/ExaminationSection";
import FindingsSection from "./sections/FindingsSection";
import DiagnosisSection from "./sections/DiagnosisSection";
import InvestigationSection from "./sections/InvestigationSection";
import TreatmentPlanSection from "./sections/TreatmentPlanSection";

import type { EncounterDetail } from "@/lib/api";
import type { EncounterStage } from "@/lib/utils/encounter-stages";

type Props = {
    encounter: EncounterDetail;
    stage: EncounterStage;
    appointmentId: string;
};

export default function EncounterWorkspace({ encounter, stage, appointmentId }: Props) {
    switch (stage) {
        case "intake":
            return <IntakeSection encounter={encounter} appointmentId={appointmentId} />;
        case "history":
            return <MedicalHistorySection encounter={encounter} appointmentId={appointmentId} />;
        case "exam":
            return <ExaminationSection encounter={encounter} appointmentId={appointmentId} />;
        case "findings":
            return <FindingsSection encounter={encounter} appointmentId={appointmentId} />;
        case "diagnosis":
            return <DiagnosisSection encounter={encounter} appointmentId={appointmentId} />;
        case "investigation":
            return <InvestigationSection encounter={encounter} appointmentId={appointmentId} />;
        case "treatment":
            return <TreatmentPlanSection encounter={encounter} appointmentId={appointmentId} />;
        // Remaining stages come next — placeholder keeps the grid from collapsing
        // default:
        //     return (
        //         <div className="rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-sm text-slate-400 min-h-96">
        //             {stage.charAt(0).toUpperCase() + stage.slice(1)} section coming next
        //         </div>
        //     );
    }
}