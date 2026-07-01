"use client";

import { useMemo, useState } from "react";
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    isToday,
    parseISO,
    startOfMonth,
    startOfWeek,
    subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { getStatusConfig } from "@/types/appointments";

import DayAgendaSheet from "@/components/appointments/calendar-view/DayAgendaSheet";

import type { AppointmentListItem } from "@/lib/api";

interface MonthCalendarViewProps {
    appointments: AppointmentListItem[];
    onAppointmentClick?: (appointment: AppointmentListItem) => void;
    onRequestBooking?: (date: Date) => void;
    isFetching?: boolean;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_VISIBLE_PER_DAY = 3;

const STATUS_LEGEND_ORDER = [
    "BOOKED",
    "CONFIRMED",
    "CHECKED_IN",
    "IN_PROGRESS",
    "COMPLETED",
    "NO_SHOW",
    "CANCELLED",
] as const;
import StatusLegend from "./StatusLegend";

export default function MonthCalendarView({
    appointments,
    onAppointmentClick,
    onRequestBooking,
    isFetching = false,
}: MonthCalendarViewProps) {
    const [monthAnchor, setMonthAnchor] = useState(() => new Date());
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);

    const days = useMemo(() => {
        const monthStart = startOfMonth(monthAnchor);
        const monthEnd = endOfMonth(monthAnchor);
        const gridStart = startOfWeek(monthStart);
        const gridEnd = endOfWeek(monthEnd);
        return eachDayOfInterval({ start: gridStart, end: gridEnd });
    }, [monthAnchor]);

    const appointmentsByDay = useMemo(() => {
        const map = new Map<string, AppointmentListItem[]>();
        for (const appt of appointments) {
            const key = format(parseISO(appt.appointment_date), "yyyy-MM-dd");
            const existing = map.get(key);
            if (existing) {
                existing.push(appt);
            } else {
                map.set(key, [appt]);
            }
        }
        for (const list of map.values()) {
            list.sort(
                (a, b) =>
                    new Date(a.appointment_date).getTime() -
                    new Date(b.appointment_date).getTime(),
            );
        }
        return map;
    }, [appointments]);

    const selectedDayAppointments = selectedDay
        ? appointmentsByDay.get(format(selectedDay, "yyyy-MM-dd")) ?? []
        : [];

    return (
        <>
            <Card className="overflow-hidden">
                {isFetching && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand-100 overflow-hidden z-10">
                        <div className="h-full w-1/3 bg-brand-600 animate-[shimmer_1.2s_ease-in-out_infinite]" />
                    </div>
                )}
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setMonthAnchor((d) => subMonths(d, 1))}
                            aria-label="Previous month"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setMonthAnchor((d) => addMonths(d, 1))}
                            aria-label="Next month"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>

                    <h3 className="text-sm font-bold text-slate-800">
                        {format(monthAnchor, "MMMM yyyy")}
                    </h3>
                    <StatusLegend
                        order={STATUS_LEGEND_ORDER}
                        className="sm:ml-auto mr-3"
                    />

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs font-semibold"
                        onClick={() => setMonthAnchor(new Date())}
                    >
                        Today
                    </Button>
                </div>

                <div className="grid grid-cols-7 border-b bg-slate-50">
                    {WEEKDAY_LABELS.map((label) => (
                        <div
                            key={label}
                            className="py-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400"
                        >
                            {label}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7">
                    {days.map((day) => {
                        const key = format(day, "yyyy-MM-dd");
                        const dayAppointments = appointmentsByDay.get(key) ?? [];
                        const visible = dayAppointments.slice(0, MAX_VISIBLE_PER_DAY);
                        const overflowCount = dayAppointments.length - visible.length;
                        const inCurrentMonth = isSameMonth(day, monthAnchor);
                        const isEmpty = dayAppointments.length === 0;

                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => {
                                    if (isEmpty) {
                                        if (inCurrentMonth) onRequestBooking?.(day);
                                    } else {
                                        setSelectedDay(day);
                                    }
                                }}
                                className={cn(
                                    "min-h-22.5 border-b border-r p-1.5 text-left flex flex-col gap-1 transition-colors",
                                    "hover:bg-slate-50 disabled:cursor-default",
                                    !inCurrentMonth && "bg-slate-50/50",
                                    isEmpty && !inCurrentMonth && "cursor-default",
                                )}
                            >
                                <div className="flex items-center justify-between">
                                <span
                                    className={cn(
                                        "h-5 w-5 flex items-center justify-center rounded-full text-[11px] font-bold",
                                        isToday(day) && "bg-brand-700 text-white",
                                        !isToday(day) && inCurrentMonth && "text-slate-700",
                                        !inCurrentMonth && "text-slate-300",
                                    )}
                                >
                                    {format(day, "d")}
                                </span>
                                {isEmpty && inCurrentMonth && (
                                    <Plus className="h-3.5 w-3.5 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:text-brand-600 transition-opacity" />
                                )}
                                </div>

                                <div className="flex flex-col gap-0.5">
                                    {visible.map((appt) => (
                                        <div
                                            key={appt.id}
                                            className="flex items-center gap-1 text-[10px] font-medium text-slate-600 truncate"
                                        >
                                            <span
                                                className={cn(
                                                    "h-1.5 w-1.5 rounded-full shrink-0",
                                                    getStatusConfig(appt.status).dot,
                                                )}
                                            />
                                            <span className="truncate">
                                                {appt.patient.first_name} {appt.patient.last_name}
                                            </span>
                                        </div>
                                    ))}
                                    {overflowCount > 0 && (
                                        <span className="text-[10px] font-semibold text-brand-600">
                                            +{overflowCount} more
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </Card>

            <DayAgendaSheet
                day={selectedDay}
                appointments={selectedDayAppointments}
                onOpenChange={(open) => {
                    if (!open) setSelectedDay(null);
                }}
                onAppointmentClick={onAppointmentClick}
                onRequestBooking={onRequestBooking}
            />
        </>
    );
}