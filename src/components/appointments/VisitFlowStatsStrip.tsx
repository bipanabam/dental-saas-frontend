"use client";

import { CalendarCheck, BadgeCheck, UserRoundCheck, Activity } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AppointmentStats } from "@/lib/api";

type Props = {
    data?: AppointmentStats;
};

const ITEMS = [
    { key: "booked" as const, label: "Booked", icon: CalendarCheck, tone: "text-slate-500" },
    { key: "confirmed" as const, label: "Confirmed", icon: BadgeCheck, tone: "text-emerald-600" },
    { key: "checked_in" as const, label: "Waiting", icon: UserRoundCheck, tone: "text-amber-600" },
    { key: "in_progress" as const, label: "In Chair", icon: Activity, tone: "text-brand-600" },
];

export default function VisitFlowStatsStrip({ data }: Props) {
    return (
        <div className="flex items-center gap-5 sm:gap-7 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 overflow-x-auto">
            {ITEMS.map(({ key, label, icon: Icon, tone }) => (
                <div key={key} className="flex items-center gap-2 shrink-0">
                    <Icon className={cn("h-3.5 w-3.5", tone)} />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {label}
                    </span>
                    <span className="text-sm font-black text-slate-800 tabular-nums">
                        {data?.[key] ?? 0}
                    </span>
                </div>
            ))}
        </div>
    );
}