import {
    Stethoscope, AlertCircle, FlaskConical, Layers,
    Loader2, Play, FolderOpen, CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionLoader } from "@/components/base/loading-view";
import StatusBadge from "@/components/dashboard/shared/StatusBadge";
import { getAppointmentStageStyle } from "@/components/dashboard/stage";
import { useEncounterByAppointmentId } from "@/hooks/encounter/use-encounter";

import PlannedProceduresPreview from "./PlannedProceduresPreview";

import type { AppointmentListItem } from "@/lib/api";


// EncounterSnapshotCards
function EncounterSnapshotCards({
    encounter,
}: {
    encounter: NonNullable<ReturnType<typeof useEncounterByAppointmentId>["data"]>;
}) {
    const primaryDiagnosis = encounter.diagnoses?.find((d) => d.is_primary);
    const pendingPlanItems = encounter.treatment_plan?.items?.filter(
        (i) => i.status === "PENDING"
    );

    const sections = [
        { label: "Chief Complaint", value: encounter.chief_complaint, icon: Stethoscope },
        { label: "Diagnosis", value: primaryDiagnosis?.diagnosis_name, icon: AlertCircle },
        {
            label: "Investigations",
            value: encounter.investigations?.length
                ? `${encounter.investigations.length} ordered`
                : null,
            icon: FlaskConical,
        },
        {
            label: "Treatment Plan",
            value: pendingPlanItems?.length
                ? `${pendingPlanItems.length} pending items`
                : null,
            icon: Layers,
        },
    ].filter((s) => s.value);

    if (!sections.length) {
        return (
            <p className="text-xs text-slate-400 text-center py-4">
                Documentation not yet started.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sections.map((s) => {
                const Icon = s.icon;
                return (
                    <div
                        key={s.label}
                        className="rounded-xl border border-slate-100 bg-slate-50/50 p-3"
                    >
                        <div className="flex items-center gap-1.5 mb-1">
                            <Icon className="h-3 w-3 text-slate-400" />
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                {s.label}
                            </p>
                        </div>
                        <p className="text-xs font-semibold text-slate-700 leading-snug">
                            {s.value}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}


// EncounterSummaryPanel
interface EncounterSummaryPanelProps {
    appointment?: AppointmentListItem;
    loading: boolean;
    onStart: () => void;
    onComplete: () => void;
    onOpen: () => void;
    isStartPending: boolean;
    isCompletePending: boolean;
}

/**
 * Center panel of the Doctor dashboard.
 *
 * State matrix:
 *   no selection        → prompt to select a patient
 *   BOOKED / CONFIRMED  → PlannedProceduresPreview (pre-read before arrival)
 *   CHECKED_IN          → PlannedProceduresPreview + "ready to start" banner + Start button
 *   IN_PROGRESS         → EncounterSnapshotCards (live clinical summary) + Open / Complete buttons
 *   COMPLETED           → EncounterSnapshotCards (read-only summary)
 */
export default function EncounterSummaryPanel({
    appointment,
    loading,
    onStart,
    onComplete,
    onOpen,
    isStartPending,
    isCompletePending,
}: EncounterSummaryPanelProps) {
    const status = appointment?.status;

    const { data: encounter, isLoading: encounterLoading } = useEncounterByAppointmentId(
        status === "IN_PROGRESS" || status === "COMPLETED" ? appointment?.id : undefined
    );

    if (loading) return <SectionLoader message="Loading encounter..." />;

    if (!appointment) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <Stethoscope className="h-7 w-7 text-slate-300" />
                </div>
                <p className="text-sm font-semibold text-slate-500">Select a patient</p>
                <p className="text-xs text-slate-400 mt-1">
                    Choose a patient from your schedule to view encounter details.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Patient identity bar */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="h-10 w-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-sm font-black text-brand-700 uppercase shrink-0">
                    {appointment.patient.first_name[0]}
                    {appointment.patient.last_name[0]}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800">
                        {appointment.patient.first_name} {appointment.patient.last_name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                        {new Date(appointment.appointment_date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                        {appointment.chief_complaint && ` · ${appointment.chief_complaint}`}
                    </p>
                </div>
                <StatusBadge
                    status={getAppointmentStageStyle(appointment.status)}
                    className="shrink-0"
                />
            </div>

            {/* Clinical content */}
            {status === "IN_PROGRESS" || status === "COMPLETED" ? (
                encounterLoading ? (
                    <SectionLoader message="Loading clinical record..." />
                ) : encounter ? (
                    <EncounterSnapshotCards encounter={encounter} />
                ) : (
                    <p className="text-xs text-slate-400 text-center py-4">
                        Documentation not yet started.
                    </p>
                )
            ) : status === "CHECKED_IN" ? (
                <div className="space-y-3">
                    <PlannedProceduresPreview appointmentId={appointment.id} />
                    <div className="rounded-xl border border-dashed border-brand-200 bg-brand-50/40 p-4 text-center">
                        <p className="text-xs font-semibold text-brand-700">Patient is checked in</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                            Ready to begin — start the encounter above.
                        </p>
                    </div>
                </div>
            ) : (
                // BOOKED / CONFIRMED — pre-read before patient arrives
                <PlannedProceduresPreview appointmentId={appointment.id} />
            )}

            {/* Action buttons */}
            <div className="flex gap-2 pt-1">
                {status === "CHECKED_IN" && (
                    <Button
                        className="flex-1 bg-brand-700 rounded-xl gap-2"
                        onClick={onStart}
                        disabled={isStartPending}
                    >
                        {isStartPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Play className="h-4 w-4" />
                        )}
                        Start Encounter
                    </Button>
                )}

                {status === "IN_PROGRESS" && (
                    <>
                        <Button
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 rounded-xl gap-2"
                            onClick={onOpen}
                        >
                            <FolderOpen className="h-4 w-4" />
                            Open Workspace
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-xl gap-2 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                            onClick={onComplete}
                            disabled={isCompletePending}
                        >
                            {isCompletePending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <CheckCircle2 className="h-4 w-4" />
                            )}
                            Complete
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}