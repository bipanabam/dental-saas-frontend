"use client";

import { format, parseISO } from "date-fns";

import { cn } from "@/lib/utils";
import { getStatusConfig } from "@/types/appointments";

import type { AppointmentListItem } from "@/lib/api";

interface AppointmentCompactCardProps {
    appointment: AppointmentListItem;
    onClick?: (appointment: AppointmentListItem) => void;
}

export default function AppointmentCompactCard({
    appointment,
    onClick,
}: AppointmentCompactCardProps) {
    const apptDate = parseISO(appointment.appointment_date);
    const statusConfig = getStatusConfig(appointment.status);

    const isInactive =
        appointment.status === "CANCELLED" || appointment.status === "NO_SHOW";

    return (
        <button
            type="button"
            onClick={() => onClick?.(appointment)}
            className={cn(
                "w-full flex items-center gap-3 py-2.5 px-1 text-left border-b border-slate-100 last:border-b-0",
                "hover:bg-slate-50 transition-colors rounded-md",
                isInactive && "opacity-60",
            )}
        >
            <div className="w-16 shrink-0 text-xs font-bold text-slate-500 tabular-nums">
                {format(apptDate, "h:mm a")}
            </div>

            <div className="flex-1 min-w-0">
                <p
                    className={cn(
                        "text-sm font-semibold text-slate-900 truncate",
                        appointment.status === "CANCELLED" && "line-through",
                    )}
                >
                    {appointment.patient.first_name} {appointment.patient.last_name}
                </p>
                <p className="text-xs text-slate-500 truncate">
                    {appointment.chief_complaint || appointment.appointment_type}
                </p>
            </div>

            <span
                className={cn(
                    "shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
                    statusConfig.className,
                )}
            >
                <span className="h-1 w-1 rounded-full bg-current" />
                {statusConfig.label}
            </span>
        </button>
    );
}