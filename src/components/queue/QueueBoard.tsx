"use client";

import {
  Phone,
  SkipForward,
  RotateCcw,
  User,
  Activity,
  UserCheck,
  Loader2,
  Sparkles,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionLoader } from "../base/loading-view";

import CallPatientButton from "@/components/queue/CallPatientButton";

import type { NormalizedQueueItem } from "@/lib/queue/normalize-queue";
import { useQueueActions } from "@/hooks/queues/use-queue-actions";

interface Props {
  queue: NormalizedQueueItem[];
  isLoading: boolean;
}

const STAGES = [
  {
    key: "WAITING",
    label: "Waiting Lounge",
    badge: "bg-amber-50 text-amber-800 border-amber-200/60",
  },
  {
    key: "CALLED",
    label: "Triage / Announcement",
    badge: "bg-brand-50 text-brand-800 border-brand-200/60",
  },
  {
    key: "IN_PROGRESS",
    label: "With Practitioner",
    badge: "bg-cyan-50 text-cyan-800 border-cyan-200/60",
  },
] as const;

const QueueBoard = ({ queue, isLoading }: Props) => {
  const { callQueue, skipQueue, recallQueue, loading } = useQueueActions();

  if (isLoading) return <SectionLoader message="Syncing Triages..." />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {STAGES.map((stage) => {
        const slots = queue.filter((x) => x.status === stage.key);
        return (
          <div
            key={stage.key}
            className="space-y-3 bg-slate-50/60 p-3 rounded-2xl border border-slate-100 flex flex-col min-h-125"
          >
            {/* Header Stage */}
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                {stage.label}
              </span>
              <Badge
                variant="outline"
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border shadow-3xs ${stage.badge}`}
              >
                {slots.length} {slots.length === 1 ? "Patient" : "Patients"}
              </Badge>
            </div>

            {/* Scrollable Column Runway */}
            <div className="space-y-2.5 flex-1 max-h-150 overflow-y-auto no-scrollbar pr-0.5">
              {slots.map((row) => (
                <Card
                  key={row.queueId}
                  className="border-slate-200/70 shadow-3xs hover:shadow-2xs hover:border-slate-300/90 transition-all bg-white rounded-xl overflow-hidden group"
                >
                  <CardContent className="p-3.5 space-y-3">
                    {/* Token Number & Estimated Wait */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-black text-brand-700 tracking-tight leading-none">
                            #{row.tokenNumber}
                          </span>
                          {row.appointmentType && (
                            <span className="px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 font-bold text-[9px] uppercase tracking-wider border border-brand-100/50">
                              {row.appointmentType}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm tracking-tight pt-0.5">
                          {row.patientFirstName} {row.patientLastName}
                        </h4>
                      </div>

                      <div className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 shrink-0 shadow-3xs">
                        {row.estimatedWaitMins != null
                          ? `~${row.estimatedWaitMins}m`
                          : "—"}
                      </div>
                    </div>

                    {/* Meta Metadata Data Strip (Doctor & Phone Allocation) */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-slate-500 text-[11px] font-medium pt-0.5 border-t border-slate-50">
                      {row.doctorUsername && (
                        <div className="flex items-center gap-1 text-slate-700 font-semibold bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                          <User className="h-3 w-3 text-brand-600 shrink-0" />
                          <span className="truncate max-w-25">
                            Dr. {row.doctorUsername}
                          </span>
                        </div>
                      )}
                      {row.patientPhone && (
                        <span className="text-slate-400 font-mono text-[10px]">
                          {row.patientPhone}
                        </span>
                      )}
                    </div>

                    {/* Clinical Chief Complaint */}
                    {row.chiefComplaint ? (
                      <p className="text-[11px] font-medium text-slate-500 line-clamp-2 bg-slate-50/50 p-2 rounded-lg border border-slate-100 leading-normal">
                        <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wide block mb-0.5">
                          Complaint
                        </span>
                        {row.chiefComplaint}
                      </p>
                    ) : (
                      <div className="text-[10px] italic text-slate-400 px-1">
                        No recorded symptoms declared
                      </div>
                    )}

                    {/* Execution Actions */}
                    <div className="flex items-center gap-1.5 border-t border-slate-100/70 pt-2.5 bg-white">
                      {/* 1. WAITING ACTIONS: Call Announcement */}
                      {row.status === "WAITING" && (
                        <CallPatientButton
                          queueId={row.queueId}
                          tokenNumber={row.tokenNumber}
                          className="h-8 rounded-lg text-xs font-bold bg-brand-700 hover:bg-brand-800 text-white gap-1.5 flex-1 shadow-3xs"
                          loading={loading}
                        />
                      )}

                      {/* 2. CALLED ACTIONS: Process Admission / Skip Sequence */}
                      {row.status === "CALLED" && (
                        <>
                          <Button
                            size="sm"
                            disabled={loading}
                            onClick={async () =>
                              await callQueue({
                                path: { queue_id: row.queueId }
                              })
                            }
                            className="h-8 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 flex-1 shadow-3xs"
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                            <span>Admit Patient</span>
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            disabled={loading}
                            onClick={() =>
                              skipQueue({ path: { queue_id: row.queueId } })
                            }
                            className="h-8 w-8 p-0 rounded-lg border-slate-200 text-slate-500 hover:bg-slate-50 shrink-0"
                            title="Skip Patient"
                          >
                            <SkipForward className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      )}

                      {/* 3. IN_PROGRESS ACTIONS: Active Session Identifier */}
                      {row.status === "IN_PROGRESS" && (
                        <div className="flex items-center gap-1.5 text-cyan-700 bg-cyan-50/50 border border-cyan-100 px-2.5 py-1 rounded-lg text-xs font-bold flex-1 h-8 animate-pulse-slow">
                          <Activity className="h-3.5 w-3.5 text-cyan-600" />
                          <span>Currently consulting...</span>
                        </div>
                      )}

                      {/* Global Re-call / Back-fill Reset Modifier Option */}
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={loading}
                        onClick={() =>
                          recallQueue({ path: { queue_id: row.queueId } })
                        }
                        className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 shrink-0 ml-auto transition-colors"
                        title="Recall / Reset"
                      >
                        {loading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <RotateCcw className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Empty Fallback Element */}
              {slots.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 border border-dashed border-slate-200 rounded-xl bg-white/40 text-center mx-0.5 my-1">
                  <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200/50 mb-2">
                    <Sparkles className="h-4 w-4 text-slate-400" />
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Stage Clear
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-40 mt-0.5 leading-normal">
                    No matching patients currently allocated here.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QueueBoard;
