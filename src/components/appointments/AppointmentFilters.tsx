"use client";

import { RotateCcw, Filter } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import DateRangeFilter from "@/components/shared/DateRangeFilter";
import { useDoctors } from "@/hooks/users/use-doctors";
import type { AppointmentFilters } from "./types/appointment-filter";

type Props = {
    filters: AppointmentFilters;
    onChange: (value: AppointmentFilters) => void;
};

export default function AppointmentFilters({ filters, onChange }: Props) {
    const { data: doctorsData } = useDoctors();
    const doctors = (doctorsData as any)?.items ?? doctorsData ?? [];

    const update = (key: keyof AppointmentFilters, value: any) => {
        onChange({
            ...filters,
            [key]: value,
        });
    };

    const reset = () => onChange({});
    const activeCount = Object.values(filters).filter(Boolean).length;

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
            <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex gap-2">
                    <div className="items-center gap-1.5 px-1 text-slate-400 select-none hidden sm:flex">
                        <Filter className="h-3.5 w-3.5" />
                        <span className="text-[11px] font-bold uppercase tracking-wider font-mono">Filters:</span>
                    </div>
                    {/* Filter Reset Trigger */}
                    {activeCount > 0 && (
                        <Button
                            variant="ghost"
                            onClick={reset}
                            className="h-9 px-3 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg gap-1.5 ml-auto transition-all"
                        >
                            <RotateCcw className="h-3 w-3" />
                            <span>Reset ({activeCount})</span>
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-5 items-center gap-2.5">
                {/* Date Range Filter */}
                <div className="min-w-60">
                    <DateRangeFilter
                        label="Schedule Window"
                        startValue={filters.date_start}
                        endValue={filters.date_end}
                        onChange={(start, end) =>
                            onChange({
                                ...filters,
                                date_start: start,
                                date_end: end,
                            })
                        }
                    />
                </div>

                {/* Status */}
                <Select
                    value={filters.status ?? "ALL"}
                    onValueChange={(v) => update("status", v === "ALL" ? undefined : v)}
                >
                    <SelectTrigger className="w-40 h-9 text-xs font-medium border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors focus:ring-1 focus:ring-brand-500">
                        <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                        <SelectItem value="ALL" className="text-slate-500 font-medium">All Statuses</SelectItem>
                        <SelectItem value="BOOKED">Booked</SelectItem>
                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                        <SelectItem value="CHECKED_IN">Checked In</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="NO_SHOW">No Show</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                </Select>

                {/* Source */}
                <Select
                    value={filters.source ?? "ALL"}
                    onValueChange={(v) => update("source", v === "ALL" ? undefined : v)}
                >
                    <SelectTrigger className="w-40 h-9 text-xs font-medium border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors focus:ring-1 focus:ring-brand-500">
                        <SelectValue placeholder="All Sources" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                        <SelectItem value="ALL" className="text-slate-500 font-medium">All Sources</SelectItem>
                        <SelectItem value="ONLINE">Online Portal</SelectItem>
                        <SelectItem value="PHONE">Phone Call</SelectItem>
                        <SelectItem value="WALK_IN">Walk-In</SelectItem>
                        <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                        <SelectItem value="INSTAGRAM">Instagram</SelectItem>
                        <SelectItem value="FRONT_DESK">Front Desk</SelectItem>
                    </SelectContent>
                </Select>

                {/* Type */}
                <Select
                    value={filters.appointment_type ?? "ALL"}
                    onValueChange={(v) => update("appointment_type", v === "ALL" ? undefined : v)}
                >
                    <SelectTrigger className="w-40 h-9 text-xs font-medium border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors focus:ring-1 focus:ring-brand-500">
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                        <SelectItem value="ALL" className="text-slate-500 font-medium">All Types</SelectItem>
                        <SelectItem value="BOOKED">Standard Booking</SelectItem>
                        <SelectItem value="WALK_IN">Walk-In Urgent</SelectItem>
                        <SelectItem value="FOLLOW_UP">Clinical Follow-Up</SelectItem>
                        <SelectItem value="RESCHEDULED">Rescheduled</SelectItem>
                    </SelectContent>
                </Select>

                {/* Assigned Clinical Operator */}
                <Select
                    value={filters.doctor_id ?? "ALL"}
                    onValueChange={(v) => update("doctor_id", v === "ALL" ? undefined : v)}
                >
                    <SelectTrigger className="w-48 h-9 text-xs font-medium border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors focus:ring-1 focus:ring-brand-500">
                        <SelectValue placeholder="All Doctors" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                        <SelectItem value="ALL" className="text-slate-500 font-medium">All Doctors</SelectItem>
                        {doctors.map((d: any) => (
                            <SelectItem key={d.id} value={d.id}>
                                {d.username ?? d.email}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                </div>

            </div>
        </div>
    );
}