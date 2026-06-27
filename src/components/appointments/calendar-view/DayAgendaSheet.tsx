"use client";

import { format, parseISO } from "date-fns";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import AppointmentCompactCard from "@/components/appointments/doctor-view/AppointmentCompactCard";

import type { AppointmentListItem } from "@/lib/api";

interface DayAgendaSheetProps {
    day: Date | null;
    appointments: AppointmentListItem[];
    onOpenChange: (open: boolean) => void;
    onAppointmentClick?: (appointment: AppointmentListItem) => void;
}

export default function DayAgendaSheet({
    day,
    appointments,
    onOpenChange,
    onAppointmentClick,
}: DayAgendaSheetProps) {
    return (
        <Sheet open={Boolean(day)} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
                <SheetHeader>
                    <SheetTitle>{day ? format(day, "EEEE, MMMM d") : ""}</SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-0">
                    {appointments.map((appt) => (
                        <AppointmentCompactCard
                            key={appt.id}
                            appointment={appt}
                            onClick={onAppointmentClick}
                        />
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
}