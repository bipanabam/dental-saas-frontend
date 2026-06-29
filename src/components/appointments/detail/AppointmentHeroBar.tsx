import { useRouter } from "next/navigation";
import {
    Loader2, Play, UserCheck, CheckCircle2,
    FolderOpen, CalendarClock, Ban,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/dashboard/shared/StatusBadge";
import { getAppointmentStageStyle } from "@/components/dashboard/stage";
import { getStatusConfig } from "@/types/appointments";

import {
    useConfirmAppointment,
    useCheckInAppointment,
    useStartAppointment,
    useCompleteAppointment,
} from "@/hooks/appointments/use-appointment-workflow";

import type { AppointmentDetail } from "@/lib/api";

// Helpers
function fmt(dt?: string | null) {
    if (!dt) return null;
    return new Date(dt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function fmtDate(dt?: string | null) {
    if (!dt) return null;
    return new Date(dt).toLocaleDateString(undefined, {
        weekday: "short", month: "short", day: "numeric",
    });
}

// Primary action button per lifecycle stage
interface ActionButtonProps {
    appointment: AppointmentDetail;
    onStart: () => Promise<void>;
}

function PrimaryAction({ appointment, onStart }: ActionButtonProps) {
    const router = useRouter();
    const confirm = useConfirmAppointment();
    const checkIn = useCheckInAppointment();
    const start = useStartAppointment();
    const complete = useCompleteAppointment();

    const id = appointment.id;

    switch (appointment.status) {
        case "BOOKED":
            return (
                <Button
                    className="bg-brand-700 hover:bg-brand-800 rounded-xl gap-2 h-9"
                    onClick={() => confirm.mutateAsync(id)}
                    disabled={confirm.isPending}
                >
                    {confirm.isPending
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <UserCheck className="h-3.5 w-3.5" />}
                    Confirm
                </Button>
            );

        case "CONFIRMED":
            return (
                <Button
                    className="bg-brand-700 hover:bg-brand-800 rounded-xl gap-2 h-9"
                    onClick={() => checkIn.mutateAsync(id)}
                    disabled={checkIn.isPending}
                >
                    {checkIn.isPending
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <UserCheck className="h-3.5 w-3.5" />}
                    Check In
                </Button>
            );

        case "CHECKED_IN":
            return (
                <Button
                    className="bg-brand-700 hover:bg-brand-800 rounded-xl gap-2 h-9"
                    onClick={onStart}
                    disabled={start.isPending}
                >
                    {start.isPending
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <Play className="h-3.5 w-3.5" />}
                    Start Encounter
                </Button>
            );

        case "IN_PROGRESS":
            return (
                <div className="flex items-center gap-2">
                    <Button
                        className="bg-indigo-600 hover:bg-indigo-700 rounded-xl gap-2 h-9"
                        onClick={() => router.push(`/appointments/${id}/encounter`)}
                    >
                        <FolderOpen className="h-3.5 w-3.5" />
                        Open Workspace
                    </Button>
                    <Button
                        variant="outline"
                        className="rounded-xl gap-2 h-9 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                        onClick={() => complete.mutateAsync(id)}
                        disabled={complete.isPending}
                    >
                        {complete.isPending
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : <CheckCircle2 className="h-3.5 w-3.5" />}
                        Complete Visit
                    </Button>
                </div>
            );

        case "COMPLETED":
            return (
                <Button
                    variant="outline"
                    className="rounded-xl gap-2 h-9"
                    onClick={() => router.push(`/appointments/${id}/encounter`)}
                >
                    <FolderOpen className="h-3.5 w-3.5" />
                    View Encounter
                </Button>
            );

        case "CANCELLED":
        case "NO_SHOW":
            return (
                <Button
                    variant="outline"
                    className="rounded-xl gap-2 h-9"
                    onClick={() => router.push(`/appointments/new?patientId=${appointment.patient_id}`)}
                >
                    <CalendarClock className="h-3.5 w-3.5" />
                    Rebook
                </Button>
            );

        default:
            return null;
    }
}

// Hero bar
interface AppointmentHeroBarProps {
    appointment: AppointmentDetail;
    onStart: () => Promise<void>;
}

export default function AppointmentHeroBar({ appointment, onStart }: AppointmentHeroBarProps) {
    const initials = `${appointment.patient?.first_name?.[0] ?? ""}${appointment.patient?.last_name?.[0] ?? ""}`.toUpperCase();
    const patientName = `${appointment.patient?.first_name ?? ""} ${appointment.patient?.last_name ?? ""}`.trim();
    const apptTime = fmt(appointment.appointment_date);
    const apptDate = fmtDate(appointment.appointment_date);

    // Summary line under patient name
    const summaryParts = [
        appointment.chief_complaint,
        apptDate,
        apptTime && `${apptTime}`,
        appointment.duration_minutes ? `${appointment.duration_minutes} min` : null,
    ].filter(Boolean);

    return (
        <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">

                {/* Left: identity */}
                <div className="flex items-center gap-4 min-w-0">
                    {/* Avatar */}
                    <div className="h-12 w-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-base font-black text-brand-700 uppercase shrink-0">
                        {initials || "?"}
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <h1 className="text-base font-black text-slate-800">
                                {patientName || "Unknown Patient"}
                            </h1>
                            <StatusBadge
                                status={getAppointmentStageStyle(appointment.status)}
                                className="text-[10px]"
                            />
                            {/* Payment status pill — only if not PAID */}
                            {appointment.payment_status && appointment.payment_status !== "PAID" && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                                    {appointment.payment_status.replace(/_/g, " ")}
                                </span>
                            )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                            {summaryParts.join(" · ")}
                        </p>
                        {appointment.doctor?.email && (
                            <p className="text-[11px] text-slate-500 mt-0.5">
                                <span className="text-slate-400">Dr.</span>{" "}
                                {appointment.doctor.email}
                            </p>
                        )}
                    </div>
                </div>

                {/* Right: primary action */}
                <div className="shrink-0">
                    <PrimaryAction appointment={appointment} onStart={onStart} />
                </div>
            </div>
        </div>
    );
}