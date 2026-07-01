"use client";

import { useState, useMemo, Suspense } from "react";

import { CalendarDays, Plus, Users, Clock } from "lucide-react";

import PageHeader from "@/components/shared/page/PageHeader";
import AppointmentTable from "@/components/appointments/appointment-table";
import AppointmentFilters from "@/components/appointments/AppointmentFilters";
import AppointmentViewToggle from "@/components/appointments/AppointmentViewToggle";
import VisitFlowStatsStrip from "@/components/appointments/VisitFlowStatsStrip";

import DoctorGroupedView from "@/components/appointments/doctor-view/DoctorGroupedView";
import MonthCalendarView from "@/components/appointments/calendar-view/MonthCalendarView";
import AppointmentDetailSheet from "@/components/appointments/detail/AppointmentDetailSheet";

import { Button } from "@/components/ui/button";
import { SectionLoader } from "@/components/base/loading-view";

import PatientSelectDialog from "@/components/appointments/shared/PatientSelectDialog";

import { useAppointments } from "@/hooks/appointments/use-appointments";
import { useAppointmentView } from "@/hooks/appointments/use-appointment-view";

import type { AppointmentFilters as Filters } from "@/components/appointments/types/appointment-filter";
import type { AppointmentListItem } from "@/lib/api";

function AppointmentsPage() {
    const [booking, setBooking] = useState<{ open: boolean; initialDate?: Date }>({
        open: false,
    });
    const [filters, setFilters] = useState<Filters>({});

    const { view } = useAppointmentView();
    const { data, isLoading, isFetching } = useAppointments(filters);

    const appointments = data?.items ?? [];
    const stats = data?.stats;

    const [selectedAppointment, setSelectedAppointment] =
        useState<AppointmentListItem | null>(null);

    return (
        <>
            <div className="space-y-6">
                <PageHeader
                    title="Appointment Management"
                    description="Search, review and manage appointments"
                    icon={CalendarDays}
                    actions={
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                            <AppointmentViewToggle />
                            <Button onClick={() => setBooking({ open: true })}>
                                <Plus />
                                Book Intake
                            </Button>
                        </div>
                    }
                />

                <AppointmentFilters filters={filters} onChange={setFilters} />

                {view === "list" ? (
                    <VisitFlowStatsStrip data={stats} />
                ) : (
                    <VisitFlowStatsStrip data={stats} />
                )}

                {isLoading ? (
                    <SectionLoader message="Loading appointments..." />
                ) : view === "provider" ? (
                    <DoctorGroupedView
                        appointments={appointments}
                        stats={stats}
                        isLoading={isFetching}
                        onAppointmentClick={setSelectedAppointment}
                    />
                ) : view === "calendar" ? (
                    <MonthCalendarView
                        appointments={appointments}
                        onAppointmentClick={setSelectedAppointment}
                        onRequestBooking={(date) => setBooking({ open: true, initialDate: date })}
                        isFetching= {isFetching}
                    />
                ) : (
                    <AppointmentTable
                        appointments={appointments}
                        stats={stats}
                        isLoading={isFetching}
                        onAppointmentClick={setSelectedAppointment}
                    />
                )}
            </div>

            <PatientSelectDialog
                open={booking.open}
                onOpenChange={(open) => setBooking((s) => ({ ...s, open }))}
                initialDate={booking.initialDate}
            />

            {/* Detail drawer/sheet, driven by selectedAppointment.*/}
            <AppointmentDetailSheet
                appointment={selectedAppointment}
                onOpenChange={(open) => {
                    if (!open) setSelectedAppointment(null);
                }}
            />
        </>
    );
}

export default function AppointmentsPageWrapper() {
    return (
        <Suspense fallback={<SectionLoader message="Loading appointments..." />}>
            <AppointmentsPage />
        </Suspense>
    );
}