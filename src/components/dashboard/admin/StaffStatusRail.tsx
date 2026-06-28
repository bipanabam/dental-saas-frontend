"use client";

import { useRouter } from "next/navigation";

import { Users, UserCheck, UserX, Stethoscope, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import type { StaffSummaryResponse, UserListItem } from "@/lib/api";

interface StatPill {
    label: string;
    value: number;
    icon: React.ElementType;
    tone: "ok" | "warn" | "neutral";
}

const TONE_STYLE: Record<StatPill["tone"], { icon: string; bg: string; value: string }> = {
    ok: { icon: "text-emerald-500", bg: "bg-emerald-50", value: "text-emerald-700" },
    warn: { icon: "text-amber-500", bg: "bg-amber-50", value: "text-amber-700" },
    neutral: { icon: "text-slate-400", bg: "bg-slate-50", value: "text-slate-700" },
};

function StatPillTile({ label, value, icon: Icon, tone }: StatPill) {
    const t = TONE_STYLE[tone];
    return (
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 px-3 py-2.5">
            <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", t.bg)}>
                <Icon className={cn("h-3.5 w-3.5", t.icon)} />
            </div>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                <span className={cn("text-lg font-black font-mono leading-none", t.value)}>
                    {value}
                </span>
            </div>
        </div>
    );
}

// Recent staff activity list
function relativeTime(dt?: string | null): string {
    if (!dt) return "—";
    const diff = Date.now() - new Date(dt).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return "today";
}

interface StaffStatusRailProps {
    summary?: StaffSummaryResponse;
    /** Recent staff -> from GET /users/ list, sorted by last_active_at */
    recentUsers?: UserListItem[];
    isLoading?: boolean;
}

export default function StaffStatusRail({
    summary,
    recentUsers = [],
    isLoading,
}: StaffStatusRailProps) {
    const router = useRouter();
    if (isLoading) {
        return (
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-14 rounded-xl bg-slate-100 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    const pills: StatPill[] = [
        {
            label: "Total Staff",
            value: summary?.total ?? 0,
            icon: Users,
            tone: "neutral",
        },
        {
            label: "Active",
            value: summary?.active ?? 0,
            icon: UserCheck,
            tone: (summary?.active ?? 0) > 0 ? "ok" : "neutral",
        },
        {
            label: "Doctors",
            value: summary?.doctors ?? 0,
            icon: Stethoscope,
            tone: "neutral",
        },
        {
            label: "Inactive",
            value: summary?.inactive ?? 0,
            icon: UserX,
            tone: (summary?.inactive ?? 0) > 0 ? "warn" : "neutral",
        },
    ];

    // Staff seen in the last 30 minutes
    const online = recentUsers.filter((u) => {
        if (!u.last_active_at) return false;
        return Date.now() - new Date(u.last_active_at).getTime() < 30 * 60_000;
    });

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
                {pills.map((p) => (
                    <StatPillTile key={p.label} {...p} />
                ))}
            </div>

            {/* Recently active staff */}
            {recentUsers.length > 0 && (
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">
                        Recent Activity
                    </p>
                    <div className="space-y-0.5">
                        {recentUsers.slice(0, 6).map((u) => {
                            const isOnline = online.some((o) => o.id === u.id);
                            return (
                                <div
                                    key={u.id}
                                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50/60 transition-colors"
                                    onClick={() => router.push(`/staff/${u.id}`)}
                                >
                                    <span
                                        className={cn(
                                            "h-1.5 w-1.5 rounded-full shrink-0",
                                            isOnline ? "bg-emerald-500" : "bg-slate-300"
                                        )}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <span className="text-xs font-semibold text-slate-700 truncate block">
                                            {u.username}
                                        </span>
                                        <span className="text-[10px] text-slate-400">{u.role}</span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 shrink-0">
                                        {relativeTime(u.last_active_at)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}