"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    CheckCircle2,
    UserRoundCheck,
    PlayCircle,
    Stethoscope,
    XCircle,
    CalendarClock,
    Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
    useConfirmAppointment,
    useCheckInAppointment,
    useStartAppointment,
    useCompleteAppointment,
    useMarkNoShow,
} from "@/hooks/appointments/use-appointment-workflow";

import RescheduleDialog from "@/components/appointments/RescheduleDialog";

import type { AppointmentListItem, AppointmentStatusEnum } from "@/lib/api";

interface AppointmentActionBarProps {
    appointment: AppointmentListItem;
    onActionComplete?: () => void;
}

const PRIMARY_ACTION_CONFIG: Record<string, { label: string; icon: typeof CheckCircle2 }> = {
    BOOKED: { label: "Confirm", icon: CheckCircle2 },
    CONFIRMED: { label: "Check In", icon: UserRoundCheck },
    CHECKED_IN: { label: "Start Encounter", icon: PlayCircle },
    IN_PROGRESS: { label: "Complete Visit", icon: Stethoscope },
};

export default function AppointmentActionBar({
    appointment,
    onActionComplete,
}: AppointmentActionBarProps) {
    const router = useRouter();
    const [noShowOpen, setNoShowOpen] = useState(false);
    const [rescheduleOpen, setRescheduleOpen] = useState(false);

    const confirmMutation = useConfirmAppointment();
    const checkInMutation = useCheckInAppointment();
    const startMutation = useStartAppointment();
    const completeMutation = useCompleteAppointment();
    const noShowMutation = useMarkNoShow();

    const isPending =
        confirmMutation.isPending ||
        checkInMutation.isPending ||
        startMutation.isPending ||
        completeMutation.isPending ||
        noShowMutation.isPending;

    const status = appointment.status as AppointmentStatusEnum;

    if (status === "COMPLETED" || status === "NO_SHOW" || status === "CANCELLED") {
        return null;
    }

    const canReschedule = status === "BOOKED" || status === "CONFIRMED";
    const canNoShow = status === "BOOKED" || status === "CONFIRMED";
    const hasSecondaryRow = canReschedule || canNoShow;

    const primary = PRIMARY_ACTION_CONFIG[status];

    const handlePrimaryClick = () => {
        switch (status) {
            case "BOOKED":
                confirmMutation.mutate(appointment.id);
                break;
            case "CONFIRMED":
                checkInMutation.mutate(appointment.id);
                break;
            case "CHECKED_IN":
                startMutation.mutate(appointment.id, {
                    onSuccess: () => {
                        router.push(`/appointments/${appointment.id}/encounter`);
                    },
                });
                break;
            case "IN_PROGRESS":
                completeMutation.mutate(appointment.id);
                break;
        }
    };

    const primaryMutationPending =
        status === "BOOKED" ? confirmMutation.isPending :
            status === "CONFIRMED" ? checkInMutation.isPending :
                status === "CHECKED_IN" ? startMutation.isPending :
                    status === "IN_PROGRESS" ? completeMutation.isPending :
                        false;

    return (
        <>
            <div className="w-full space-y-2">
                {primary && (
                    <Button
                        className="w-full gap-2"
                        disabled={isPending}
                        onClick={handlePrimaryClick}
                    >
                        {primaryMutationPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <primary.icon className="h-4 w-4" />
                        )}
                        {primary.label}
                    </Button>
                )}

                {hasSecondaryRow && (
                    <div className="grid grid-cols-2 gap-2">
                        {canReschedule && (
                            <Button
                                variant="outline"
                                className="gap-1.5"
                                disabled={isPending}
                                onClick={() => setRescheduleOpen(true)}
                            >
                                <CalendarClock className="h-3.5 w-3.5" />
                                Reschedule
                            </Button>
                        )}

                        {canNoShow && (
                            <AlertDialog open={noShowOpen} onOpenChange={setNoShowOpen}>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                        disabled={isPending}
                                    >
                                        <XCircle className="h-3.5 w-3.5" />
                                        No-Show
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Mark as no-show?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This marks the appointment as a no-show. This can&apos;t be undone from here.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel disabled={noShowMutation.isPending}>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-red-600 hover:bg-red-700"
                                            disabled={noShowMutation.isPending}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                noShowMutation.mutate(appointment.id, {
                                                    onSuccess: () => {
                                                        setNoShowOpen(false);
                                                        onActionComplete?.();
                                                    },
                                                });
                                            }}
                                        >
                                            {noShowMutation.isPending ? "Marking..." : "Mark No-Show"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                )}
            </div>

            <RescheduleDialog
                appointmentId={appointment.id}
                currentDoctorId={appointment.assigned_doctor_id ?? undefined}
                currentStatus={appointment.status as AppointmentStatusEnum}
                open={rescheduleOpen}
                onOpenChange={setRescheduleOpen}
            />
        </>
    );
}