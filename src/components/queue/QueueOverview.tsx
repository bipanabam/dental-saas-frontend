"use client";

import AnalyticsGrid from "../shared/analytics/AnalyticsGrid";

import {
    Users,
    Clock3,
    Activity,
    CheckCircle2,
} from "lucide-react";

interface Props {
    stats: {
        total: number;
        waiting: number;
        serving: number;
        completed: number;
    };
    isLoading: boolean;

    onRefresh: () => void;
}

const QueueOverview = ({
    stats,
    isLoading
}: Props) => {
    return (
        <AnalyticsGrid>
            {[
                { title: "Total Registered", val: stats.total, icon: Users, border: "border-brand-500", color: "text-brand-700 bg-brand-50" },
                { title: "Waiting Deck", val: stats.waiting, icon: Clock3, border: "border-amber-500", color: "text-amber-700 bg-amber-50" },
                { title: "Active In Rooms", val: stats.serving, icon: Activity, border: "border-cyan-500", color: "text-cyan-700 bg-cyan-50" },
                { title: "Processed Slots", val: stats.completed, icon: CheckCircle2, border: "border-emerald-500", color: "text-emerald-700 bg-emerald-50" },
            ].map((card, i) => (
                <div key={i} className={`bg-white border border-slate-100 shadow-sm p-4 rounded-2xl flex items-center justify-between relative overflow-hidden group border-b-2 ${card.border}`}>
                    <div className="space-y-1">
                        <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">{card.title}</span>
                        <p className="text-2xl font-black text-slate-900 leading-none">{card.val}</p>
                    </div>
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${card.color}`}>
                        <card.icon className="h-5 w-5 stroke-[2.5]" />
                    </div>
                </div>
            ))}
        </AnalyticsGrid>
    );
}

export default QueueOverview;