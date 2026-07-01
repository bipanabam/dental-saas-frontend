"use client";

import { format, parseISO } from "date-fns";

import { cn } from "@/lib/utils";
import { getStatusConfig } from "@/types/appointments";

import type { AppointmentListItem } from "@/lib/api";

interface AppointmentRowProps {
    appointment: AppointmentListItem;
    onClick?: (appointment: AppointmentListItem) => void;
    index?: number;
}

export default function AppointmentRow({
    appointment,
    onClick,
    index,
}: AppointmentRowProps) {
    const apptDate = parseISO(appointment.appointment_date);
    const statusConfig = getStatusConfig(appointment.status);
    const isInactive = appointment.status === "CANCELLED" || appointment.status === "NO_SHOW";
    const isActiveRow = appointment.status === "IN_PROGRESS" || appointment.status === "CHECKED_IN";

    return (
        <button
            type="button"
            onClick={() => onClick?.(appointment)}
            className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 text-left border-b border-slate-50 last:border-0",
                "hover:bg-slate-50 transition-colors",
                isActiveRow && "border-l-2 border-l-brand-500 bg-brand-50/20",
                isInactive && "opacity-50",
            )}
        >
            {index !== undefined && (
                <span className="w-6 shrink-0 text-[11px] font-mono font-semibold text-slate-400">
                    {String(index + 1).padStart(2, "0")}
                </span>
            )}

            <span className="w-14 shrink-0 text-xs font-bold text-slate-600 tabular-nums">
                {format(apptDate, "h:mm a")}
            </span>

            <span className="flex-1 min-w-0">
                <p className={cn(
                    "text-sm font-semibold text-slate-900 truncate",
                    appointment.status === "CANCELLED" && "line-through",
                )}>
                    {appointment.patient.first_name} {appointment.patient.last_name}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                    {appointment.chief_complaint || appointment.appointment_type}
                </p>
            </span>

            <span
                className={cn(
                    "shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border",
                    statusConfig.className,
                )}
            >
                {statusConfig.label}
            </span>
        </button>
    );
}