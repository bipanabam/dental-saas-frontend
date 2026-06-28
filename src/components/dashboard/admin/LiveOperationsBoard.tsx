import { useMemo } from "react";
import { Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";

import { getAppointmentStageStyle } from "@/components/dashboard/stage";
import StatusBadge from "@/components/dashboard/shared/StatusBadge";

import type { TodaysAppointmentListItem } from "@/lib/api";

/**
 * Unified pipeline stage -> merges AppointmentStatusEnum + QueueStatusEnum
 * into a single ordered clinical stage that makes sense to an admin:
 *
 *   Scheduled → Confirmed → Checked In → Waiting → In Encounter → Completed
 *
 * The merge rule: if a queue record exists, queue.status takes precedence
 * for the physical room state. Appointment status drives scheduling state.
 */
function derivePipelineStage(item: TodaysAppointmentListItem): string {
    const appt = item.appointment;
    const queue = item.queue;

    if (appt.status === "COMPLETED") return "COMPLETED";
    if (appt.status === "NO_SHOW") return "NO_SHOW";
    if (appt.status === "CANCELLED") return "CANCELLED";
    if (appt.status === "IN_PROGRESS") return "IN_PROGRESS";

    if (queue) {
        if (queue.status === "WAITING") return "WAITING";
        if (queue.status === "CALLED") return "CALLED";
        if (queue.status === "IN_PROGRESS") return "IN_PROGRESS";
        if (queue.status === "SKIPPED") return "SKIPPED";
    }

    if (appt.status === "CHECKED_IN") return "CHECKED_IN";
    if (appt.status === "CONFIRMED") return "CONFIRMED";
    return "BOOKED";
}

const PIPELINE_ORDER = [
    "BOOKED", "CONFIRMED", "CHECKED_IN", "WAITING",
    "CALLED", "IN_PROGRESS", "COMPLETED",
];

// Stage label overrides for the admin view (clearer than raw enum names)
const STAGE_LABEL: Record<string, string> = {
    BOOKED: "Scheduled",
    CONFIRMED: "Confirmed",
    CHECKED_IN: "Checked In",
    WAITING: "Waiting",
    CALLED: "Called",
    IN_PROGRESS: "In Encounter",
    COMPLETED: "Completed",
    NO_SHOW: "No Show",
    CANCELLED: "Cancelled",
    SKIPPED: "Skipped",
};

interface LiveOperationsBoardProps {
    items: TodaysAppointmentListItem[];
    isLoading?: boolean;
}

export default function LiveOperationsBoard({
    items,
    isLoading,
}: LiveOperationsBoardProps) {
    const rows = useMemo(() => {
        return [...items]
            .map((item) => ({
                item,
                stage: derivePipelineStage(item),
            }))
            .sort((a, b) => {
                // Active stages float to top; completed sink to bottom
                const ai = PIPELINE_ORDER.indexOf(a.stage);
                const bi = PIPELINE_ORDER.indexOf(b.stage);
                if (ai !== bi) return bi - ai; // higher index = further along = sort first
                const at = new Date(a.item.appointment.appointment_date).getTime();
                const bt = new Date(b.item.appointment.appointment_date).getTime();
                return at - bt;
            });
    }, [items]);

    if (isLoading) {
        return (
            <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-11 rounded-lg bg-slate-100 animate-pulse" />
                ))}
            </div>
        );
    }

    if (!rows.length) {
        return (
            <p className="text-xs text-slate-400 text-center py-10">
                No appointments today yet.
            </p>
        );
    }

    return (
        <div className="overflow-x-auto -mx-1">
            <table className="w-full text-xs">
                <thead>
                    <tr className="text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
                        <th className="text-left pb-2 px-2 w-16">Time</th>
                        <th className="text-left pb-2 px-2">Patient</th>
                        <th className="text-left pb-2 px-2">Doctor</th>
                        <th className="text-left pb-2 px-2">Stage</th>
                        <th className="text-right pb-2 px-2 w-16">Token</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {rows.map(({ item, stage }) => {
                        const a = item.appointment;
                        const q = item.queue;
                        const isActive = stage === "IN_PROGRESS" || stage === "WAITING" || stage === "CALLED";

                        return (
                            <tr
                                key={a.id}
                                className={cn(
                                    "transition-colors",
                                    isActive ? "bg-brand-50/30" : "hover:bg-slate-50/60",
                                    (stage === "COMPLETED" || stage === "CANCELLED" || stage === "NO_SHOW")
                                        ? "opacity-50"
                                        : ""
                                )}
                            >
                                {/* Time */}
                                <td className="py-2.5 px-2 font-mono text-slate-500 whitespace-nowrap">
                                    {new Date(a.appointment_date).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </td>

                                {/* Patient */}
                                <td className="py-2.5 px-2">
                                    <p className="font-semibold text-slate-700 leading-none">
                                        {a.patient.first_name} {a.patient.last_name}
                                    </p>
                                    {a.chief_complaint && (
                                        <p className="text-[10px] text-slate-400 truncate max-w-35 mt-0.5">
                                            {a.chief_complaint}
                                        </p>
                                    )}
                                </td>

                                {/* Doctor */}
                                <td className="py-2.5 px-2">
                                    {a.doctor ? (
                                        <span className="text-slate-600 font-medium">
                                            {a.doctor.email?.split("@")[0] ?? "—"}
                                        </span>
                                    ) : (
                                        <span className="text-slate-300">Unassigned</span>
                                    )}
                                </td>

                                {/* Stage badge */}
                                <td className="py-2.5 px-2">
                                    <StatusBadge
                                        status={{
                                            ...getAppointmentStageStyle(a.status),
                                            label: STAGE_LABEL[stage] ?? stage,
                                        }}
                                        className="text-[9px] px-1.5 py-0 h-4"
                                    />
                                </td>

                                {/* Token / ETA */}
                                <td className="py-2.5 px-2 text-right">
                                    {q?.token_number ? (
                                        <span className="font-mono font-bold text-slate-500">
                                            #{q.token_number}
                                        </span>
                                    ) : (
                                        <span className="text-slate-300">—</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}