import { fmtMoney } from "./utils";
import type { EncounterDetail } from "@/lib/api";

function StripItem({ label, value, isMono = false }: { label: string; value: React.ReactNode; isMono?: boolean }) {
    return (
        <div className="space-y-0.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {label}
            </p>
            <p className={`text-xs font-bold text-slate-700 truncate ${isMono ? "font-mono" : ""}`}>
                {value}
            </p>
        </div>
    );
}

export default function ClinicalSummaryStrip({ encounter }: { encounter: EncounterDetail }) {
    const diagnoses = encounter.diagnoses ?? [];
    const primaryDiagnosis = diagnoses.find((d) => d.is_primary) ?? diagnoses[0];
    // PROCEDURES
    const procedures = encounter.procedures ?? [];
    const totalProcedures = procedures.length;

    const completedProcedures =
        procedures.filter(
            (p) =>
                p.status === "COMPLETED"
        ).length;
        
    const completedProcedureCost =
        procedures.reduce(
            (sum, p) =>
                p.status === "COMPLETED"
                    ? sum + (p.final_cost ?? 0)
                    : sum,
            0
        );
    const totalProcedureCost =
        procedures.reduce(
            (sum, p) =>
                sum + (p.final_cost ?? 0),
            0
        );

    return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-4">
            <StripItem label="Chief Complaint" value={encounter.chief_complaint ?? "—"} />
            <StripItem label="Primary Diagnosis" value={primaryDiagnosis?.diagnosis_name ?? "—"} />
            <StripItem label="Procedures" value={`${completedProcedures}/${totalProcedures}`} />
            <StripItem label="Est. Accum. Cost" value={`${fmtMoney(completedProcedureCost)} / ${fmtMoney(totalProcedureCost)}`} isMono />
        </div>
    );
}