"use client";

import {
    CalendarCheck,
    BadgeCheck,
    UserRoundCheck,
    Activity,
    ChevronRight,
    Clock,
    UserCheck
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { AppointmentStats } from "@/lib/api";

type Props = {
    data?: AppointmentStats;
};

export default function VisitFlowStats({ data }: Props) {
    const booked = data?.booked ?? 0;
    const confirmed = data?.confirmed ?? 0;
    const checked = data?.checked_in ?? 0;
    const progress = data?.in_progress ?? 0;

    return (
        <div className="space-y-6 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

                {/* PHASE 1: PRE-ARRIVAL ADVANCE SCHEDULING */}
                <div className="lg:col-span-4 space-y-2">
                    <div className="flex items-center gap-1.5 px-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Pre-Arrival Scheduling
                        </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <MiniFlowCard
                            title="Booked Slots"
                            value={booked}
                            icon={CalendarCheck}
                            subtext="Total scheduled"
                        />
                        <MiniFlowCard
                            title="Confirmed"
                            value={confirmed}
                            icon={BadgeCheck}
                            subtext="Ready for arrival"
                            variant="success"
                        />
                    </div>
                </div>

                {/* CONNECTOR */}
                <div className="hidden lg:flex lg:col-span-1 justify-center items-center h-full pt-8">
                    <ChevronRight className="text-slate-400/80 stroke-[1.5] h-5 w-5" />
                </div>

                {/* PHASE 2: ACTIVE CLINIC FLOOR FLOW (Right 7 Columns) */}
                <div className="lg:col-span-7 space-y-2">
                    <div className="flex items-center gap-1.5 px-1">
                        <UserCheck className="h-3.5 w-3.5 text-brand-600" />
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                            Live Active Floor Flow (Real-Time)
                        </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 border border-slate-200 p-2.5 rounded-2xl">
                        {/* The Waiting Room Bottleneck Metric */}
                        <LiveFlowCard
                            title="Waiting In Lobby"
                            value={checked}
                            icon={UserRoundCheck}
                            statusLabel="Needs Chair Assignment"
                            active={checked > 0}
                            colorMode="warning"
                        />

                        {/* The Operatory Chair Metric */}
                        <LiveFlowCard
                            title="In Operatory Chair"
                            value={progress}
                            icon={Activity}
                            statusLabel="Active Treatment"
                            active={progress > 0}
                            colorMode="brand"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}

function MiniFlowCard({
    title,
    value,
    icon: Icon,
    subtext,
    variant = "default",
}: {
    title: string;
    value: number;
    icon: any;
    subtext: string;
    variant?: "default" | "success";
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-3xs flex flex-col justify-between min-h-22.5">
            <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 block truncate">
                    {title}
                </span>
                <Icon className={cn(
                    "h-3.5 w-3.5 shrink-0",
                    variant === "success" ? "text-emerald-500" : "text-slate-400"
                )} />
            </div>
            <div className="mt-2">
                <div className="text-2xl font-black text-slate-800 tracking-tight">{value}</div>
                <p className="text-[10px] font-medium text-slate-400/90 mt-0.5">{subtext}</p>
            </div>
        </div>
    );
}

function LiveFlowCard({
    title,
    value,
    icon: Icon,
    statusLabel,
    active,
    colorMode,
}: {
    title: string;
    value: number;
    icon: any;
    statusLabel: string;
    active: boolean;
    colorMode: "brand" | "warning";
}) {
    return (
        <div
            className={cn(
                "rounded-xl border p-4 transition-all flex items-center justify-between bg-white",
                active && colorMode === "warning" && "border-amber-300 ring-2 ring-amber-500/5 shadow-xs",
                active && colorMode === "brand" && "border-brand-500 ring-2 ring-brand-500/5 shadow-xs",
                (!active || value === 0) && "border-slate-200 opacity-75"
            )}
        >
            <div className="space-y-1">
                <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider block",
                    active && colorMode === "warning" && "text-amber-800",
                    active && colorMode === "brand" && "text-brand-800",
                    (!active || value === 0) && "text-slate-400"
                )}>
                    {title}
                </span>
                <div className="text-3xl font-black text-slate-800 tracking-tight">{value}</div>
                <span className="text-[10px] font-medium text-slate-400 block pt-0.5">
                    {statusLabel}
                </span>
            </div>

            <div
                className={cn(
                    "h-11 w-11 rounded-lg flex items-center justify-center transition-colors shrink-0",
                    active && colorMode === "warning" && "bg-amber-50 text-amber-600",
                    active && colorMode === "brand" && "bg-brand-50 text-brand-700",
                    (!active || value === 0) && "bg-slate-50 text-slate-400"
                )}
            >
                <Icon className="h-5 w-5" />
            </div>
        </div>
    );
}