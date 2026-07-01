"use client";

import { useMemo } from "react";
import { format, isToday, isTomorrow, isYesterday, parseISO } from "date-fns";
import { CheckCircle2, Clock3, Hourglass } from "lucide-react";

import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AppointmentRow from "@/components/appointments/shared/AppointmentRow";
import EmptyState from "../shared/EmptyState";

import type { AppointmentListItem } from "@/lib/api";

interface DoctorGroupCardProps {
    doctorId: string;
    doctorLabel: string;
    doctorSpecialization?: string | null;
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
            groups.set(dateKey, { dateKey, dateLabel: dateLabelFor(apptDate), appointments: [appt] });
        }
    }
    return Array.from(groups.values()).sort((a, b) => a.dateKey.localeCompare(b.dateKey));
}

function initials(label: string) {
    const parts = label.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function DoctorGroupCard({
    doctorId,
    doctorLabel,
    doctorSpecialization,
    appointments,
    onAppointmentClick,
}: DoctorGroupCardProps) {
    const dateGroups = useMemo(() => groupByDate(appointments), [appointments]).reverse();
    const isMultiDay = dateGroups.length > 1;

    const { doneCount, inProgressCount, waitingCount } = useMemo(() => {
        let done = 0, inProgress = 0, waiting = 0;
        for (const a of appointments) {
            if (a.status === "COMPLETED") done++;
            else if (a.status === "IN_PROGRESS" || a.status === "CHECKED_IN") inProgress++;
            else if (a.status === "BOOKED" || a.status === "CONFIRMED") waiting++;
        }
        return { doneCount: done, inProgressCount: inProgress, waitingCount: waiting };
    }, [appointments]);

    return (
        <Card className="overflow-hidden p-0 gap-0">
            <CardHeader className="flex flex-row items-center justify-between gap-3 bg-white border-b border-slate-100 py-3.5 px-4">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                        {initials(doctorLabel)}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-slate-800 truncate">{doctorLabel}</span>
                            {doctorId === UNASSIGNED_KEY && (
                                <Badge variant="outline" className="text-[10px] h-4 px-1.5 shrink-0">
                                    Unassigned
                                </Badge>
                            )}
                        </div>
                        {doctorSpecialization && (
                            <p className="text-[11px] text-slate-400 font-medium truncate">
                                {doctorSpecialization}
                            </p>
                        )}
                        <div className="flex items-center gap-3 mt-0.5">
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                                <CheckCircle2 className="h-3 w-3" /> {doneCount}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-brand-600">
                                <Clock3 className="h-3 w-3" /> {inProgressCount}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600">
                                <Hourglass className="h-3 w-3" /> {waitingCount}
                            </span>
                        </div>
                    </div>
                </div>

                <Badge variant="secondary" className="text-[10px] font-bold shrink-0">
                    {appointments.length} {appointments.length === 1 ? "appt" : "appts"}
                </Badge>
            </CardHeader>

            <div className="max-h-96 overflow-y-auto scrollbar-thin scroll-slate-100">
                {appointments.length === 0 ? (
                    <EmptyState size="sm" title="No appointments" />
                ) : (
                    dateGroups.map((group) => (
                        <div key={group.dateKey}>
                            {isMultiDay && (
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-4 pt-3 pb-1 bg-slate-50/60">
                                    {group.dateLabel}
                                </p>
                            )}

                            {/* Column header */}
                            <div className="grid grid-cols-[28px_56px_1fr_auto] gap-2 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                                <span>#</span>
                                <span>Time</span>
                                <span>Patient</span>
                                <span className="text-right">Status</span>
                            </div>

                            {group.appointments.map((appt, idx) => (
                                <AppointmentRow
                                    key={appt.id}
                                    appointment={appt}
                                    index={idx}
                                    onClick={onAppointmentClick}
                                />
                            ))}
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}