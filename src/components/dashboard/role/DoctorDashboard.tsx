"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Stethoscope, Clock, FileText, Play, Layers, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SectionLoader } from "@/components/base/loading-view";

import DashboardSection from "@/components/dashboard/shared/DashboardSection";
import KpiStrip, { type KpiCardData } from "@/components/dashboard/shared/KpiStrip";
import TaskRail, { type TaskSection } from "@/components/dashboard/shared/TaskRail";

import PatientQueueRow from "@/components/dashboard/doctor/PatientQueueRow";
import EncounterSummaryPanel from "@/components/dashboard/doctor/EncounterSummaryPanel";

import { useTodaysAppointments } from "@/hooks/appointments/use-appointments";
import {
  useStartAppointment,
  useCompleteAppointment,
} from "@/hooks/appointments/use-appointment-workflow";
import { useClinicalInbox } from "@/hooks/encounter/use-clinical-inbox";

export default function DoctorDashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const doctorId = (session?.user as any)?.id;
  const doctorName =
    (session?.user as any)?.name ??
    (session?.user as any)?.username ??
    "Doctor";

  const [selectedId, setSelectedId] = useState<string>();

  const todaysQuery = useTodaysAppointments();
  const allItems = todaysQuery.data?.items ?? [];

  const myItems = useMemo(
    () => allItems.filter((a) => a.appointment.assigned_doctor_id === doctorId),
    [allItems, doctorId]
  );

  const selectedAppointment = useMemo(
    () => myItems.find((i) => i.appointment.id === selectedId)?.appointment,
    [myItems, selectedId]
  );

  const inboxQuery = useClinicalInbox(doctorId, true);
  const startMutation = useStartAppointment();
  const completeMutation = useCompleteAppointment();

  // Auto-select the most urgent patient on load:
  // IN_PROGRESS first (resume where you left off), then CHECKED_IN (next up),
  // then fall back to first in list.
  useEffect(() => {
    if (!selectedId && myItems.length > 0) {
      const inProgress = myItems.find((a) => a.appointment.status === "IN_PROGRESS");
      const checkedIn = myItems.find((a) => a.appointment.status === "CHECKED_IN");
      setSelectedId((inProgress ?? checkedIn ?? myItems[0]).appointment.id);
    }
  }, [myItems, selectedId]);

  const waitingCount = myItems.filter((a) => a.appointment.status === "CHECKED_IN").length;
  const inProgressCount = myItems.filter((a) => a.appointment.status === "IN_PROGRESS").length;
  const completedCount = myItems.filter((a) => a.appointment.status === "COMPLETED").length;

  const kpis: KpiCardData[] = useMemo(
    () => [
      {
        id: "patients_today",
        title: "Patients Today",
        value: myItems.length,
        icon: Stethoscope,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
      },
      {
        id: "waiting",
        title: "Waiting",
        value: waitingCount,
        icon: Clock,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
      },
      {
        id: "in_progress",
        title: "In Progress",
        value: inProgressCount,
        icon: Play,
        iconBg: "bg-violet-50",
        iconColor: "text-violet-600",
      },
      {
        id: "notes_pending",
        title: "Notes Pending",
        // Honest proxy: IN_PROGRESS encounters have open documentation.
        // Replace with a dedicated count once encounter status is queryable
        // independently of appointment status.
        value: inProgressCount,
        icon: FileText,
        iconBg: "bg-rose-50",
        iconColor: "text-rose-600",
      },
    ],
    [myItems.length, waitingCount, inProgressCount]
  );

  const performanceKpis: KpiCardData[] = useMemo(
    () => [
      {
        id: "completed",
        title: "Completed Today",
        value: `${completedCount} / ${myItems.length}`,
        icon: CheckCircle2,
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
      },
      {
        id: "completion_rate",
        title: "Completion Rate",
        value: myItems.length > 0
          ? `${Math.round((completedCount / myItems.length) * 100)}%`
          : "0%",
        icon: Layers,
        iconBg: "bg-brand-50",
        iconColor: "text-brand-700",
      },
    ],
    [completedCount, myItems.length]
  );

  const inboxSections: TaskSection[] = useMemo(
    () => [
      {
        key: "investigations",
        label: "Awaiting Results",
        items: (inboxQuery.data?.pending_investigations ?? []).map((inv) => ({
          id: inv.id,
          title: inv.investigation_name,
          subtitle: inv.patient_name,
          onClick: () => router.push(`/appointments/${inv.appointment_id}/encounter`),
        })),
      },
      {
        key: "deferred",
        label: "Deferred Treatments",
        items: (inboxQuery.data?.deferred_treatment_items ?? []).map((item) => ({
          id: item.id,
          title: item.procedure_name ?? "Procedure",
          subtitle: item.patient_name,
          onClick: () => router.push(`/appointments/${item.appointment_id}/encounter`),
        })),
      },
      // TODO: wire useFollowUpsDue(doctorId) when available.
      // TaskRail skips sections with items.length === 0, so enabling it early
      // won't render a ghost header.
      // {
      //   key: "follow_ups",
      //   label: "Follow-ups Due",
      //   items: (followUpsQuery.data ?? []).map((f) => ({
      //     id: f.id,
      //     title: f.patient_name,
      //     subtitle: new Date(f.appointment_date).toLocaleDateString(),
      //     tag: "Today",
      //     tagTone: "warning",
      //     onClick: () => router.push(`/appointments/${f.id}`),
      //   })),
      // },
    ],
    [inboxQuery.data, router]
  );

  if (todaysQuery.isLoading) return <SectionLoader message="Loading your schedule..." />;

  const handleStart = async (appointmentId: string) => {
    await startMutation.mutateAsync(appointmentId);
    router.push(`/appointments/${appointmentId}/encounter`);
  };

  const handleComplete = async (appointmentId: string) => {
    await completeMutation.mutateAsync(appointmentId);
    setSelectedId(undefined);
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Clinical Workspace
          </p>
          <h1 className="text-xl font-black text-slate-800 mt-0.5">
            {greeting}, {doctorName}
          </h1>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] font-bold px-3 py-1.5 bg-brand-50 text-brand-700 border-brand-200 flex items-center gap-1.5 self-start"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
          Live ·{" "}
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </Badge>
      </div>

      <KpiStrip items={kpis} columns={4} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT: Patient queue */}
        <div className="lg:col-span-4">
          <DashboardSection
            title="Today's Patients"
            meta={
              <Badge className="bg-slate-100 text-slate-600 border-slate-200 text-xs font-bold">
                {myItems.length}
              </Badge>
            }
          >
            {myItems.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-10">
                No patients scheduled for today.
              </p>
            ) : (
              <ScrollArea className="max-h-[62vh]">
                <div className="space-y-1.5 p-0.5">
                  {myItems.map((item) => (
                    <PatientQueueRow
                      key={item.appointment.id}
                      item={item}
                      selected={selectedId === item.appointment.id}
                      onSelect={() => setSelectedId(item.appointment.id)}
                      onStart={() => handleStart(item.appointment.id)}
                      onResume={() =>
                        router.push(`/appointments/${item.appointment.id}/encounter`)
                      }
                      isStartPending={
                        startMutation.isPending &&
                        startMutation.variables === item.appointment.id
                      }
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </DashboardSection>
        </div>

        {/* CENTER: Encounter panel */}
        <div className="lg:col-span-5">
          <DashboardSection title="Current Encounter">
            <EncounterSummaryPanel
              appointment={selectedAppointment}
              loading={false}
              onStart={() => selectedAppointment && handleStart(selectedAppointment.id)}
              onComplete={() =>
                selectedAppointment && handleComplete(selectedAppointment.id)
              }
              onOpen={() =>
                selectedAppointment &&
                router.push(`/appointments/${selectedAppointment.id}/encounter`)
              }
              isStartPending={startMutation.isPending}
              isCompletePending={completeMutation.isPending}
            />
          </DashboardSection>
        </div>

        {/* RIGHT: Clinical inbox */}
        <div className="lg:col-span-3">
          <TaskRail
            title="Clinical Inbox"
            sections={inboxSections}
            emptyLabel="Inbox clear."
          />
        </div>
      </div>

      <KpiStrip columns={4} items={performanceKpis} />
    </div>
  );
}