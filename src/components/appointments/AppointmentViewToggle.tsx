"use client";

import { LayoutList, Stethoscope, CalendarRange } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useCanViewDoctorSplit } from "@/hooks/auth/use-can-view-doctor-split";
import { useAppointmentView, type AppointmentView } from "@/hooks/appointments/use-appointment-view";

export default function AppointmentViewToggle() {
    const canViewDoctorSplit = useCanViewDoctorSplit();
    const { view, setView } = useAppointmentView();

    if (!canViewDoctorSplit) return null;

    return (
        <Tabs value={view} onValueChange={(v) => setView(v as AppointmentView)}>
            <TabsList className="bg-slate-200/80 border border-slate-200/40 rounded-xl p-1 h-10 grid grid-cols-3 sm:flex">
                <TabsTrigger
                    value="list"
                    className="relative rounded-lg text-xs font-bold uppercase tracking-wider text-slate-500 gap-1.5 px-4 data-[state=active]:bg-white data-[state=active]:text-brand-900 data-[state=active]:shadow-sm data-[state=active]:font-extrabold"
                >
                    <LayoutList className="h-3.5 w-3.5" />
                    List
                </TabsTrigger>
                <TabsTrigger
                    value="provider"
                    className="relative rounded-lg text-xs font-bold uppercase tracking-wider text-slate-500 gap-1.5 px-4 data-[state=active]:bg-white data-[state=active]:text-brand-900 data-[state=active]:shadow-sm data-[state=active]:font-extrabold"
                >
                    <Stethoscope className="h-3.5 w-3.5" />
                    By Provider
                </TabsTrigger>
                <TabsTrigger
                    value="calendar"
                    className="relative rounded-lg text-xs font-bold uppercase tracking-wider text-slate-500 gap-1.5 px-4 data-[state=active]:bg-white data-[state=active]:text-brand-900 data-[state=active]:shadow-sm data-[state=active]:font-extrabold"
                >
                    <CalendarRange className="h-3.5 w-3.5" />
                    Calendar
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
}