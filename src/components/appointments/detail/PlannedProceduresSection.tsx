import { Clock, DollarSign, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppointmentDetail } from "@/lib/api";

// Status badge for individual procedures
const PROC_STATUS_STYLE: Record<string, { badge: string; label: string }> = {
    PLANNED: { badge: "bg-slate-100 text-slate-600", label: "Planned" },
    IN_PROGRESS: { badge: "bg-violet-50 text-violet-700", label: "In Progress" },
    COMPLETED: { badge: "bg-emerald-50 text-emerald-700", label: "Completed" },
    CANCELLED: { badge: "bg-zinc-100 text-zinc-500", label: "Cancelled" },
    DEFERRED: { badge: "bg-amber-50 text-amber-700", label: "Deferred" },
};

function ProcStatusBadge({ status }: { status?: string | null }) {
    const s = PROC_STATUS_STYLE[status ?? "PLANNED"] ?? PROC_STATUS_STYLE["PLANNED"];
    return (
        <span className={cn("text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-full", s.badge)}>
            {s.label}
        </span>
    );
}

// Single procedure row
interface ProcedureRowProps {
    proc: NonNullable<AppointmentDetail["procedures"]>[number];
    index: number;
}

function ProcedureRow({ proc, index }: ProcedureRowProps) {
    return (
        <div className={cn(
            "flex items-start justify-between gap-4 py-3.5 px-4",
            index > 0 && "border-t border-slate-50"
        )}>
            {/* Left: name + teeth + notes */}
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-slate-800">
                        {proc.procedure_catalog?.name ?? "Procedure"}
                    </p>
                    <ProcStatusBadge status={proc.status} />
                </div>

                {/* Tooth chips */}
                {proc.tooth_numbers && proc.tooth_numbers.length > 0 && (
                    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-400 font-semibold">Tooth</span>
                        {proc.tooth_numbers.map((t) => (
                            <span
                                key={t}
                                className="inline-flex items-center justify-center h-5 min-w-5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-black px-1"
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                )}

                {proc.notes && (
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug line-clamp-2">
                        {proc.notes}
                    </p>
                )}
            </div>

            {/* Right: cost + duration */}
            <div className="shrink-0 text-right space-y-1">
                {proc.estimated_cost != null && (
                    <div className="flex items-center gap-1 justify-end">
                        <DollarSign className="h-3 w-3 text-slate-300" />
                        <span className="text-sm font-black font-mono text-slate-700">
                            Rs {proc.estimated_cost.toLocaleString()}
                        </span>
                    </div>
                )}
                {proc.estimated_duration_minutes != null && proc.estimated_duration_minutes > 0 && (
                    <div className="flex items-center gap-1 justify-end">
                        <Clock className="h-3 w-3 text-slate-300" />
                        <span className="text-[11px] font-semibold text-slate-400">
                            {proc.estimated_duration_minutes} min
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

// Section
interface PlannedProceduresSectionProps {
    appointment: AppointmentDetail;
}

export default function PlannedProceduresSection({ appointment }: PlannedProceduresSectionProps) {
    const procedures = appointment.procedures ?? [];

    // Totals
    const totalCost = procedures.reduce((s, p) => s + (p.estimated_cost ?? 0), 0);
    const totalDuration = procedures.reduce((s, p) => s + (p.estimated_duration_minutes ?? 0), 0);

    if (procedures.length === 0) {
        return (
            <div className="bg-white border border-slate-100 rounded-2xl px-5 py-8 text-center">
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
                    <Stethoscope className="h-5 w-5 text-slate-300" />
                </div>
                <p className="text-sm font-semibold text-slate-500">No procedures planned</p>
                <p className="text-xs text-slate-400 mt-1">
                    Procedures added during booking or encounter will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
            {/* Section header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-brand-600" />
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                        Planned Procedures
                    </p>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 rounded-full px-1.5 py-0.5">
                        {procedures.length}
                    </span>
                </div>

            </div>

            {/* Procedure rows */}
            <div>
                {procedures.map((proc, idx) => (
                    <ProcedureRow key={proc.id} proc={proc} index={idx} />
                ))}
            </div>

            {/* Totals footer */}
            {(totalCost > 0 || totalDuration > 0) && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {procedures.length} procedure{procedures.length > 1 ? "s" : ""}
                    </span>
                    <div className="flex items-center gap-5">
                        {totalDuration > 0 && (
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-3 w-3 text-slate-400" />
                                <span className="text-xs font-bold text-slate-600">
                                    {totalDuration} min
                                </span>
                            </div>
                        )}
                        {totalCost > 0 && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-slate-400 font-semibold">Est.</span>
                                <span className="text-sm font-black font-mono text-slate-800">
                                    Rs {totalCost.toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}