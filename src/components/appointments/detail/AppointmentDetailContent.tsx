"use client";

import { format, parseISO } from "date-fns";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { LucideIcon } from "lucide-react";
import { Edit3, Phone, Stethoscope, FileText, Tag } from "lucide-react";

import { useAppointmentDetail } from "@/hooks/appointments/use-appointments";
import { getStatusConfig, getSourceConfig } from "@/types/appointments";
import { cn } from "@/lib/utils";
import { getDoctorDisplayName } from "@/lib/utils/doctor";

import AppointmentActionBar from "../shared/AppointmentActionBar";

import type { AppointmentListItem } from "@/lib/api";

interface AppointmentDetailContentProps {
    appointment: AppointmentListItem;
}

function DetailRow({
    icon: Icon,
    label,
    value,
}: {
    icon: LucideIcon;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-3 py-2.5">
            <Icon className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
            <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {label}
                </p>
                <p className="text-sm font-medium text-slate-800 wrap-break-word">{value}</p>
            </div>
        </div>
    );
}
export default function AppointmentDetailContent({
    appointment,
}: AppointmentDetailContentProps) {
    const router = useRouter();

    const { data: detail } = useAppointmentDetail(appointment.id);
    const current = detail ?? appointment;

    const apptDate = parseISO(current.appointment_date);
    const statusConfig = getStatusConfig(current.status);
    const sourceConfig = getSourceConfig(current.source);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto px-1">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-100 text-xs text-slate-500">
                    <span className="font-mono text-slate-400">
                        {appointment.patient.patient_code}
                    </span>
                    {appointment.patient.phone && (
                        <>
                            <span className="text-slate-300">•</span>
                            <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {appointment.patient.phone}
                            </span>
                        </>
                    )}
                </div>

                {/* Status + source */}
                <div className="flex items-center gap-2 py-3">
                    <span
                        className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
                            statusConfig.className,
                        )}
                    >
                        <span className="h-1 w-1 rounded-full bg-current" />
                        {statusConfig.label}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                        <span className={cn("h-1.5 w-1.5 rounded-full", sourceConfig.dot)} />
                        {sourceConfig.label}
                    </div>
                </div>

                <Separator />

                <DetailRow
                    icon={Stethoscope}
                    label="Provider"
                    value={getDoctorDisplayName(appointment.doctor)}
                />

                <DetailRow
                    icon={Tag}
                    label="Date & Time"
                    value={format(apptDate, "EEEE, MMM d, yyyy 'at' h:mm a")}
                />

                <DetailRow
                    icon={FileText}
                    label="Type"
                    value={current.appointment_type}
                />

                {current.chief_complaint && (
                    <DetailRow
                        icon={FileText}
                        label="Chief Complaint"
                        value={current.chief_complaint}
                    />
                )}

                <Separator className="my-2" />

                <DetailRow
                    icon={Tag}
                    label="Payment Status"
                    value={current.payment_status}
                />
            </div>

            {/* Footer action */}
            <div className="pt-4 border-t border-slate-100 mt-4 space-y-3">
                <AppointmentActionBar appointment={current} />

                <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => router.push(`/appointments/${current.id}/edit`)}
                >
                    <Edit3 className="h-4 w-4" />
                    Edit Appointment
                </Button>
            </div>
        </div>
    );
}