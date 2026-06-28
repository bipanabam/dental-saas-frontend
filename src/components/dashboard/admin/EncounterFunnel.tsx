import { cn } from "@/lib/utils";
import type { AppointmentStats } from "@/lib/api";

interface FunnelStep {
    label: string;
    key: keyof AppointmentStats;
    color: string;
    bg: string;
}

const STEPS: FunnelStep[] = [
    { label: "Booked", key: "booked", color: "bg-amber-400", bg: "bg-amber-50" },
    { label: "Confirmed", key: "confirmed", color: "bg-sky-400", bg: "bg-sky-50" },
    { label: "Checked In", key: "checked_in", color: "bg-blue-500", bg: "bg-blue-50" },
    { label: "In Encounter", key: "in_progress", color: "bg-violet-500", bg: "bg-violet-50" },
    { label: "Completed", key: "completed", color: "bg-emerald-500", bg: "bg-emerald-50" },
];

interface EncounterFunnelProps {
    stats?: AppointmentStats;
    isLoading?: boolean;
}

export default function EncounterFunnel({ stats, isLoading }: EncounterFunnelProps) {
    if (isLoading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-8 rounded-lg bg-slate-100 animate-pulse" />
                ))}
            </div>
        );
    }

    if (!stats) {
        return <p className="text-xs text-slate-400 text-center py-8">No data yet.</p>;
    }

    const max = Math.max(
        stats.booked! + stats.confirmed! + stats.checked_in! + stats.in_progress! + stats.completed!,
        1
    );

    // Drop-off: how many fell out between steps
    const stepValues = STEPS.map((s) => stats[s.key] as number);

    return (
        <div className="space-y-2.5">
            {STEPS.map((step, idx) => {
                const value = stats[step.key] as number;
                const pct = Math.round((value / max) * 100);
                const prev = idx > 0 ? (stats[STEPS[idx - 1].key] as number) : null;
                const dropOff = prev != null && prev > value ? prev - value : null;

                return (
                    <div key={step.key}>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                                <span className={cn("h-2 w-2 rounded-full shrink-0", step.color)} />
                                <span className="text-[11px] font-semibold text-slate-600">{step.label}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                {dropOff != null && dropOff > 0 && (
                                    <span className="text-[10px] text-slate-400">−{dropOff} left</span>
                                )}
                                <span className="text-sm font-black font-mono text-slate-800 w-7 text-right">
                                    {value}
                                </span>
                            </div>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                                className={cn("h-full rounded-full transition-all duration-500", step.color)}
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                    </div>
                );
            })}

            {/* Summary row */}
            <div className="pt-2 mt-1 border-t border-slate-100 flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>
                    {stats.cancelled! > 0 && `${stats.cancelled} cancelled`}
                    {stats.no_show! > 0 && `  ·  ${stats.no_show} no-show`}
                </span>
                <span className="font-black text-slate-600">
                    {stats.total} total
                </span>
            </div>
        </div>
    );
}