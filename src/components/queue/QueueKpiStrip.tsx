"use client";

import { Clock3, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    waiting: number;
    avgWaitMins: number | null;
    inTreatment: number;
}

export default function QueueKpiStrip({ waiting, avgWaitMins, inTreatment }: Props) {
    return (
        <div className="flex items-center gap-5 sm:gap-7 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 overflow-x-auto">
            <div className="flex items-center gap-2 shrink-0">
                <Clock3 className="h-3.5 w-3.5 text-amber-600" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Waiting Now
                </span>
                <span className="text-sm font-black text-slate-800 tabular-nums">{waiting}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Avg Wait
                </span>
                <span className="text-sm font-black text-slate-800 tabular-nums">
                    {avgWaitMins != null ? `${avgWaitMins}m` : "—"}
                </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <Activity className="h-3.5 w-3.5 text-cyan-600" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    In Treatment
                </span>
                <span className="text-sm font-black text-slate-800 tabular-nums">{inTreatment}</span>
            </div>
        </div>
    );
}