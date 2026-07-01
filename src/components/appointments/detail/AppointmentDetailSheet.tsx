"use client";

import { CalendarDays } from "lucide-react";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import { useAppointmentDetail } from "@/hooks/appointments/use-appointments";
import { getStatusConfig } from "@/types/appointments";
import { cn } from "@/lib/utils";

import AppointmentDetailContent from "./AppointmentDetailContent";

import type { AppointmentListItem } from "@/lib/api";

interface AppointmentDetailSheetProps {
    appointment: AppointmentListItem | null;
    onOpenChange: (open: boolean) => void;
}

export default function AppointmentDetailSheet({
    appointment,
    onOpenChange,
}: AppointmentDetailSheetProps) {
    const { data: detail } = useAppointmentDetail(appointment?.id);
    const current = detail ?? appointment;

    const statusConfig = current ? getStatusConfig(current.status) : null;

    return (
        <Sheet open={Boolean(appointment)} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
                <SheetHeader className="gap-1">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <CalendarDays className="h-3.5 w-3.5 text-brand-700" />
                        Appointment Detail
                    </div>

                    {current && (
                        <div className="flex items-center gap-2 flex-wrap">
                            <SheetTitle className="text-lg font-bold text-slate-900 truncate">
                                {current.patient.first_name} {current.patient.last_name}
                            </SheetTitle>
                            {statusConfig && (
                                <span
                                    className={cn(
                                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border shrink-0",
                                        statusConfig.className,
                                    )}
                                >
                                    <span className="h-1 w-1 rounded-full bg-current" />
                                    {statusConfig.label}
                                </span>
                            )}
                        </div>
                    )}
                </SheetHeader>

                {appointment && (
                    <div className="flex-1 px-4 pb-4 overflow-y-auto">
                        <AppointmentDetailContent appointment={appointment} />
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}