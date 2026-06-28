import { useRouter } from "next/navigation";
import { AlertTriangle, Clock, FileX, FlaskConical, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

import type { EncounterListItem, TodaysAppointmentListItem } from "@/lib/api";

// Alert types
type AlertSeverity = "critical" | "warning" | "info";

interface Alert {
    id: string;
    section: "clinical" | "operations";
    severity: AlertSeverity;
    icon: React.ElementType;
    title: string;
    detail?: string;
    href?: string;
}

const SEVERITY_STYLE: Record<AlertSeverity, { row: string; icon: string; dot: string }> = {
    critical: { row: "hover:bg-rose-50/50", icon: "text-rose-500", dot: "bg-rose-500" },
    warning: { row: "hover:bg-amber-50/50", icon: "text-amber-500", dot: "bg-amber-400" },
    info: { row: "hover:bg-slate-50/50", icon: "text-slate-400", dot: "bg-slate-300" },
};

// Alert row
function AlertRow({ alert }: { alert: Alert }) {
    const router = useRouter();
    const s = SEVERITY_STYLE[alert.severity];
    const Icon = alert.icon;

    return (
        <div
            role={alert.href ? "button" : undefined}
            tabIndex={alert.href ? 0 : undefined}
            onClick={() => alert.href && router.push(alert.href)}
            onKeyDown={(e) =>
                alert.href && (e.key === "Enter" || e.key === " ") && router.push(alert.href!)
            }
            className={cn(
                "flex items-start gap-2.5 px-3 py-2.5 rounded-lg transition-colors",
                alert.href ? cn("cursor-pointer", s.row) : "cursor-default",
            )}
        >
            <div className="mt-0.5 shrink-0">
                <Icon className={cn("h-3.5 w-3.5", s.icon)} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-700 leading-snug">{alert.title}</p>
                {alert.detail && (
                    <p className="text-[10px] text-slate-400 mt-0.5">{alert.detail}</p>
                )}
            </div>
            <span className={cn("mt-1.5 h-1.5 w-1.5 rounded-full shrink-0", s.dot)} />
        </div>
    );
}

// Section divider
function AlertSection({
    title,
    alerts,
}: {
    title: string;
    alerts: Alert[];
}) {
    if (!alerts.length) return null;

    return (
        <div className="space-y-0.5">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 mb-1">
                {title}
            </p>
            {alerts.map((a) => (
                <AlertRow key={a.id} alert={a} />
            ))}
        </div>
    );
}

// Main component
interface CriticalAlertsPanelProps {
    /** IN_PROGRESS encounters -> from GET /encounters/?status=IN_PROGRESS */
    activeEncounters: EncounterListItem[];
    /** All of today's appointments+queue items */
    todaysItems: TodaysAppointmentListItem[];
    isLoading?: boolean;
}

export default function CriticalAlertsPanel({
    activeEncounters,
    todaysItems,
    isLoading,
}: CriticalAlertsPanelProps) {
    // Clinical alerts
    const clinicalAlerts: Alert[] = [];

    // Encounters open but not closed
    const unclosedCount = activeEncounters.filter(
        (e) => e.status === "IN_PROGRESS"
    ).length;
    if (unclosedCount > 0) {
        clinicalAlerts.push({
            id: "unclosed_encounters",
            section: "clinical",
            severity: unclosedCount > 3 ? "critical" : "warning",
            icon: FileX,
            title: `${unclosedCount} encounter${unclosedCount > 1 ? "s" : ""} not closed`,
            detail: "Doctors may have open documentation",
            href: "/encounters",
        });
    }

    // Encounters with pending investigations
    const pendingInvCount = activeEncounters.filter(
        (e) => e.has_investigation && e.status === "IN_PROGRESS"
    ).length;
    if (pendingInvCount > 0) {
        clinicalAlerts.push({
            id: "pending_investigations",
            section: "clinical",
            severity: "warning",
            icon: FlaskConical,
            title: `${pendingInvCount} investigation${pendingInvCount > 1 ? "s" : ""} pending`,
            detail: "Results not yet recorded",
            href: "/encounters",
        });
    }

    // Encounters with treatment plan but nothing performed
    const treatmentOverdue = activeEncounters.filter(
        (e) => e.has_treatment_plan && e.status === "IN_PROGRESS"
    ).length;
    if (treatmentOverdue > 0) {
        clinicalAlerts.push({
            id: "treatment_overdue",
            section: "clinical",
            severity: "info",
            icon: Layers,
            title: `${treatmentOverdue} treatment plan${treatmentOverdue > 1 ? "s" : ""} in progress`,
            detail: "Open encounters with planned treatments",
        });
    }

    // Operations alerts
    const operationsAlerts: Alert[] = [];

    // Long queue: items that have been WAITING for >30m
    // (we don't have wait time per item from the today response, so use count as proxy)
    const waitingCount = todaysItems.filter(
        (i) => i.queue?.status === "WAITING"
    ).length;
    if (waitingCount > 5) {
        operationsAlerts.push({
            id: "long_queue",
            section: "operations",
            severity: waitingCount > 10 ? "critical" : "warning",
            icon: Clock,
            title: `${waitingCount} patients waiting`,
            detail: "Queue may need attention",
            href: "/queue",
        });
    }

    // No-shows today
    const noShowCount = todaysItems.filter(
        (i) => i.appointment.status === "NO_SHOW"
    ).length;
    if (noShowCount > 0) {
        operationsAlerts.push({
            id: "no_shows",
            section: "operations",
            severity: "info",
            icon: AlertTriangle,
            title: `${noShowCount} no-show${noShowCount > 1 ? "s" : ""} today`,
            detail: "Slots may be rescheduled",
            href: "/appointments",
        });
    }

    // Unassigned appointments (no doctor assigned)
    const unassignedCount = todaysItems.filter(
        (i) => !i.appointment.assigned_doctor_id &&
            i.appointment.status !== "CANCELLED" &&
            i.appointment.status !== "NO_SHOW"
    ).length;
    if (unassignedCount > 0) {
        operationsAlerts.push({
            id: "unassigned",
            section: "operations",
            severity: "warning",
            icon: AlertTriangle,
            title: `${unassignedCount} unassigned appointment${unassignedCount > 1 ? "s" : ""}`,
            detail: "No doctor allocated",
            href: "/appointments",
        });
    }

    const totalAlerts = clinicalAlerts.length + operationsAlerts.length;

    if (isLoading) {
        return (
            <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-10 rounded-lg bg-slate-100 animate-pulse" />
                ))}
            </div>
        );
    }

    if (totalAlerts === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center mb-2">
                    <AlertTriangle className="h-5 w-5 text-emerald-400" />
                </div>
                <p className="text-xs font-semibold text-slate-500">All clear</p>
                <p className="text-[11px] text-slate-400 mt-0.5">No alerts right now</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <AlertSection title="Clinical" alerts={clinicalAlerts} />
            <AlertSection title="Operations" alerts={operationsAlerts} />
        </div>
    );
}