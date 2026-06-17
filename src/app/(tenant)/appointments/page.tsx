"use client";

import { useState, useEffect, useMemo } from "react";

import { useTodaysAppointments, useAppointmentDetail, useAppointments } from "@/hooks/appointments/use-appointments";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CalendarDays, Plus } from "lucide-react";

import PageHeader from "@/components/shared/page/PageHeader";
import AppointmentStats from "@/components/appointments/appointment-stats";
import AppointmentSidebar from "@/components/appointments/appointment-sidebar";
import AppointmentList from "@/components/appointments/appointment-list";
import AppointmentInspector from "@/components/appointments/appointment-inspector";
import AppointmentTable from "@/components/appointments/appointment-table";

import { useFilters } from "@/components/shared/filters/useFilters";
import FilterPanel from "@/components/shared/filters/FilterPanel";
import { SectionLoader } from "@/components/base/loading-view";

import type {
    AppointmentStatusEnum,
    AppointmentSourceEnum,
    AppointmentTypeEnum,
} from "@/lib/api";
import { appointmentFilters } from "@/types/appointments";

import getDateRange, { type Range } from "@/lib/utils/get-date";

const AppointmentsPage = () => {
    const [range, setRange] = useState<Range>("today");
    const [selectedId, setSelectedId] = useState<string | undefined>();
    const { filters, update, reset } = useFilters({
        status: "ALL",
        source: "ALL",
        appointment_type: "ALL",
    });

    const rangeFilter = useMemo(
        () => getDateRange(range),
        [range]
    );

    // Queries
    const queryParams = useMemo(
        () => ({
            ...(range !== "today"
                ? rangeFilter
                : {}),

            status:
                filters.status !== "ALL"
                    ? (filters.status as AppointmentStatusEnum)
                    : undefined,

            source:
                filters.source !== "ALL"
                    ? (filters.source as AppointmentSourceEnum)
                    : undefined,

            appointment_type:
                filters.appointment_type !== "ALL"
                    ? (filters.appointment_type as AppointmentTypeEnum)
                    : undefined,
        }),

        [range, rangeFilter, filters]
    );

    const rangedQuery = useAppointments(
        queryParams,
        {
            enabled: range !== "today",
        }
    );
    const todaysQuery = useTodaysAppointments(
        undefined,
        { enabled: range === "today" }
    );

    const todaysAppointments = todaysQuery.data?.items ?? [];
    const rangedAppointments = rangedQuery.data?.items ?? [];

    const isLoadingToday = todaysQuery.isLoading;
    const isLoadingRanged = rangedQuery.isLoading;

    // stats
    const todaysStats =
        todaysQuery.data?.stats;

    const rangedStats =
        rangedQuery.data?.stats;

    const stats =
        range === "today"
            ? todaysStats
            : rangedStats;

    const { data: selectedAppointment, isLoading: detailLoading, error } = useAppointmentDetail(
        selectedId
    );

    useEffect(() => {
        // Clear inspector when switching tabs
        setSelectedId(undefined);
    }, [range]);

    useEffect(() => {
        if (range === "today" && !selectedId && todaysAppointments.length > 0) {
            setSelectedId(todaysAppointments[0].appointment.id);
        }
    }, [range, todaysAppointments, selectedId]);

    if (isLoadingRanged) {
        return (
            <SectionLoader message="Fetching appointments...." />
        )
    }

    // Filter actions layout configuration pass-through matching image headers
    const headerActions = (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <Tabs 
                value={range} 
                onValueChange={(v) => setRange(v as Range)}
                className="w-full sm:w-auto"
            >
                <TabsList className="bg-slate-200/80 border border-slate-200/40 rounded-xl p-1 h-10 grid grid-cols-3 sm:flex sm:w-auto">
                    {(["today", "week", "month"] as const).map((v) => (
                        <TabsTrigger
                            key={v}
                            value={v}
                            className="relative rounded-lg text-xs font-bold uppercase tracking-wider text-slate-500 transition-all duration-200 px-4 data-[state=active]:bg-white data-[state=active]:text-brand-900 data-[state=active]:shadow-sm data-[state=active]:font-extrabold"
                        >
                            {v}
                        </TabsTrigger>
                    ))}
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
            <AppointmentStats data={stats} />

            {range !== "today" && (
                <FilterPanel
                    fields={appointmentFilters}
                    values={filters}
                    onChange={update}
                    onReset={reset}
                />
            )}

            {range === "today" ? (
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6 items-start">
                    <div className="md:col-span-1 lg:col-span-3">
                        <AppointmentSidebar />
                    </div>
                    <div className="md:col-span-2 lg:col-span-4">
                        <AppointmentList
                            appointments={todaysAppointments}
                            selectedId={selectedId}
                            isLoading={isLoadingToday}
                            onSelect={(appt) => setSelectedId(appt.appointment.id)}
                        />
                    </div>
                    <div className="md:col-span-1 lg:col-span-5">
                        <AppointmentInspector
                            appointment={selectedAppointment}
                            loading={detailLoading}
                        />
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-3">
                        <AppointmentSidebar />
                    </div>
                    <div className="lg:col-span-9">
                        <AppointmentTable
                            appointments={rangedAppointments}
                            stats={rangedQuery.data?.stats}
                            isLoading={isLoadingRanged}
                            range={range}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default AppointmentsPage;