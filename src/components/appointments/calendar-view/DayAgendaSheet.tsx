"use client";

import { format } from "date-fns";
import { Plus } from "lucide-react";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import AppointmentRow from "@/components/appointments/shared/AppointmentRow";
import type { AppointmentListItem } from "@/lib/api";

interface DayAgendaSheetProps {
    day: Date | null;
    appointments: AppointmentListItem[];
    onOpenChange: (open: boolean) => void;
    onAppointmentClick?: (appointment: AppointmentListItem) => void;
    onRequestBooking?: (date: Date) => void;
}

export default function DayAgendaSheet({
    day,
    appointments,
    onOpenChange,
    onAppointmentClick,
    onRequestBooking,
}: DayAgendaSheetProps) {
    return (
        <Sheet open={Boolean(day)} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
                <SheetHeader className="flex flex-row items-center justify-between gap-2 pr-10">
                    <SheetTitle>{day ? format(day, "EEEE, MMMM d") : ""}</SheetTitle>
                    {day && onRequestBooking && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 shrink-0"
                            onClick={() => {
                                onOpenChange(false);
                                onRequestBooking(day);
                            }}
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Add
                        </Button>
                    )}
                </SheetHeader>

                <div className="flex-1 overflow-y-auto">
                    {appointments.map((appt) => (
                        <AppointmentRow key={appt.id} appointment={appt} onClick={onAppointmentClick} />
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
}