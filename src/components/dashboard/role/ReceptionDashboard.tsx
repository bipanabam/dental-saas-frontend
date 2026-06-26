"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    AlertDialog, AlertDialogContent, AlertDialogHeader,
    AlertDialogTitle, AlertDialogDescription,
    AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";

import VisitFlowStats from "@/components/appointments/VisitFlowStats";
import AppointmentQueue from "@/components/appointments/AppointmentQueue";
import QueueLayout from "@/components/appointments/QueueLayout";
import VisitWorkflowPanel from "@/components/appointments/VisitWorkFlowPanel";
import RescheduleDialog from "@/components/appointments/RescheduleDialog";
import FollowUpDialog from "@/components/appointments/FollowUpDialog";

import { useTodaysAppointments, useAppointmentDetail } from "@/hooks/appointments/use-appointments";
import {
    useConfirmAppointment, useCheckInAppointment,
    useStartAppointment, useCompleteAppointment, useMarkNoShow,
} from "@/hooks/appointments/use-appointment-workflow";

import { getPrimaryWorkflowAction, type WorkflowAction, type AppointmentItem } from "@/lib/utils/appointment-workflow";
import type { TodaysAppointmentListItem } from "@/lib/api";

type RescheduleTarget = { id: string; assigned_doctor_id?: string | null };

export default function ReceptionistDashboard() {
    const router = useRouter();

    const [selectedId, setSelectedId] = useState<string>();
    const [rescheduleTarget, setRescheduleTarget] = useState<RescheduleTarget>();
    const [followUpTarget, setFollowUpTarget] = useState<string>();
    const [noShowTarget, setNoShowTarget] = useState<string>();

    const todaysQuery = useTodaysAppointments();
    const appointments = todaysQuery.data?.items ?? [];
    const stats = todaysQuery.data?.stats;

    const { data: selectedAppointment, isLoading: detailLoading } =
        useAppointmentDetail(selectedId);

    // Auto-select first appointment
    useEffect(() => {
        if (!selectedId && appointments.length > 0) {
            setSelectedId(appointments[0].appointment.id);
        }
    }, [appointments, selectedId]);

    const confirmMutation = useConfirmAppointment();
    const checkInMutation = useCheckInAppointment();
    const startMutation = useStartAppointment();
    const completeMutation = useCompleteAppointment();
    const noShowMutation = useMarkNoShow();

    const pendingAction =
        confirmMutation.isPending ? { id: confirmMutation.variables, action: "confirm" as const } :
            checkInMutation.isPending ? { id: checkInMutation.variables, action: "check_in" as const } :
                startMutation.isPending ? { id: startMutation.variables, action: "start" as const } :
                    completeMutation.isPending ? { id: completeMutation.variables, action: "complete" as const } :
                        undefined;

    const handleWorkflow = async (action: WorkflowAction, item: AppointmentItem) => {
        switch (action) {
            case "confirm": await confirmMutation.mutateAsync(item.id); break;
            case "check_in": await checkInMutation.mutateAsync(item.id); break;
            case "start":
                await startMutation.mutateAsync(item.id);
                router.push(`/appointments/${item.id}/encounter`);
                break;
            case "complete": await completeMutation.mutateAsync(item.id); break;
            case "open": router.push(`/appointments/${item.id}/encounter`); break;
        }
    };

    const handleSecondaryAction = (
        action: "reschedule" | "follow_up" | "no_show",
        item: TodaysAppointmentListItem
    ) => {
        const a = item.appointment;
        if (action === "reschedule") setRescheduleTarget({ id: a.id, assigned_doctor_id: a.assigned_doctor_id });
        if (action === "follow_up") setFollowUpTarget(a.id);
        if (action === "no_show") setNoShowTarget(a.id);
    };

    return (
        <>
            <div className="space-y-5">
                <VisitFlowStats data={stats} />

                <QueueLayout
                    queue={
                        <AppointmentQueue
                            appointments={appointments}
                            selectedId={selectedId}
                            loading={todaysQuery.isLoading}
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
                                if (action === "reschedule") setRescheduleTarget({ id: appointment.id, assigned_doctor_id: appointment.assigned_doctor_id });
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
            <AlertDialog open={!!noShowTarget} onOpenChange={(open) => !open && setNoShowTarget(undefined)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Mark as No-Show?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will remove the patient from the active queue.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
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



// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import {
//     UserPlus,
//     CalendarPlus,
//     Footprints,
//     ArrowRightLeft,
//     Users,
//     Clock,
//     UserCheck,
//     UserX,
// } from "lucide-react";
// import {
//     AlertDialog, AlertDialogContent, AlertDialogHeader,
//     AlertDialogTitle, AlertDialogDescription,
//     AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
// } from "@/components/ui/alert-dialog";

// import KpiStrip, { type KpiCardData } from "@/components/dashboard/shared/KpiStrip";
// import DashboardSection from "@/components/dashboard/shared/DashboardSection";
// import QueueBoard, { type QueueRow } from "@/components/dashboard/shared/QueueBoard";
// import QuickActions, { type QuickAction } from "@/components/dashboard/shared/QuickActions";
// import TaskRail, { type TaskSection } from "@/components/dashboard/shared/TaskRail";

// import VisitWorkflowPanel from "@/components/appointments/VisitWorkFlowPanel";
// import RescheduleDialog from "@/components/appointments/RescheduleDialog";
// import FollowUpDialog from "@/components/appointments/FollowUpDialog";

// import { useTodaysAppointments, useAppointmentDetail } from "@/hooks/appointments/use-appointments";
// import {
//     useConfirmAppointment, useCheckInAppointment,
//     useStartAppointment, useCompleteAppointment, useMarkNoShow,
// } from "@/hooks/appointments/use-appointment-workflow";

// import { getPrimaryWorkflowAction, type WorkflowAction, type AppointmentItem } from "@/lib/utils/appointment-workflow";
// import { appointmentStatusToStage } from "../stage";
// import type { TodaysAppointmentListItem } from "@/lib/api";

// type RescheduleTarget = { id: string; assigned_doctor_id?: string | null };

// /**
//  * Maps the existing TodaysAppointmentListItem into the generic QueueRow
//  * shape QueueBoard expects. This is the only place that needs to change
//  * if the backend's appointment status strings or list-item fields move.
//  */
// function toQueueRow(
//     item: TodaysAppointmentListItem,
//     pendingId?: string
// ): QueueRow {
//     const a = item.appointment;
//     const q = item.queue;
//     return {
//         id: a.id,
//         // TODO: confirm field name — using scheduled time as displayed "Time" column.
//         time: a.appointment_date ?? "—",
//         patientName: a.patient.first_name ?
//             `${a.patient.first_name} ${a.patient.first_name}`
//             : "Unknown patient",
//         token: item.queue?.token_number,
//         doctorName: a.doctor?.email,
//         stage: appointmentStatusToStage(a.status),
//         reason: a.chief_complaint ?? "Unknown",
//         waitMinutes: 0, // TODO: confirm field name for computed wait time
//         isPending: a.id === pendingId,
//     };
// }

// export default function ReceptionistDashboard() {
//     const router = useRouter();

//     const [selectedId, setSelectedId] = useState<string>();
//     const [rescheduleTarget, setRescheduleTarget] = useState<RescheduleTarget>();
//     const [followUpTarget, setFollowUpTarget] = useState<string>();
//     const [noShowTarget, setNoShowTarget] = useState<string>();
//     const [registerOpen, setRegisterOpen] = useState(false);
//     const [newAppointmentOpen, setNewAppointmentOpen] = useState(false);
//     const [walkInOpen, setWalkInOpen] = useState(false);
//     const [queueTransferOpen, setQueueTransferOpen] = useState(false);

//     const todaysQuery = useTodaysAppointments();
//     const appointments = todaysQuery.data?.items ?? [];
//     const stats = todaysQuery.data?.stats;

//     const { data: selectedAppointment, isLoading: detailLoading } =
//         useAppointmentDetail(selectedId);

//     useEffect(() => {
//         if (!selectedId && appointments.length > 0) {
//             setSelectedId(appointments[0].appointment.id);
//         }
//     }, [appointments, selectedId]);

//     const confirmMutation = useConfirmAppointment();
//     const checkInMutation = useCheckInAppointment();
//     const startMutation = useStartAppointment();
//     const completeMutation = useCompleteAppointment();
//     const noShowMutation = useMarkNoShow();

//     const pendingAction =
//         confirmMutation.isPending ? { id: confirmMutation.variables, action: "confirm" as const } :
//             checkInMutation.isPending ? { id: checkInMutation.variables, action: "check_in" as const } :
//                 startMutation.isPending ? { id: startMutation.variables, action: "start" as const } :
//                     completeMutation.isPending ? { id: completeMutation.variables, action: "complete" as const } :
//                         undefined;

//     const handleWorkflow = async (action: WorkflowAction, item: AppointmentItem) => {
//         switch (action) {
//             case "confirm": await confirmMutation.mutateAsync(item.id); break;
//             case "check_in": await checkInMutation.mutateAsync(item.id); break;
//             case "start":
//                 await startMutation.mutateAsync(item.id);
//                 router.push(`/appointments/${item.id}/encounter`);
//                 break;
//             case "complete": await completeMutation.mutateAsync(item.id); break;
//             case "open": router.push(`/appointments/${item.id}/encounter`); break;
//         }
//     };

//     const handleSecondaryAction = (
//         action: "reschedule" | "follow_up" | "no_show",
//         item: TodaysAppointmentListItem
//     ) => {
//         const a = item.appointment;
//         if (action === "reschedule") setRescheduleTarget({ id: a.id, assigned_doctor_id: a.assigned_doctor_id });
//         if (action === "follow_up") setFollowUpTarget(a.id);
//         if (action === "no_show") setNoShowTarget(a.id);
//     };

//     // ---- Top metrics: Arrived / Waiting / Checked In / No Shows / Walk-ins ----
//     const kpis: KpiCardData[] = useMemo(
//         () => [
//             {
//                 key: "booked",
//                 title: "Booked",
//                 value: stats?.booked ?? 0,
//                 icon: Users,
//                 iconBg: "bg-blue-50",
//                 iconColor: "text-blue-600",
//             },
//             {
//                 key: "waiting",
//                 title: "Waiting",
//                 value: stats?.checked_in ?? 0,
//                 icon: Clock,
//                 iconBg: "bg-amber-50",
//                 iconColor: "text-amber-600",
//             },
//             {
//                 key: "checked_in",
//                 title: "Checked In",
//                 value: stats?.checked_in ?? 0,
//                 icon: UserCheck,
//                 iconBg: "bg-emerald-50",
//                 iconColor: "text-emerald-600",
//             },
//             {
//                 key: "no_shows",
//                 title: "No Shows",
//                 value: stats?.no_show ?? 0,
//                 icon: UserX,
//                 iconBg: "bg-rose-50",
//                 iconColor: "text-rose-600",
//             },
//             {
//                 key: "walk_ins",
//                 title: "Walk-ins",
//                 value: stats?.confirmed ?? 0,
//                 icon: Footprints,
//                 iconBg: "bg-violet-50",
//                 iconColor: "text-violet-600",
//             },
//         ],
//         [stats]
//     );

//     // ---- Queue board rows ----
//     const queueRows: QueueRow[] = useMemo(
//         () => appointments.map((item) => toQueueRow(item, pendingAction?.id)),
//         [appointments, pendingAction?.id]
//     );

//     // ---- Right rail: quick actions ----
//     const quickActions: QuickAction[] = [
//         {
//             key: "register",
//             label: "Register Patient",
//             icon: UserPlus,
//             onClick: () => setRegisterOpen(true),
//             highlighted: true,
//         },
//         {
//             key: "new_appointment",
//             label: "New Appointment",
//             icon: CalendarPlus,
//             onClick: () => setNewAppointmentOpen(true),
//         },
//         {
//             key: "walk_in",
//             label: "Walk-in",
//             icon: Footprints,
//             onClick: () => setWalkInOpen(true),
//         },
//         {
//             key: "queue_transfer",
//             label: "Queue Transfer",
//             icon: ArrowRightLeft,
//             onClick: () => setQueueTransferOpen(true),
//         },
//     ];

//     // ---- Bottom rail: follow-ups ----
//     // TODO: wire to real follow-up/forms endpoints once available — placeholder
//     // structure shown so the section ships with the right shape today.
//     const followUpSections: TaskSection[] = [
//         {
//             key: "pending_confirmation",
//             label: "Pending Confirmation",
//             items: [],
//         },
//         {
//             key: "tomorrow",
//             label: "Tomorrow's Appointments",
//             items: [],
//         },
//         {
//             key: "outstanding_forms",
//             label: "Outstanding Forms",
//             items: [],
//         },
//     ];

//     return (
//         <>
//             <div className="space-y-5">
//                 <KpiStrip items={kpis} columns={5} />

//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
//                     {/* Left: Appointment + Queue board (8 cols) */}
//                     <div className="lg:col-span-8 space-y-5">
//                         <DashboardSection
//                             title="Queue Board"
//                             meta={
//                                 <span className="text-xs font-mono text-slate-400">
//                                     {queueRows.length} in queue
//                                 </span>
//                             }
//                         >
//                             <QueueBoard
//                                 rows={queueRows}
//                                 loading={todaysQuery.isLoading}
//                                 selectedId={selectedId}
//                                 onSelectRow={(row) => setSelectedId(row.id)}
//                                 onPrimaryAction={(row) =>
//                                     handleWorkflow(
//                                         getPrimaryWorkflowAction(
//                                             appointments.find((a) => a.appointment.id === row.id)!
//                                                 .appointment.status
//                                         ),
//                                         { id: row.id }
//                                     )
//                                 }
//                                 primaryActionLabel={(row) => {
//                                     const item = appointments.find((a) => a.appointment.id === row.id);
//                                     if (!item) return "Open";
//                                     const action = getPrimaryWorkflowAction(item.appointment.status);
//                                     return action === "check_in"
//                                         ? "Check In"
//                                         : action === "start"
//                                             ? "Start"
//                                             : action === "complete"
//                                                 ? "Complete"
//                                                 : action === "confirm"
//                                                     ? "Confirm"
//                                                     : "Open";
//                                 }}
//                                 secondaryActions={[
//                                     {
//                                         label: "Reschedule",
//                                         onSelect: (row) => {
//                                             const item = appointments.find((a) => a.appointment.id === row.id);
//                                             if (item) handleSecondaryAction("reschedule", item);
//                                         },
//                                     },
//                                     {
//                                         label: "Follow Up",
//                                         onSelect: (row) => {
//                                             const item = appointments.find((a) => a.appointment.id === row.id);
//                                             if (item) handleSecondaryAction("follow_up", item);
//                                         },
//                                     },
//                                     {
//                                         label: "Mark No-Show",
//                                         variant: "destructive",
//                                         onSelect: (row) => {
//                                             const item = appointments.find((a) => a.appointment.id === row.id);
//                                             if (item) handleSecondaryAction("no_show", item);
//                                         },
//                                     },
//                                 ]}
//                             />
//                         </DashboardSection>

//                         <DashboardSection title="Visit Workflow">
//                             <VisitWorkflowPanel
//                                 appointment={selectedAppointment}
//                                 loading={detailLoading}
//                                 onAction={handleWorkflow}
//                                 onSecondaryAction={(action, appointment) => {
//                                     if (action === "reschedule") setRescheduleTarget({ id: appointment.id, assigned_doctor_id: appointment.assigned_doctor_id });
//                                     if (action === "follow_up") setFollowUpTarget(appointment.id);
//                                     if (action === "no_show") setNoShowTarget(appointment.id);
//                                 }}
//                                 pendingAction={
//                                     pendingAction?.id === selectedAppointment?.id
//                                         ? pendingAction?.action
//                                         : undefined
//                                 }
//                             />
//                         </DashboardSection>
//                     </div>

//                     {/* Right: Quick actions (4 cols) */}
//                     <div className="lg:col-span-4 space-y-5">
//                         <QuickActions actions={quickActions} />
//                     </div>
//                 </div>

//                 {/* Bottom: Follow-ups, full width */}
//                 <TaskRail
//                     title="Follow-ups"
//                     sections={followUpSections}
//                     emptyLabel="No pending follow-ups."
//                 />
//             </div>

//             <RescheduleDialog
//                 appointmentId={rescheduleTarget?.id}
//                 currentDoctorId={rescheduleTarget?.assigned_doctor_id ?? undefined}
//                 open={!!rescheduleTarget}
//                 onOpenChange={(open) => !open && setRescheduleTarget(undefined)}
//             />
//             <FollowUpDialog
//                 appointmentId={followUpTarget}
//                 open={!!followUpTarget}
//                 onOpenChange={(open) => !open && setFollowUpTarget(undefined)}
//             />
//             <AlertDialog open={!!noShowTarget} onOpenChange={(open) => !open && setNoShowTarget(undefined)}>
//                 <AlertDialogContent>
//                     <AlertDialogHeader>
//                         <AlertDialogTitle>Mark as No-Show?</AlertDialogTitle>
//                         <AlertDialogDescription>
//                             This will remove the patient from the active queue.
//                         </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <AlertDialogFooter>
//                         <AlertDialogCancel>Cancel</AlertDialogCancel>
//                         <AlertDialogAction
//                             onClick={async () => {
//                                 if (noShowTarget) await noShowMutation.mutateAsync(noShowTarget);
//                                 setNoShowTarget(undefined);
//                             }}
//                         >
//                             Confirm No-Show
//                         </AlertDialogAction>
//                     </AlertDialogFooter>
//                 </AlertDialogContent>
//             </AlertDialog>

//             {/*
//                 TODO: Register Patient / New Appointment / Walk-in / Queue Transfer
//                 dialogs are stubbed via local `open` state above but not yet wired
//                 to actual dialog components — plug in your existing patient
//                 registration / appointment creation flows here, e.g.:

//                 <RegisterPatientDialog open={registerOpen} onOpenChange={setRegisterOpen} />
//                 <NewAppointmentDialog open={newAppointmentOpen} onOpenChange={setNewAppointmentOpen} />
//                 <WalkInDialog open={walkInOpen} onOpenChange={setWalkInOpen} />
//                 <QueueTransferDialog open={queueTransferOpen} onOpenChange={setQueueTransferOpen} />
//             */}
//         </>
//     );
// }