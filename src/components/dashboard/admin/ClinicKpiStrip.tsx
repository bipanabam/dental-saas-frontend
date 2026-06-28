import { useMemo } from "react";
import {
    Users, CheckCircle2, Clock, CreditCard,
    Stethoscope, AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

import type { AppointmentStats } from "@/lib/api";

export interface ClinicKpi {
    id: string;
    label: string;
    value: string | number;
    sub?: string;
    icon: React.ElementType;
    tone: "neutral" | "ok" | "warn" | "danger" | "brand";
}

const TONE: Record<ClinicKpi["tone"], { icon: string; value: string; bg: string }> = {
    neutral: { icon: "text-slate-400", value: "text-slate-800", bg: "bg-slate-50" },
    ok: { icon: "text-emerald-500", value: "text-slate-800", bg: "bg-emerald-50" },
    warn: { icon: "text-amber-500", value: "text-slate-800", bg: "bg-amber-50" },
    danger: { icon: "text-rose-500", value: "text-slate-800", bg: "bg-rose-50" },
    brand: { icon: "text-brand-600", value: "text-slate-800", bg: "bg-brand-50" },
};


function KpiTile({ label, value, sub, icon: Icon, tone }: Omit<ClinicKpi, "id">) {
    const t = TONE[tone];
    return (
        <div className="flex items-center gap-3 px-4 py-3.5 bg-white rounded-xl border border-slate-100">
            <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0", t.bg)}>
                <Icon className={cn("h-4 w-4", t.icon)} />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 truncate">
                    {label}
                </p>
                <div className="flex items-baseline gap-1.5">
                    <span className={cn("text-xl font-black font-mono leading-none tracking-tight", t.value)}>
                        {value}
                    </span>
                    {sub && (
                        <span className="text-[10px] text-slate-400 font-semibold">{sub}</span>
                    )}
                </div>
            </div>
        </div>
    );
}

interface ClinicKpiStripProps {
    /** From GET /appointments/today -> stats */
    appointmentStats?: AppointmentStats;
    /** Average estimated_wait_mins across today's WAITING queue items */
    avgWaitMins?: number;
    /** Active encounters count -> from EncounterListResponse.active_count */
    activeEncounterCount?: number;
    /** Encounters with pending investigations (has_investigation=true, status=IN_PROGRESS) */
    pendingInvestigationCount?: number;
    /** Total staff from GET /users/summary */
    totalDoctors?: number;
    /** Doctors currently IN_PROGRESS (derived from appointments/today) */
    activeDoctors?: number;
    isLoading?: boolean;
}

export default function ClinicKpiStrip({
    appointmentStats,
    avgWaitMins,
    activeEncounterCount,
    pendingInvestigationCount,
    totalDoctors,
    activeDoctors,
    isLoading,
}: ClinicKpiStripProps) {
    const kpis: ClinicKpi[] = useMemo(() => {
        const total = appointmentStats?.total ?? 0;
        const completed = appointmentStats?.completed ?? 0;
        const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;

        const utilPct =
            totalDoctors && totalDoctors > 0
                ? Math.round(((activeDoctors ?? 0) / totalDoctors) * 100)
                : null;

        const alertCount = (activeEncounterCount ?? 0) + (pendingInvestigationCount ?? 0);

        return [
            {
                id: "patients_today",
                label: "Patients Today",
                value: total,
                sub: total === 1 ? "patient" : "patients",
                icon: Users,
                tone: "neutral",
            },
            {
                id: "completion",
                label: "Completion",
                value: `${completionPct}%`,
                sub: `${completed} / ${total}`,
                icon: CheckCircle2,
                tone: completionPct >= 80 ? "ok" : completionPct >= 50 ? "warn" : "neutral",
            },
            {
                id: "avg_wait",
                label: "Avg Wait",
                value: avgWaitMins != null ? `${avgWaitMins}m` : "—",
                sub: "queue",
                icon: Clock,
                tone:
                    avgWaitMins == null ? "neutral"
                        : avgWaitMins > 30 ? "danger"
                            : avgWaitMins > 15 ? "warn"
                                : "ok",
            },
            {
                id: "utilisation",
                label: "Dr Utilisation",
                value: utilPct != null ? `${utilPct}%` : "—",
                sub: utilPct != null ? `${activeDoctors}/${totalDoctors} active` : undefined,
                icon: Stethoscope,
                tone:
                    utilPct == null ? "neutral"
                        : utilPct >= 80 ? "ok"
                            : utilPct >= 40 ? "warn"
                                : "neutral",
            },
            {
                id: "open_alerts",
                label: "Open Alerts",
                value: alertCount,
                sub: alertCount === 1 ? "item" : "items",
                icon: AlertTriangle,
                tone: alertCount > 5 ? "danger" : alertCount > 0 ? "warn" : "ok",
            },
            {
                id: "payment_pending",
                label: "Unpaid Appts",
                // Derived from appointment payment_status — no billing API yet.
                // Parent passes this in once appointment list is filtered.
                value: appointmentStats != null ? "—" : "—",
                sub: "billing soon",
                icon: CreditCard,
                tone: "neutral",
            },
        ] satisfies ClinicKpi[];
    }, [
        appointmentStats,
        avgWaitMins,
        activeEncounterCount,
        pendingInvestigationCount,
        totalDoctors,
        activeDoctors,
    ]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-17 rounded-xl bg-slate-100 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {kpis.map((k) => (
                <KpiTile key={k.id} {...k} />
            ))}
        </div>
    );
}