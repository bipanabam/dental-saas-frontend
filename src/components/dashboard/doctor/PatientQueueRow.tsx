import { Loader2, Play, FolderOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/dashboard/shared/StatusBadge";
import { getAppointmentStageStyle } from "@/components/dashboard/stage";

import type { TodaysAppointmentListItem } from "@/lib/api";

interface PatientQueueRowProps {
    item: TodaysAppointmentListItem;
    selected: boolean;
    onSelect: () => void;
    onStart: () => void;
    onResume: () => void;
    isStartPending: boolean;
}

/**
 * Single row in the doctor's "Today's Patients" queue list.
 */
export default function PatientQueueRow({
    item,
    selected,
    onSelect,
    onStart,
    onResume,
    isStartPending,
}: PatientQueueRowProps) {
    const a = item.appointment;

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onSelect}
            onKeyDown={(e) =>
                e.key === "Enter" || e.key === " " ? onSelect() : undefined
            }
            className={`
        w-full text-left rounded-xl border p-3.5 transition-all group cursor-pointer
        ${selected
                    ? "border-brand-300 bg-white shadow-sm ring-2 ring-brand-500/10"
                    : "border-transparent bg-white hover:border-slate-200 hover:shadow-xs"
                }
        ${a.status === "COMPLETED" ? "opacity-60" : ""}
      `}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-800">
                            {a.patient.first_name} {a.patient.last_name}
                        </span>
                        {item.queue?.token_number && (
                            <span className="text-[10px] font-mono font-bold text-slate-400">
                                #{item.queue.token_number}
                            </span>
                        )}
                    </div>

                    {a.chief_complaint && (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {a.chief_complaint}
                        </p>
                    )}

                    <span className="text-[10px] font-mono text-slate-400 mt-1.5 block">
                        {new Date(a.appointment_date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                    <StatusBadge
                        status={getAppointmentStageStyle(a.status)}
                        className="text-[9px] px-1.5 py-0 h-4"
                    />

                    {a.status === "CHECKED_IN" && (
                        <Button
                            size="sm"
                            className="h-7 rounded-lg text-[11px] bg-brand-700 gap-1 px-3"
                            onClick={(e) => {
                                e.stopPropagation();
                                onStart();
                            }}
                            disabled={isStartPending}
                        >
                            {isStartPending ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                <Play className="h-3 w-3" />
                            )}
                            Start
                        </Button>
                    )}

                    {a.status === "IN_PROGRESS" && (
                        <Button
                            size="sm"
                            className="h-7 rounded-lg text-[11px] bg-indigo-600 gap-1 px-3"
                            onClick={(e) => {
                                e.stopPropagation();
                                onResume();
                            }}
                        >
                            <FolderOpen className="h-3 w-3" />
                            Resume
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}