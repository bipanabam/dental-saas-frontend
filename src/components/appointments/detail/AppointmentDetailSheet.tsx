"use client";

import { CalendarDays } from "lucide-react";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

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
    return (
        <Sheet open={Boolean(appointment)} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
                <SheetHeader className="flex flex-row items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-brand-700" />
                    <SheetTitle className="text-lg font-bold text-slate-900">Appointment Detail</SheetTitle>
                </SheetHeader>

                {appointment && (
                    <div className="flex-1 px-4 pb-4">
                        <AppointmentDetailContent appointment={appointment} />
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}