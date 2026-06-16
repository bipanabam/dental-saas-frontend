"use client";

import React from "react";
import { useState, useEffect } from "react";

import { useTodaysAppointments, useAppointmentDetail } from "@/hooks/appointments/use-appointments";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CalendarDays, Plus } from "lucide-react";

import PageHeader from "@/components/shared/page/PageHeader";
import AppointmentStats from "@/components/appointments/appointment-stats";
import AppointmentSidebar from "@/components/appointments/appointment-sidebar";
import AppointmentList from "@/components/appointments/appointment-list";
import AppointmentInspector from "@/components/appointments/appointment-inspector";


const AppointmentsPage = () => {
    const [selectedId, setSelectedId] = useState<string>();

    const { data, isLoading } = useTodaysAppointments();
    const appointments = data?.items ?? [];

    useEffect(() => {
        if (!selectedId && appointments.length > 0) {
            setSelectedId(appointments[0].appointment.id);
        }
    }, [appointments, selectedId]);

    const { data: selectedAppointment, isLoading: detailLoading, error } = useAppointmentDetail(
        selectedId
    );
    console.log(appointments)
    console.log({
        selectedId,
        selectedAppointment,
        error,
    });

    // Filter actions layout configuration pass-through matching image headers
    const headerActions = (
        <div className="flex flex-wrap items-center gap-3">
            <Tabs defaultValue="today" className="w-auto">
                <TabsList className="bg-slate-100 rounded-2xl p-1 h-10">
                    <TabsTrigger value="today" className="rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-brand-900 data-[state=active]:shadow-2xs">Today</TabsTrigger>
                    <TabsTrigger value="week" className="rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-brand-900 data-[state=active]:shadow-2xs">Week</TabsTrigger>
                    <TabsTrigger value="month" className="rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-brand-900 data-[state=active]:shadow-2xs">Month</TabsTrigger>
                </TabsList>
            </Tabs>
            <Button className="bg-brand-700 hover:bg-brand-800 text-white font-semibold rounded-xl h-10 gap-2 shadow-sm">
                <Plus className="h-4 w-4" /> Book Intake
            </Button>
        </div>
    );

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto w-full p-1">
            <PageHeader
                title="Appointment Management"
                description={`Active Operations Queue • Last synchronized: Just now`}
                icon={CalendarDays}
                actions={headerActions}
            />

            {/* Top Analytics Stats Grid */}
            <AppointmentStats
                appointments={appointments}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column Section: Calendar & Resource Checks (3 Columns Wide) */}
                <div className="md:col-span-1 lg:col-span-3">
                    <AppointmentSidebar />
                </div>

                {/* Central Column Section: Queue Ledger Pipeline (4 Columns Wide) */}
                <div className="md:col-span-2 lg:col-span-4">
                    <AppointmentList
                        appointments={appointments}
                        selectedId={selectedId}
                        isLoading={isLoading}
                        onSelect={(appt) =>
                            setSelectedId(
                                appt.appointment.id
                            )
                        }
                    />
                </div>

                {/* Right Column Section: Dedicated Patient Deck Inspection (5 Columns Wide) */}
                <div className="md:col-span-1 lg:col-span-5">
                    <AppointmentInspector
                        appointment={selectedAppointment}
                        // patient={selectedAppointment}
                        loading={detailLoading}
                    />
                </div>

            </div>
        </div>
    );
}

export default AppointmentsPage;