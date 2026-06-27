import { Loader2, ClipboardList, Sticker } from "lucide-react";

import { useAppointmentDetail } from "@/hooks/appointments/use-appointments";

interface PlannedProceduresPreviewProps {
    appointmentId: string;
}

/**
 * Pre-read panel shown in the center Encounter column when the selected
 * patient's appointment is still BOOKED, CONFIRMED, or CHECKED_IN.
 *
 * Fires GET /appointments/{id} (useAppointmentDetail) to fetch the planned
 * procedure list so the doctor can review what's coming before the encounter
 * is started. Keeps the center panel useful even when no encounter exists yet.
 */
export default function PlannedProceduresPreview({
    appointmentId,
}: PlannedProceduresPreviewProps) {
    const { data, isLoading } = useAppointmentDetail(appointmentId);

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 py-4 text-xs text-slate-400">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Loading appointment details…
            </div>
        );
    }

    const procedures = data?.procedures ?? [];

    if (!procedures.length) {
        return (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-5 text-center">
                <ClipboardList className="h-7 w-7 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-500">No procedures planned</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                    Patient scheduled but no procedures added to this appointment yet.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Planned Procedures · {procedures.length}
            </p>
            <div className="space-y-1.5">
                {procedures.map((proc: any) => (
                    <div
                        key={proc.id}
                        className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2.5"
                    >
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-slate-700 leading-snug">
                                {proc.procedure_name ?? "Procedure"}
                            </p>
                            {proc.tooth_numbers?.length > 0 && (
                                <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                                    <Sticker className="h-3 w-3" />
                                    Tooth {proc.tooth_numbers.join(", ")}
                                </p>
                            )}
                        </div>
                        {proc.estimated_cost != null && (
                            <span className="text-[10px] font-bold text-slate-500 shrink-0 font-mono">
                                Rs {proc.estimated_cost.toLocaleString()}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}