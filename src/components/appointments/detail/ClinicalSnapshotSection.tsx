import { useRouter } from "next/navigation";
import {
    Stethoscope, AlertCircle, FlaskConical, Layers,
    FolderOpen, Activity, HeartPulse,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import type { EncounterDetail } from "@/lib/api";

// Vitals strip
function VitalsStrip({ encounter }: { encounter: EncounterDetail }) {
    const vitals = [
        { label: "BP", value: encounter.bp_systolic && encounter.bp_diastolic ? `${encounter.bp_systolic}/${encounter.bp_diastolic}` : null, unit: "mmHg" },
        { label: "Pulse", value: encounter.pulse_rate, unit: "bpm" },
        { label: "Temp", value: encounter.temperature, unit: "°C" },
        { label: "Weight", value: encounter.weight_kg, unit: "kg" },
        { label: "SpO₂", value: encounter.spo2, unit: "%" },
    ].filter((v) => v.value != null);

    if (!vitals.length) return null;

    return (
        <div className="flex flex-wrap gap-3 py-3 border-b border-slate-50">
            {vitals.map((v) => (
                <div key={v.label} className="flex items-baseline gap-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {v.label}
                    </span>
                    <span className="text-sm font-black font-mono text-slate-700">
                        {v.value}
                    </span>
                    <span className="text-[10px] text-slate-400">{v.unit}</span>
                </div>
            ))}
        </div>
    );
}

interface SnapshotCellProps {
    icon: React.ElementType;
    label: string;
    value: string;
}

function SnapshotCell({ icon: Icon, label, value }: SnapshotCellProps) {
    return (
        <div className="flex items-start gap-2.5 py-2.5">
            <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {label}
                </p>
                <p className="text-xs font-semibold text-slate-700 mt-0.5 leading-snug">
                    {value}
                </p>
            </div>
        </div>
    );
}

// Section
interface ClinicalSnapshotSectionProps {
    encounter: EncounterDetail;
    appointmentId: string;
}

export default function ClinicalSnapshotSection({
    encounter,
    appointmentId,
}: ClinicalSnapshotSectionProps) {
    const router = useRouter();

    const primaryDiagnosis = encounter.diagnoses?.find((d) => d.is_primary);
    const pendingInvestigations = encounter.investigations?.filter(
        (i) => i.status === "PENDING" || i.status === "ORDERED"
    ) ?? [];
    const pendingTreatmentItems = encounter.treatment_plan?.items?.filter(
        (i) => i.status === "PENDING"
    ) ?? [];

    const cells = [
        encounter.chief_complaint && {
            icon: Stethoscope,
            label: "Chief Complaint",
            value: encounter.chief_complaint,
        },
        primaryDiagnosis && {
            icon: AlertCircle,
            label: "Primary Diagnosis",
            value: primaryDiagnosis.diagnosis_name,
        },
        pendingInvestigations.length > 0 && {
            icon: FlaskConical,
            label: "Investigations",
            value: `${pendingInvestigations.length} ordered, awaiting results`,
        },
        pendingTreatmentItems.length > 0 && {
            icon: Layers,
            label: "Treatment Plan",
            value: `${pendingTreatmentItems.length} item${pendingTreatmentItems.length > 1 ? "s" : ""} pending`,
        },
    ].filter(Boolean) as SnapshotCellProps[];

    return (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-indigo-500" />
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                        Clinical Record
                    </p>
                    <span className={cn(
                        "text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-full",
                        encounter.status === "IN_PROGRESS"
                            ? "bg-violet-50 text-violet-700"
                            : "bg-emerald-50 text-emerald-700"
                    )}>
                        {encounter.status === "IN_PROGRESS" ? "In Progress" : "Closed"}
                    </span>
                </div>

                <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs font-bold text-indigo-600 hover:bg-indigo-50 gap-1.5 px-2"
                    onClick={() => router.push(`/appointments/${appointmentId}/encounter`)}
                >
                    <FolderOpen className="h-3 w-3" />
                    {encounter.status === "IN_PROGRESS" ? "Open Workspace" : "View Record"}
                </Button>
            </div>

            <div className="px-5">
                {/* Vitals strip */}
                <VitalsStrip encounter={encounter} />

                {/* Clinical cells */}
                {cells.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-50">
                        {cells.map((cell) => (
                            <div key={cell.label} className={cn(cells.indexOf(cell) % 2 === 1 && "sm:pl-4")}>
                                <SnapshotCell {...cell} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-slate-400 py-4 text-center">
                        Encounter started — documentation not yet added.
                    </p>
                )}
            </div>
        </div>
    );
}