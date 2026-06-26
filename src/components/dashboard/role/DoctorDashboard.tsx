"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Stethoscope, Clock, Users, CheckCircle2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SectionLoader } from "@/components/base/loading-view";

import { useTodaysAppointments, useAppointmentDetail } from "@/hooks/appointments/use-appointments";
import {
  useStartAppointment, useCompleteAppointment,
} from "@/hooks/appointments/use-appointment-workflow";

import VisitWorkflowPanel from "@/components/appointments/VisitWorkFlowPanel";

import type { WorkflowAction, AppointmentItem } from "@/lib/utils/appointment-workflow";

function DoctorStatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className={`rounded-2xl border p-4 flex items-center gap-3 bg-white ${color}`}>
      <Icon className="h-5 w-5 shrink-0" />
      <div>
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</p>
        <p className="text-xl font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
}

export default function DoctorDashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const doctorId = (session?.user as any)?.id;

  const [selectedId, setSelectedId] = useState<string>();

  // Only fetch this doctor's appointments
  const todaysQuery = useTodaysAppointments();
  const allAppointments = todaysQuery.data?.items ?? [];

  // Filter to only this doctor's appointments client-side
  // (until backend supports doctor_id filter on /today endpoint)
  const myAppointments = allAppointments.filter(
    (a) => a.appointment.assigned_doctor_id === doctorId
  );

  const { data: selectedAppointment, isLoading: detailLoading } =
    useAppointmentDetail(selectedId);

  const startMutation = useStartAppointment();
  const completeMutation = useCompleteAppointment();

  useEffect(() => {
    if (!selectedId && myAppointments.length > 0) {
      setSelectedId(myAppointments[0].appointment.id);
    }
  }, [myAppointments, selectedId]);

  const pendingAction =
    startMutation.isPending ? { id: startMutation.variables, action: "start" as const } :
      completeMutation.isPending ? { id: completeMutation.variables, action: "complete" as const } :
        undefined;

  const handleWorkflow = async (action: WorkflowAction, item: AppointmentItem) => {
    if (action === "start") {
      await startMutation.mutateAsync(item.id);
      router.push(`/appointments/${item.id}/encounter`);
    }
    if (action === "complete") await completeMutation.mutateAsync(item.id);
    if (action === "open") router.push(`/appointments/${item.id}/encounter`);
  };

  const stats = todaysQuery.data?.stats;
  const completedCount = myAppointments.filter((a) => a.appointment.status === "COMPLETED").length;
  const pendingCount = myAppointments.filter((a) => ["BOOKED", "CONFIRMED", "CHECKED_IN"].includes(a.appointment.status)).length;
  const inProgressCount = myAppointments.filter((a) => a.appointment.status === "IN_PROGRESS").length;

  if (todaysQuery.isLoading) return <SectionLoader message="Loading your schedule..." />;

  return (
    <div className="space-y-5">
      {/* Doctor-specific stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <DoctorStatCard icon={Users} label="My Patients Today" value={myAppointments.length} color="border-slate-100" />
        <DoctorStatCard icon={Clock} label="Pending" value={pendingCount} color="border-amber-100" />
        <DoctorStatCard icon={Stethoscope} label="In Progress" value={inProgressCount} color="border-indigo-100" />
        <DoctorStatCard icon={CheckCircle2} label="Completed" value={completedCount} color="border-emerald-100" />
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        {/* Schedule list — simplified, no secondary actions for doctor view */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">
              Today's Schedule
            </p>
            <Badge className="bg-white text-slate-700 border-slate-200 text-xs font-bold">
              {myAppointments.length}
            </Badge>
          </div>

          <ScrollArea className="h-[60vh]">
            <div className="space-y-2">
              {myAppointments.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-10">
                  No appointments scheduled for today.
                </p>
              ) : (
                myAppointments.map((item) => {
                  const a = item.appointment;
                  const selected = selectedId === a.id;
                  const statusColors: Record<string, string> = {
                    BOOKED: "bg-amber-50 text-amber-700 border-amber-200",
                    CONFIRMED: "bg-sky-50 text-sky-700 border-sky-200",
                    CHECKED_IN: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    IN_PROGRESS: "bg-indigo-50 text-indigo-700 border-indigo-200",
                    COMPLETED: "bg-slate-50 text-slate-400 border-slate-200",
                  };

                  return (
                    <button
                      key={a.id}
                      onClick={() => setSelectedId(a.id)}
                      className={`w-full text-left rounded-xl border p-3 transition-all ${selected
                          ? "border-brand-300 bg-white shadow-sm"
                          : "border-transparent bg-white hover:border-slate-200"
                        }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-mono text-slate-400">
                          {new Date(a.appointment_date).toLocaleTimeString([], {
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[9px] font-bold px-1.5 py-0 h-4 ${statusColors[a.status] ?? "bg-slate-50 text-slate-400"
                            }`}
                        >
                          {a.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-sm font-bold text-slate-800">
                        {a.patient.first_name} {a.patient.last_name}
                      </p>
                      {a.chief_complaint && (
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                          {a.chief_complaint}
                        </p>
                      )}
                      {a.status === "IN_PROGRESS" && (
                        <Button
                          size="sm"
                          className="mt-2 w-full h-7 rounded-lg text-xs bg-indigo-600 gap-1.5"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/appointments/${a.id}/encounter`);
                          }}
                        >
                          <Stethoscope className="h-3.5 w-3.5" />
                          Resume Encounter
                        </Button>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Workflow panel — same component, restricted actions */}
        <VisitWorkflowPanel
          appointment={selectedAppointment}
          loading={detailLoading}
          onAction={handleWorkflow}
          pendingAction={
            pendingAction?.id === selectedAppointment?.id
              ? pendingAction?.action
              : undefined
          }
        />
      </div>
    </div>
  );
}