"use client";

import { useMemo, useState } from "react";
import { format, isSameDay, parseISO } from "date-fns";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import CalendarDateNav from "@/components/appointments/doctor-view/calender/CalendarDateNav";
import CurrentTimeLine from "@/components/appointments/doctor-view/calender/CurrentTimeLine";
import { layoutAppointments } from "@/components/appointments/doctor-view/calender/calendar-layout";

import type { AppointmentListItem, AppointmentStats } from "@/lib/api";

interface DoctorCalendarViewProps {
    appointments: AppointmentListItem[];
    stats?: AppointmentStats;
    isLoading?: boolean;
    startHour?: number;
    endHour?: number;
    onAppointmentClick?: (appointment: AppointmentListItem) => void;
}

interface DoctorColumn {
    doctorId: string;
    doctorLabel: string;
    appointments: AppointmentListItem[];
}

const UNASSIGNED_KEY = "unassigned";
const HOUR_HEIGHT = 64;

function buildColumns(appointments: AppointmentListItem[], date: Date): DoctorColumn[] {
    const columns = new Map<string, DoctorColumn>();

    for (const appointment of appointments) {
        const apptDate = parseISO(appointment.appointment_date);
        if (!isSameDay(apptDate, date)) continue;

        const doctorId = appointment.assigned_doctor_id ?? UNASSIGNED_KEY;
        const doctorLabel = appointment.doctor?.email?.split("@")[0] ?? "Unassigned";

        const existing = columns.get(doctorId);
        if (existing) {
            existing.appointments.push(appointment);
        } else {
            columns.set(doctorId, { doctorId, doctorLabel, appointments: [appointment] });
        }
    }

    return Array.from(columns.values()).sort((a, b) => {
        if (a.doctorId === UNASSIGNED_KEY) return 1;
        if (b.doctorId === UNASSIGNED_KEY) return -1;
        return a.doctorLabel.localeCompare(b.doctorLabel);
    });
}

function hourLabel(hour: number): string {
    const period = hour < 12 ? "AM" : "PM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour} ${period}`;
}

const STATUS_STYLES: Record<string, string> = {
    BOOKED: "bg-sky-50 border-sky-300 text-sky-900",
    CONFIRMED: "bg-emerald-50 border-emerald-300 text-emerald-900",
    CHECKED_IN: "bg-amber-50 border-amber-300 text-amber-900",
    IN_PROGRESS: "bg-violet-50 border-violet-300 text-violet-900",
    COMPLETED: "bg-slate-100 border-slate-300 text-slate-600",
    NO_SHOW: "bg-rose-50 border-rose-200 text-rose-700 opacity-70",
    CANCELLED: "bg-rose-50 border-rose-200 text-rose-700 line-through opacity-70",
};

export default function DoctorCalendarView({
    appointments,
    startHour = 8,
    endHour = 20,
    onAppointmentClick,
}: DoctorCalendarViewProps) {
    const [date, setDate] = useState(() => new Date());

    const columns = useMemo(() => buildColumns(appointments, date), [appointments, date]);

    const hours = useMemo(
        () => Array.from({ length: endHour - startHour }, (_, i) => startHour + i),
        [startHour, endHour],
    );

    const gridHeight = hours.length * HOUR_HEIGHT;

    return (
        <div className="space-y-3">
            <CalendarDateNav date={date} onDateChange={setDate} />

            {columns.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="py-12 text-center text-sm text-slate-500">
                        No appointments scheduled for {format(date, "MMMM d, yyyy")}.
                    </CardContent>
                </Card>
            ) : (
                <Card className="overflow-hidden">
                    <div className="flex border-b bg-slate-50">
                        <div className="w-16 shrink-0" />
                        {columns.map((col) => (
                            <div
                                key={col.doctorId}
                                className="flex-1 min-w-45 px-3 py-2.5 border-l text-sm font-semibold text-slate-800 flex items-center justify-between"
                            >
                                <span className="truncate">{col.doctorLabel}</span>
                                <Badge variant="secondary" className="text-[10px] font-bold ml-2">
                                    {col.appointments.length}
                                </Badge>
                            </div>
                        ))}
                    </div>

                    <div className="flex relative overflow-x-auto" style={{ height: gridHeight }}>
                        <div className="w-16 shrink-0 relative">
                            {hours.map((hour) => (
                                <div
                                    key={hour}
                                    className="absolute left-0 right-0 text-[11px] text-slate-400 font-medium px-2 -translate-y-1/2"
                                    style={{ top: (hour - startHour) * HOUR_HEIGHT }}
                                >
                                    {hourLabel(hour)}
                                </div>
                            ))}
                            <CurrentTimeLine
                                date={date}
                                startHour={startHour}
                                endHour={endHour}
                                hourHeight={HOUR_HEIGHT}
                            />
                        </div>

                        {columns.map((col) => {
                            const positioned = layoutAppointments(col.appointments);

                            return (
                                <div key={col.doctorId} className="flex-1 min-w-45 border-l relative">
                                    {hours.map((hour) => (
                                        <div
                                            key={hour}
                                            className="absolute left-0 right-0 border-t border-slate-100"
                                            style={{ top: (hour - startHour) * HOUR_HEIGHT }}
                                        />
                                    ))}

                                    <CurrentTimeLine
                                        date={date}
                                        startHour={startHour}
                                        endHour={endHour}
                                        hourHeight={HOUR_HEIGHT}
                                    />

                                    {positioned.map(({ appointment, lane, laneCount, startMinutes, durationMinutes }) => {
                                        const top = ((startMinutes - startHour * 60) / 60) * HOUR_HEIGHT;
                                        const height = Math.max((durationMinutes / 60) * HOUR_HEIGHT, 28);
                                        const widthPct = 100 / laneCount;
                                        const leftPct = lane * widthPct;
                                        const statusStyle =
                                            STATUS_STYLES[appointment.status] ?? "bg-slate-50 border-slate-300";

                                        return (
                                            <button
                                                key={appointment.id}
                                                type="button"
                                                onClick={() => onAppointmentClick?.(appointment)}
                                                className={cn(
                                                    "absolute rounded-md border px-2 py-1 text-xs shadow-sm text-left overflow-hidden",
                                                    "hover:shadow-md hover:z-10 transition-shadow",
                                                    statusStyle,
                                                )}
                                                style={{
                                                    top,
                                                    height,
                                                    left: `calc(${leftPct}% + 2px)`,
                                                    width: `calc(${widthPct}% - 4px)`,
                                                }}
                                                title={`${appointment.patient.first_name} ${appointment.patient.last_name} — ${format(parseISO(appointment.appointment_date), "h:mm a")}`}
                                            >
                                                <div className="font-semibold truncate">
                                                    {appointment.patient.first_name}{" "}
                                                    {appointment.patient.last_name}
                                                </div>
                                                <div className="text-[10px] opacity-80">
                                                    {format(parseISO(appointment.appointment_date), "h:mm a")}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </Card>
            )}
        </div>
    );
}