"use client";

import { useMemo } from "react";
import { format, isToday, isTomorrow, isYesterday, parseISO } from "date-fns";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import AppointmentCompactCard from "@/components/appointments/doctor-view/AppointmentCompactCard";

import type { AppointmentListItem } from "@/lib/api";

interface DoctorGroupCardProps {
    doctorId: string;
    doctorLabel: string;
    appointments: AppointmentListItem[];
    onAppointmentClick?: (appointment: AppointmentListItem) => void;
}

interface DateGroup {
    dateKey: string;
    dateLabel: string;
    appointments: AppointmentListItem[];
}

const UNASSIGNED_KEY = "unassigned";

function dateLabelFor(date: Date): string {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEE, MMM d");
}

function groupByDate(appointments: AppointmentListItem[]): DateGroup[] {
    const groups = new Map<string, DateGroup>();

    for (const appt of appointments) {
        const apptDate = parseISO(appt.appointment_date);
        const dateKey = format(apptDate, "yyyy-MM-dd");

        const existing = groups.get(dateKey);
        if (existing) {
            existing.appointments.push(appt);
        } else {
            groups.set(dateKey, {
                dateKey,
                dateLabel: dateLabelFor(apptDate),
                appointments: [appt],
            });
        }
    }

    // Appointments arrive pre-sorted by time within a doctor; date groups
    // just need to preserve chronological order of the keys themselves.
    return Array.from(groups.values()).sort((a, b) =>
        a.dateKey.localeCompare(b.dateKey),
    );
}

export default function DoctorGroupCard({
    doctorId,
    doctorLabel,
    appointments,
    onAppointmentClick,
}: DoctorGroupCardProps) {
    const dateGroups = useMemo(() => groupByDate(appointments), [appointments]).reverse();
    const isMultiDay = dateGroups.length > 1;

    return (
        <Card className="overflow-hidden p-0">
            <CardHeader className="flex flex-row items-center justify-between bg-slate-50 border-b py-3 pt-3">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">{doctorLabel}</span>
                    {doctorId === UNASSIGNED_KEY && (
                        <Badge variant="outline" className="text-xs">
                            Needs assignment
                        </Badge>
                    )}
                </div>
                <Badge variant="secondary" className="text-xs font-bold">
                    {appointments.length}{" "}
                    {appointments.length === 1 ? "appt" : "appts"}
                </Badge>
            </CardHeader>

            <CardContent className="p-3 max-h-80 overflow-y-scroll">
                {appointments.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">
                        No appointments
                    </p>
                ) : (
                    <div className="space-y-4">
                        {dateGroups.map((group) => (
                            <div key={group.dateKey}>
                                {isMultiDay && (
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
                                        {group.dateLabel}
                                    </p>
                                )}
                                <div className="space-y-0">
                                    {group.appointments.map((appt) => (
                                        <AppointmentCompactCard
                                            key={appt.id}
                                            appointment={appt}
                                            onClick={onAppointmentClick}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}