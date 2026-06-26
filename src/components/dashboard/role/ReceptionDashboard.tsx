"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    UserPlus, CalendarPlus, Footprints,
    Users, Clock, UserCheck, UserX, Wifi,
} from "lucide-react";
import {
    AlertDialog, AlertDialogContent, AlertDialogHeader,
    AlertDialogTitle, AlertDialogDescription,
    AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";

import KpiStrip, { type KpiCardData } from "@/components/dashboard/shared/KpiStrip";
import DashboardSection from "@/components/dashboard/shared/DashboardSection";
import AppointmentBoard from "@/components/dashboard/shared/AppointmentBoard";
import QueueBoard, { type QueueBoardItem } from "@/components/dashboard/shared/QueueBoard";
import QuickActions, { type QuickAction } from "@/components/dashboard/shared/QuickActions";
import PendingTaskRail from "../shared/PendingTaskRail";
import PatientSelectDialog from "@/components/appointments/PatientSelectDialog";
import WalkInDialog from "../shared/WalkInDialog";
import RescheduleDialog from "@/components/appointments/RescheduleDialog";
import FollowUpDialog from "@/components/appointments/FollowUpDialog";

import { useTodaysAppointments } from "@/hooks/appointments/use-appointments";
import { useCheckInAppointment, useConfirmAppointment, useMarkNoShow } from "@/hooks/appointments/use-appointment-workflow";
import { useTodaysQueue } from "@/hooks/queues/use-queue";
import { useQueueActions } from "@/hooks/queues/use-queue-actions";

import type { AppointmentListItem } from "@/lib/api";

type RescheduleTarget = { id: string; assigned_doctor_id?: string | null };

export default function ReceptionistDashboard() {
    const router = useRouter();

    const [rescheduleTarget, setRescheduleTarget] = useState<RescheduleTarget>();
    const [followUpTarget, setFollowUpTarget] = useState<string>();
    const [noShowTarget, setNoShowTarget] = useState<string>();
    const [bookOpen, setBookOpen] = useState(false);
    const [walkInOpen, setWalkInOpen] = useState(false);


    // Data
    const todaysQuery = useTodaysAppointments();
    const appointments: AppointmentListItem[] =
        todaysQuery.data?.items.map((i) => i.appointment) ?? [];
    const stats = todaysQuery.data?.stats;

    const queueQuery = useTodaysQueue();
    const queueItems: QueueBoardItem[] = useMemo(
        () =>
            (queueQuery.data?.items ?? []).map((q) => ({
                queueId: q.queue.id,
                tokenNumber: q.queue.token_number,
                status: q.queue.status,
                patientName: `${q.appointment.patient.first_name} ${q.appointment.patient.last_name}`,
                doctorName: q.appointment.doctor?.username ?? undefined,
                chiefComplaint: q.appointment.chief_complaint,
            })),
        [queueQuery.data]
    );


    // Mutations
    const confirmMutation = useConfirmAppointment();
    const checkInMutation = useCheckInAppointment();
    const noShowMutation = useMarkNoShow();
    const { callQueue, skipQueue, recallQueue, loading: queueLoading } = useQueueActions();

    // KPIs
    const kpis: KpiCardData[] = useMemo(() => [
        {
            id: "total",
            title: "Scheduled",
            value: stats?.total ?? 0,
            icon: Users,
            iconBg: "bg-slate-100",
            iconColor: "text-slate-600",
        },
        {
            id: "confirmed",
            title: "Confirmed",
            value: stats?.confirmed ?? 0,
            icon: UserCheck,
            iconBg: "bg-sky-50",
            iconColor: "text-sky-600",
        },
        {
            id: "checked_in",
            title: "Checked In",
            value: stats?.checked_in ?? 0,
            icon: Wifi,
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600",
        },
        {
            id: "waiting",
            title: "In Queue",
            value: queueItems.filter((q) => q.status === "WAITING").length,
            icon: Clock,
            iconBg: "bg-amber-50",
            iconColor: "text-amber-600",
        },
        {
            id: "no_shows",
            title: "No Shows",
            value: stats?.no_show ?? 0,
            icon: UserX,
            iconBg: "bg-rose-50",
            iconColor: "text-rose-600",
        },
    ], [stats, queueItems]);


    // Quick actions
    const quickActions: QuickAction[] = [
        {
            key: "book",
            label: "Book Appointment",
            description: "Schedule for existing patient",
            icon: CalendarPlus,
            onClick: () => setBookOpen(true),
            variant: "primary",
        },
        {
            key: "walk_in",
            label: "Walk-in Patient",
            description: "Immediate check-in + token",
            icon: Footprints,
            onClick: () => setWalkInOpen(true),
            variant: "default",
        },
    ];


    // Pending task counts for rail
    const pendingConfirmation = appointments.filter((a) => a.status === "BOOKED");
    const completedToday = appointments.filter((a) => a.status === "COMPLETED");

    return (
        <>
            <div className="space-y-5">

                {/* KPI row */}
                <KpiStrip items={kpis} columns={5} />

                {/* Main operations grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

                    {/* LEFT: Appointment plan (7 cols) */}
                    <div className="lg:col-span-7 space-y-5">
                        <DashboardSection
                            title="Today's Appointments"
                            meta={
                                <span className="text-xs font-mono text-slate-400 tabular-nums">
                                    {appointments.length} scheduled
                                </span>
                            }
                        >
                            <AppointmentBoard
                                items={appointments}
                                loading={todaysQuery.isLoading}
                                checkInPendingId={checkInMutation.variables}
                                onConfirm={async (item) => {
                                    await confirmMutation.mutateAsync(item.id);
                                }}
                                onCheckIn={async (item) => {
                                    await checkInMutation.mutateAsync(item.id);
                                }}
                                confirmPendingId={confirmMutation.variables}
                                secondaryActions={[
                                    {
                                        label: "Reschedule",
                                        onSelect: (item) =>
                                            setRescheduleTarget({ id: item.id, assigned_doctor_id: item.assigned_doctor_id }),
                                        isVisible: (item) =>
                                            !["COMPLETED", "CANCELLED", "CHECKED_IN", "IN_PROGRESS"].includes(item.status),
                                    },
                                    {
                                        label: "Follow-up",
                                        onSelect: (item) => setFollowUpTarget(item.id),
                                        isVisible: (item) => item.status === "COMPLETED",
                                    },
                                    {
                                        label: "Mark No-Show",
                                        variant: "destructive",
                                        onSelect: (item) => setNoShowTarget(item.id),
                                        isVisible: (item) => ["BOOKED", "CONFIRMED"].includes(item.status),
                                    },
                                ]}
                            />
                        </DashboardSection>

                        {/* Queue board: room right now */}
                        <DashboardSection
                            title="Live Queue"
                            meta={
                                <div className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs text-slate-400 font-mono tabular-nums">
                                        {queueItems.filter((q) => q.status === "WAITING").length} waiting
                                    </span>
                                </div>
                            }
                        >
                            <QueueBoard
                                items={queueItems}
                                loading={queueQuery.isLoading}
                                pendingQueueId={queueLoading ? "loading" : undefined}
                                onCall={(item) => callQueue({ path: { queue_id: item.queueId } })}
                                onSkip={(item) => skipQueue({ path: { queue_id: item.queueId } })}
                                onRecall={(item) => recallQueue({ path: { queue_id: item.queueId } })}
                            />
                        </DashboardSection>
                    </div>

                    {/* RIGHT: Actions + task rail (5 cols) */}
                    <div className="lg:col-span-5 space-y-5">
                        <QuickActions actions={quickActions} />

                        <PendingTaskRail
                            pendingConfirmation={pendingConfirmation}
                            completedToday={completedToday}
                            onReschedule={(item) =>
                                setRescheduleTarget({ id: item.id, assigned_doctor_id: item.assigned_doctor_id })
                            }
                            onFollowUp={(item) => setFollowUpTarget(item.id)}
                        />
                    </div>

                </div>
            </div>

            {/* Dialogs */}
            <PatientSelectDialog open={bookOpen} onOpenChange={setBookOpen} />
            <WalkInDialog open={walkInOpen} onOpenChange={setWalkInOpen} />
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
            <AlertDialog open={!!noShowTarget} onOpenChange={(open) => !open && setNoShowTarget(undefined)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Mark as No-Show?</AlertDialogTitle>
                        <AlertDialogDescription>
                            The appointment will be flagged and the slot freed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-rose-600 hover:bg-rose-700"
                            onClick={async () => {
                                if (noShowTarget) await noShowMutation.mutateAsync(noShowTarget);
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
}