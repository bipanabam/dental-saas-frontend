"use client";

import { useMemo } from "react";

import { Card, CardContent } from "@/components/ui/card";

import DoctorGroupCard from "@/components/appointments/doctor-view/DoctorGroupCard";
import SyncingIndicator from "@/components/appointments/shared/SyncingIndicator";

import type { AppointmentListItem, AppointmentStats } from "@/lib/api";
import { getDoctorDisplayName } from "@/lib/utils/doctor";

interface DoctorGroupedViewProps {
    appointments: AppointmentListItem[];
    stats?: AppointmentStats;
    isLoading?: boolean;
    onAppointmentClick?: (appointment: AppointmentListItem) => void;
}

interface DoctorGroup {
    doctorId: string;
    doctorLabel: string;
    appointments: AppointmentListItem[];
}

const UNASSIGNED_KEY = "unassigned";

function groupByDoctor(appointments: AppointmentListItem[]): DoctorGroup[] {
    const groups = new Map<string, DoctorGroup>();

    for (const appointment of appointments) {
        const doctorId = appointment.assigned_doctor_id ?? UNASSIGNED_KEY;
        const doctorLabel = getDoctorDisplayName(appointment.doctor);

        const existing = groups.get(doctorId);
        if (existing) {
            existing.appointments.push(appointment);
        } else {
            groups.set(doctorId, { doctorId, doctorLabel, appointments: [appointment] });
        }
    }

    for (const group of groups.values()) {
        group.appointments.sort(
            (a, b) =>
                new Date(a.appointment_date).getTime() -
                new Date(b.appointment_date).getTime(),
        );
    }

    return Array.from(groups.values()).sort((a, b) => {
        if (a.doctorId === UNASSIGNED_KEY) return 1;
        if (b.doctorId === UNASSIGNED_KEY) return -1;
        return a.doctorLabel.localeCompare(b.doctorLabel);
    });
}

export default function DoctorGroupedView({
    appointments,
    isLoading = false,
    onAppointmentClick,
}: DoctorGroupedViewProps) {
    const groups = useMemo(() => groupByDoctor(appointments), [appointments]);
    if (isLoading) {
        return <SyncingIndicator message="Loading provider schedules..." />;
    }

    if (groups.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="py-12 text-center text-sm text-slate-500">
                    No appointments to group by doctor.
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {groups.map((group) => (
                <DoctorGroupCard
                    key={group.doctorId}
                    doctorId={group.doctorId}
                    doctorLabel={group.doctorLabel}
                    appointments={group.appointments}
                    onAppointmentClick={onAppointmentClick}
                />
            ))}
        </div>
    );
}