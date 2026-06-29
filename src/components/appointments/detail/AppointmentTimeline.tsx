import { cn } from "@/lib/utils";
import type { AppointmentDetail } from "@/lib/api";
import type { EncounterDetail } from "@/lib/api";

interface Step {
    key: string;
    label: string;
    timestamp?: string | null;
    /** The appointment statuses at which this step is "reached" */
    reachedAt: string[];
}

function fmtStamp(dt?: string | null) {
    if (!dt) return null;
    return new Date(dt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

interface AppointmentTimelineProps {
    appointment: AppointmentDetail;
    encounter?: EncounterDetail | null;
}

export default function AppointmentTimeline({
    appointment,
    encounter,
}: AppointmentTimelineProps) {
    const steps: Step[] = [
        {
            key: "booked",
            label: "Booked",
            timestamp: appointment.created_at,
            reachedAt: ["BOOKED", "CONFIRMED", "CHECKED_IN", "IN_PROGRESS", "COMPLETED"],
        },
        {
            key: "confirmed",
            label: "Confirmed",
            timestamp: appointment.confirmed_at ?? null,
            reachedAt: ["CONFIRMED", "CHECKED_IN", "IN_PROGRESS", "COMPLETED"],
        },
        {
            key: "checked_in",
            label: "Checked In",
            timestamp: appointment.checked_in_at ?? null,
            reachedAt: ["CHECKED_IN", "IN_PROGRESS", "COMPLETED"],
        },
        {
            key: "encounter_started",
            label: "Encounter Started",
            timestamp: encounter?.started_at ?? null,
            reachedAt: ["IN_PROGRESS", "COMPLETED"],
        },
        {
            key: "completed",
            label: "Completed",
            timestamp: encounter?.closed_at ?? null,
            reachedAt: ["COMPLETED"],
        },
    ];

    const currentStatus = appointment.status;
    const isCancelled = currentStatus === "CANCELLED" || currentStatus === "NO_SHOW";

    return (
        <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3">
                Visit Journey
            </p>

            <div className="flex items-start gap-0">
                {steps.map((step, idx) => {
                    const reached = step.reachedAt.includes(currentStatus);
                    const isLast = idx === steps.length - 1;
                    const stamp = fmtStamp(step.timestamp);
                    const isCurrent =
                        !reached && steps[idx - 1]?.reachedAt.includes(currentStatus);

                    return (
                        <div key={step.key} className="flex items-start flex-1 min-w-0">
                            {/* Step dot + connector */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={cn(
                                        "h-2.5 w-2.5 rounded-full border-2 shrink-0 mt-0.5 transition-colors",
                                        isCancelled
                                            ? "border-slate-200 bg-white"
                                            : reached
                                                ? "border-brand-600 bg-brand-600"
                                                : isCurrent
                                                    ? "border-brand-400 bg-white"
                                                    : "border-slate-200 bg-white"
                                    )}
                                />
                            </div>

                            {/* Connector line */}
                            {!isLast && (
                                <div
                                    className={cn(
                                        "h-px flex-1 mt-1.5 mx-1 transition-colors",
                                        reached && !isCancelled
                                            ? "bg-brand-300"
                                            : "bg-slate-100"
                                    )}
                                />
                            )}

                            {/* Label + time -> floats below the dot */}
                            <div
                                className={cn(
                                    "absolute mt-4 text-center",
                                    // We position via flex trick below instead
                                )}
                                style={{ display: "none" }}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Labels row below the dots */}
            <div className="flex mt-1.5">
                {steps.map((step, idx) => {
                    const reached = step.reachedAt.includes(currentStatus);
                    const stamp = fmtStamp(step.timestamp);

                    return (
                        <div
                            key={step.key}
                            className={cn(
                                "flex-1 min-w-0 pr-1",
                                idx === 0 ? "text-left" : "text-center",
                                idx === steps.length - 1 ? "text-right" : ""
                            )}
                        >
                            <p
                                className={cn(
                                    "text-[10px] font-bold leading-tight truncate",
                                    reached && !isCancelled
                                        ? "text-slate-700"
                                        : "text-slate-300"
                                )}
                            >
                                {step.label}
                            </p>
                            {stamp && (
                                <p className="text-[9px] font-mono text-slate-400 mt-0.5">
                                    {stamp}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Cancelled / no-show override */}
            {isCancelled && (
                <p className="text-[11px] text-rose-500 font-bold mt-2 text-center">
                    {currentStatus === "NO_SHOW" ? "Patient did not arrive" : "Appointment cancelled"}
                </p>
            )}
        </div>
    );
}