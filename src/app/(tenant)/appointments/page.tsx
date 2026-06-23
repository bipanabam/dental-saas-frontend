"use client";

import { useState, useEffect, useMemo } from "react";

import { useRouter } from "next/navigation";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CalendarDays, Plus } from "lucide-react";

import { useFilters } from "@/components/shared/filters/useFilters";
import FilterPanel from "@/components/shared/filters/FilterPanel";
import { SectionLoader } from "@/components/base/loading-view";

import PageHeader from "@/components/shared/page/PageHeader";
import VisitFlowStats from "@/components/appointments/VisitFlowStats";
import AppointmentQueue from "@/components/appointments/AppointmentQueue";
import QueueLayout from "@/components/appointments/QueueLayout";
import VisitWorkflowPanel from "@/components/appointments/VisitWorkFlowPanel";
import RescheduleDialog from "@/components/appointments/RescheduleDialog";
import FollowUpDialog from "@/components/appointments/FollowUpDialog";
import AppointmentTable from "@/components/appointments/appointment-table";

import type {
    AppointmentStatusEnum,
    AppointmentSourceEnum,
    AppointmentTypeEnum,
} from "@/lib/api";
import type { TodaysAppointmentListItem } from "@/lib/api";
import {
    useTodaysAppointments,
    useAppointmentDetail,
    useAppointments,
} from "@/hooks/appointments/use-appointments";
import {
    useConfirmAppointment,
    useCheckInAppointment,
    useStartAppointment,
    useCompleteAppointment,
    useMarkNoShow,
} from "@/hooks/appointments/use-appointment-workflow";

import { appointmentFilters } from "@/types/appointments";

import getDateRange, { type Range } from "@/lib/utils/get-date";
import { type WorkflowAction, getPrimaryWorkflowAction, type AppointmentItem } from "@/lib/utils/appointment-workflow";

type RescheduleTarget = {
    id: string;
    assigned_doctor_id?: string | null;
};

const AppointmentsPage = () => {
    const router = useRouter();
    const [range, setRange] = useState<Range>("today");
    const [rescheduleTarget, setRescheduleTarget] = useState<RescheduleTarget>();
    const [followUpTarget, setFollowUpTarget] = useState<string>();
    const [noShowTarget, setNoShowTarget] = useState<string>();
    const [selectedId, setSelectedId] = useState<string | undefined>();
    const { filters, update, reset } = useFilters({
        status: "ALL",
        source: "ALL",
        appointment_type: "ALL",
    });

    const rangeFilter = useMemo(() => getDateRange(range), [range]);

    // Queries
    const queryParams = useMemo(
        () => ({
            ...(range !== "today" ? rangeFilter : {}),

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

        [range, rangeFilter, filters],
    );

    const rangedQuery = useAppointments(queryParams, {
        enabled: range !== "today",
    });
    const todaysQuery = useTodaysAppointments(undefined, {
        enabled: range === "today",
    });

    const todaysAppointments = todaysQuery.data?.items ?? [];
    const rangedAppointments = rangedQuery.data?.items ?? [];

    const isLoadingToday = todaysQuery.isLoading;
    const isLoadingRanged = rangedQuery.isLoading;

    // stats
    const todaysStats = todaysQuery.data?.stats;
    const rangedStats = rangedQuery.data?.stats;

    const stats = range === "today" ? todaysStats : rangedStats;

    const {
        data: selectedAppointment,
        isLoading: detailLoading,
        error,
    } = useAppointmentDetail(selectedId);

    useEffect(() => {
        // Clear inspector when switching tabs
        setSelectedId(undefined);
    }, [range]);

    useEffect(() => {
        if (range === "today" && !selectedId && todaysAppointments.length > 0) {
            setSelectedId(todaysAppointments[0].appointment.id);
        }
    }, [range, todaysAppointments, selectedId]);

    const confirmMutation = useConfirmAppointment();
    const checkInMutation = useCheckInAppointment();
    const startMutation = useStartAppointment();
    const completeMutation = useCompleteAppointment();
    const noShowMutation = useMarkNoShow();

    const pendingAction = confirmMutation.isPending || (confirmMutation.isSuccess && todaysQuery.isFetching)
        ? { id: confirmMutation.variables, action: "confirm" as const }
        : checkInMutation.isPending || (checkInMutation.isSuccess && todaysQuery.isFetching)
            ? { id: checkInMutation.variables, action: "check_in" as const }
            : startMutation.isPending || (startMutation.isSuccess && todaysQuery.isFetching)
                ? { id: startMutation.variables, action: "start" as const }
                : completeMutation.isPending || (completeMutation.isSuccess && todaysQuery.isFetching)
                    ? { id: completeMutation.variables, action: "complete" as const }
                    : undefined;

    const handleWorkflow = async (
        action: WorkflowAction,
        item: AppointmentItem,
    ) => {
        switch (action) {
            case "confirm":
                await confirmMutation.mutateAsync(item.id);
                break;
            case "check_in":
                await checkInMutation.mutateAsync(item.id);
                break;
            case "start":
                await startMutation.mutateAsync(item.id);
                router.push(`/appointments/${item.id}/encounter`);
                break;
            case "complete":
                await completeMutation.mutateAsync(item.id);
                break;
            case "open":
                router.push(`/appointments/${item.id}/encounter`);
                break;
        }
    };
    const handleSecondaryAction = (
        action: "reschedule" | "follow_up" | "no_show",
        item: TodaysAppointmentListItem,
    ) => {
        const a = item.appointment;

        if (action === "reschedule") {
            setRescheduleTarget({
                id: a.id,
                assigned_doctor_id: a.assigned_doctor_id,
            });
        }
        if (action === "follow_up") setFollowUpTarget(a.id);
        if (action === "no_show") setNoShowTarget(a.id);
    };

    if (isLoadingRanged) {
        return <SectionLoader message="Fetching appointments...." />;
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
        <>
            <div className="space-y-6 max-w-[1600px] mx-auto w-full p-1">
                <PageHeader
                    title="Appointment Management"
                    description={`Active Operations Queue • Last synchronized: Just now`}
                    icon={CalendarDays}
                    actions={headerActions}
                />

                {/* Top Analytics Stats Grid */}
                <VisitFlowStats data={stats} />

                {range !== "today" && (
                    <FilterPanel
                        fields={appointmentFilters}
                        values={filters}
                        onChange={update}
                        onReset={reset}
                    />
                )}

                {range === "today" ? (
                    <QueueLayout
                        queue={
                            <AppointmentQueue
                                appointments={todaysAppointments}
                                selectedId={selectedId}
                                loading={isLoadingToday}
                                onSelect={(a) => setSelectedId(a.appointment.id)}
                                onAction={(item) =>
                                    handleWorkflow(getPrimaryWorkflowAction(item.appointment.status), { id: item.appointment.id })
                                }
                                onSecondaryAction={handleSecondaryAction}
                                pendingId={pendingAction?.id}
                            />
                        }
                        workflow={
                            <VisitWorkflowPanel
                                appointment={selectedAppointment}
                                loading={detailLoading}
                                onAction={handleWorkflow}
                                onSecondaryAction={(action, appointment) => {
                                    if (action === "reschedule") {
                                        setRescheduleTarget({
                                            id: appointment.id,
                                            assigned_doctor_id: appointment.assigned_doctor_id,
                                        });
                                    }
                                    if (action === "follow_up") setFollowUpTarget(appointment.id);
                                    if (action === "no_show") setNoShowTarget(appointment.id);
                                }}
                                pendingAction={
                                    pendingAction?.id === selectedAppointment?.id
                                        ? pendingAction?.action
                                        : undefined
                                }
                            />
                        }
                    />
                )
                : (
                    <AppointmentTable
                        appointments={rangedAppointments}
                        stats={rangedQuery.data?.stats}
                        isLoading={isLoadingRanged}
                        range={range}
                    />
                )}
            </div>
            <RescheduleDialog
                appointmentId={rescheduleTarget?.id}
                currentDoctorId={rescheduleTarget?.assigned_doctor_id ?? undefined}
                open={!!rescheduleTarget}
                onOpenChange={(open) => !open && setRescheduleTarget(undefined)}
            />

            <FollowUpDialog
                appointmentId={followUpTarget}
                open={!!followUpTarget}
                onOpenChange={(open) => !open && setFollowUpTarget(undefined)}
            />

            <AlertDialog
                open={!!noShowTarget}
                onOpenChange={(open) => !open && setNoShowTarget(undefined)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Mark as No-Show?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will mark the appointment as a no-show and remove it from the
                            active queue. This can't easily be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                if (noShowTarget)
                                    await noShowMutation.mutateAsync(noShowTarget);
                                setNoShowTarget(undefined);
                            }}
                        >
                            Confirm No-Show
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default AppointmentsPage;
