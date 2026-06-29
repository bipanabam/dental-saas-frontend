"use client";

import { useMemo } from "react";

import { User, Layers, Stethoscope, Phone } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import QueueWaitBadge from "./QueueWaitBadge";

import { useQueueWaitEstimates } from "@/hooks/queues/use-queue-wait";

import type { NormalizedQueueItem } from "@/lib/queue/normalize-queue";

interface Props {
  queue: NormalizedQueueItem[];
}

const QueueSidebar = ({ queue }: Props) => {
  const activeCase = queue.find((q) => q.status === "IN_PROGRESS");
  const upNextQueue = queue.filter((q) => q.status === "WAITING");

  const { data: waitData, isLoading: waitLoading } =
    useQueueWaitEstimates();

  const waitMap = useMemo(() => {
    return Object.fromEntries(
      (waitData?.items ?? []).map((item) => [
        item.queue_id,
        item,
      ]),
    );
  }, [waitData]);

  return (
    <div className="space-y-5">
      {/* 1. PRIMARY WORKSPACE FOCUS NODE */}
      <Card className="border border-slate-100 shadow-sm bg-linear-to-br from-white to-slate-50/50 rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100/60 bg-slate-50/30 flex flex-row items-center justify-between">
          <CardTitle className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-brand-700" /> Currently In
            Progress
          </CardTitle>
          {activeCase && (
            <Badge className="bg-cyan-50 text-cyan-700 font-extrabold border border-cyan-200/60 uppercase text-[9px] rounded px-1.5 py-0.5 animate-pulse">
              Live Session
            </Badge>
          )}
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          {activeCase ? (
            <>
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <div className="text-5xl font-black text-brand-700 tracking-tighter leading-none">
                    #{activeCase.tokenNumber}
                  </div>
                  <h3 className="font-black text-slate-900 text-base pt-1 tracking-tight">
                    {activeCase.patientFirstName} {activeCase.patientLastName}
                  </h3>
                </div>

                {activeCase.appointmentType && (
                  <Badge
                    variant="outline"
                    className="text-[9px] font-black px-1.5 py-0.5 bg-brand-50 text-brand-700 border-brand-100 uppercase tracking-wide rounded"
                  >
                    {activeCase.appointmentType}
                  </Badge>
                )}
              </div>

              {/* Doctor / Contact Sub-strip */}
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-600 bg-white p-2 rounded-xl border border-slate-100/70 shadow-3xs">
                {activeCase.doctorUsername && (
                  <div className="flex items-center gap-1 text-slate-700 pr-2 border-r border-slate-100">
                    <Stethoscope className="h-3 w-3 text-brand-600" />
                    <span>Dr. {activeCase.doctorUsername}</span>
                  </div>
                )}
                {activeCase.patientPhone && (
                  <div className="flex items-center gap-1 font-mono text-slate-400 text-[10px]">
                    <Phone className="h-2.5 w-2.5" />
                    <span>{activeCase.patientPhone}</span>
                  </div>
                )}
              </div>

              {/* Triage Complaint Box */}
              {activeCase.chiefComplaint ? (
                <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Chief Complaint
                  </span>
                  <p className="text-xs font-medium text-slate-600 leading-normal italic">
                    "{activeCase.chiefComplaint}"
                  </p>
                </div>
              ) : (
                <p className="text-[11px] italic text-slate-400">
                  No recorded symptoms declared.
                </p>
              )}
            </>
          ) : (
            <div className="py-6 text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                No Active Session
              </p>
              <p className="text-[11px] text-slate-400 max-w-47.5 mx-auto mt-0.5 leading-normal">
                Admit a patient from the timeline queue to begin tracking room
                metrics.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. NEXT UP PIPELINE TRAILING ROW DECK */}
      <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-50 flex flex-row items-center justify-between">
          <CardTitle className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-brand-700" /> Next In Queue
          </CardTitle>
          <Badge
            variant="secondary"
            className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 border border-slate-100 rounded"
          >
            Top 5 Slots
          </Badge>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-slate-50">
          {upNextQueue.slice(0, 5).map((patient) => (
            <div
              key={patient.queueId}
              className="flex items-center justify-between px-4 py-3 hover:bg-slate-50/40 transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono font-black text-slate-400 text-sm group-hover:text-brand-700 transition-colors">
                  #{patient.tokenNumber}
                </span>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-800 text-sm truncate">
                    {patient.patientFirstName} {patient.patientLastName}
                  </h4>
                  {patient.doctorUsername && (
                    <p className="text-[10px] font-medium text-slate-400 truncate mt-0.5 flex items-center gap-0.5">
                      <Stethoscope className="h-2.5 w-2.5 stroke-2" /> Dr.{" "}
                      {patient.doctorUsername}
                    </p>
                  )}
                </div>
              </div>

              <div className="shrink-0 pl-2">
                <QueueWaitBadge
                  wait={waitMap[patient.queueId]}
                  fallback={patient.estimatedWaitMins}
                  isLoading={waitLoading}
                />
              </div>
            </div>
          ))}

          {upNextQueue.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Queue Empty
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                No trailing patients awaiting triage.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QueueSidebar;
