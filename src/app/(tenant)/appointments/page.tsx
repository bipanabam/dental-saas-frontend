"use client";

import { useState } from "react";

import { CalendarDays, Plus } from "lucide-react";

import PageHeader from "@/components/shared/page/PageHeader";
import VisitFlowStats from "@/components/appointments/VisitFlowStats";
import AppointmentTable from "@/components/appointments/appointment-table";
import AppointmentFilters from "@/components/appointments/AppointmentFilters";

import { Button } from "@/components/ui/button";
import { SectionLoader } from "@/components/base/loading-view";

import PatientSelectDialog from "@/components/appointments/PatientSelectDialog";

import { useAppointments } from "@/hooks/appointments/use-appointments";

import type { AppointmentFilters as Filters } from "@/components/appointments/types/appointment-filter";

export default function AppointmentsPage() {
    const [bookOpen, setBookOpen] = useState(false);

    const [filters, setFilters] =
        useState<Filters>({});

    const {
        data,
        isLoading,
        isFetching,
    } = useAppointments(filters);

    const appointments =
        data?.items ?? [];

    const stats =
        data?.stats;

    return (
        <>
            <div className="space-y-6">

                <PageHeader
                    title="Appointment Management"
                    description="Search, review and manage appointments"
                    icon={CalendarDays}
                    actions={
                        <Button
                            onClick={() =>
                                setBookOpen(true)
                            }
                        >
                            <Plus />
                            Book Intake
                        </Button>
                    }
                />

                <VisitFlowStats
                    data={stats}
                />

                <AppointmentFilters
                    filters={filters}
                    onChange={setFilters}
                />

                {isLoading ? (
                    <SectionLoader
                        message="Loading appointments..."
                    />
                ) : (
                    <AppointmentTable
                        appointments={appointments}
                        stats={stats}
                        isLoading={
                            isFetching
                        }
                    />
                )}
            </div>

            <PatientSelectDialog
                open={bookOpen}
                onOpenChange={
                    setBookOpen
                }
            />
        </>
    );
}