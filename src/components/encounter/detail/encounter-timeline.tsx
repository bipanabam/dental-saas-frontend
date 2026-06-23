"use client";

import { fmtTime } from "./utils";
import type { EncounterDetail } from "@/lib/api";

type TimelineEvent = {
    key: string;
    label: string;
    timestamp: string | null;
    done: boolean;
};

function earliest(timestamps: (string | null | undefined)[]): string | null {
    const valid = timestamps.filter((t): t is string => !!t);
    if (valid.length === 0) return null;
    return valid.reduce((min, t) => (new Date(t) < new Date(min) ? t : min));
}

function buildTimeline(encounter: EncounterDetail): TimelineEvent[] {
    const examinationAt = earliest((encounter.examination_findings ?? []).map((e) => (e as any).created_at));
    const findingsAt = earliest((encounter.clinical_findings ?? []).map((f) => (f as any).created_at));
    const diagnosisAt = earliest((encounter.diagnoses ?? []).map((d) => (d as any).created_at));
    const investigationAt = earliest((encounter.investigations ?? []).map((i) => i.requested_at));

    return [
        { key: "started", label: "Started", timestamp: encounter.started_at, done: true },
        { key: "history", label: "History", timestamp: encounter.medical_history?.updated_at ?? null, done: !!encounter.medical_history },
        { key: "examination", label: "Exam", timestamp: examinationAt, done: (encounter.examination_findings ?? []).length > 0 },
        { key: "findings", label: "Findings", timestamp: findingsAt, done: (encounter.clinical_findings ?? []).length > 0 },
        { key: "diagnosis", label: "Dx", timestamp: diagnosisAt, done: (encounter.diagnoses ?? []).length > 0 },
        { key: "investigation", label: "Investigation", timestamp: investigationAt, done: (encounter.investigations ?? []).length > 0 },
        { key: "treatment_plan", label: "Plan", timestamp: encounter.treatment_plan?.created_at ?? null, done: !!encounter.treatment_plan },
        { key: "closed", label: "Closed", timestamp: encounter.closed_at, done: !!encounter.closed_at },
    ];
}

export default function EncounterTimeline({ encounter }: { encounter: EncounterDetail }) {
    const events = buildTimeline(encounter);

    const completedCount = events.filter((e) => e.done).length;

    // Find the timestamp of the latest completed event to show the chart's last active mark
    const completedEvents = events.filter((e) => e.done && e.timestamp);
    const lastActiveEvent = completedEvents.length > 0
        ? completedEvents.reduce((latest, current) =>
            new Date(current.timestamp!) > new Date(latest.timestamp!) ? current : latest
        )
        : null;

    return (
        <div className="border border-slate-100 rounded-xl bg-white px-4 py-3.5 text-xs">
            {/* Header */}
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between border-b border-slate-50 pb-2.5 mb-3">
                <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Encounter Progression
                    </p>
                    <p className="text-slate-500 font-medium">
                        Clinical workflow tracking manifest
                    </p>
                </div>

                <div className="flex items-baseline gap-3 text-right sm:block">
                    <span className="text-xs font-mono font-bold text-slate-700 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded">
                        {completedCount} / {events.length} Sections Completed
                    </span>
                    {lastActiveEvent?.timestamp && (
                        <p className="text-[10px] text-slate-400 mt-1">
                            Last charted entry: <span className="font-mono">{fmtTime(lastActiveEvent.timestamp)}</span>
                        </p>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto scrollbar-none">
                <div className="flex min-w-max items-center gap-2 py-1">
                    {events.map((event, i) => (
                        <div key={event.key} className="flex items-center gap-2">
                            <div className="flex flex-col">
                                <span
                                    className={`font-semibold tracking-tight transition-colors ${event.done
                                            ? "text-slate-800 font-bold"
                                            : "text-slate-300"
                                        }`}
                                >
                                    {event.label}
                                </span>
                                {event.done && event.timestamp && (
                                    <span className="text-[9px] font-mono text-slate-400 -mt-0.5">
                                        {fmtTime(event.timestamp)}
                                    </span>
                                )}
                            </div>

                            {/* text separator arrow */}
                            {i < events.length - 1 && (
                                <span className={`font-mono text-xs select-none px-0.5 ${events[i + 1].done ? "text-slate-400 font-bold" : "text-slate-200"
                                    }`}>
                                    →
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}