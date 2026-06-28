"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Building2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SectionLoader } from "@/components/base/loading-view";
import DashboardSection from "@/components/dashboard/shared/DashboardSection";

import ClinicKpiStrip from "@/components/dashboard/admin/ClinicKpiStrip";
import LiveOperationsBoard from "@/components/dashboard/admin/LiveOperationsBoard";
import CriticalAlertsPanel from "@/components/dashboard/admin/CriticalAlertsPanel";
import EncounterFunnel from "@/components/dashboard/admin/EncounterFunnel";
import PaymentStatusSnapshot from "@/components/dashboard/admin/PaymentStatusSnapshot";
import StaffStatusRail from "@/components/dashboard/admin/StaffStatusRail";
import ActiveSessionsPanel from "@/components/dashboard/admin/ActiveSessionsPanel";

import { useTodaysAppointments } from "@/hooks/appointments/use-appointments";
import { useTodaysQueue } from "@/hooks/queues/use-queue";
import { useListEncounters } from "@/hooks/encounter/use-encounter";
import { useGetAllUsers, useGetAllUserSessions } from "@/hooks/users/use-staffs";
import { useStaffSummary, useRevokeAnySession } from "@/hooks/users/use-staff-detail";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const adminName =
    (session?.user as any)?.name ??
    (session?.user as any)?.username ??
    "Admin";

  // Data fetching
  const todaysApptQuery = useTodaysAppointments();
  const todaysQueueQuery = useTodaysQueue();
  const activeEncountersQuery = useListEncounters({ status: "IN_PROGRESS" });
  const staffSummaryQuery = useStaffSummary();
  const recentUsersQuery = useGetAllUsers();
  const sessionsQuery = useGetAllUserSessions();
  const revokeSession = useRevokeAnySession();

  const isLoading =
    todaysApptQuery.isLoading || todaysQueueQuery.isLoading;

  // Derived values
  const todaysItems = todaysApptQuery.data?.items ?? [];
  const apptStats = todaysApptQuery.data?.stats;

  const todaysAppointments = useMemo(
    () => todaysItems.map((i) => i.appointment),
    [todaysItems]
  );

  // Avg wait: mean of estimated_wait_mins across WAITING queue items
  const avgWaitMins = useMemo(() => {
    const queueItems = todaysQueueQuery.data?.items ?? [];
    const waiting = queueItems
      .map((i) => i.queue.estimated_wait_mins)
      .filter((m): m is number => m != null);
    if (!waiting.length) return undefined;
    return Math.round(waiting.reduce((a, b) => a + b, 0) / waiting.length);
  }, [todaysQueueQuery.data]);

  // Doctor utilisation: appointments with IN_PROGRESS status / total doctors
  const activeDoctors = useMemo(
    () => new Set(
      todaysItems
        .filter((i) => i.appointment.status === "IN_PROGRESS" && i.appointment.assigned_doctor_id)
        .map((i) => i.appointment.assigned_doctor_id!)
    ).size,
    [todaysItems]
  );

  const totalDoctors = staffSummaryQuery.data?.doctors;

  const activeEncounters = activeEncountersQuery.data?.items ?? [];
  const pendingInvCount = activeEncounters.filter((e) => e.has_investigation).length;

  const sessions = sessionsQuery.data ?? [];


  // Handlers
  const handleRevokeSession = async (sessionId: string, userId: string) => {
    await revokeSession.mutateAsync({ sessionId, userId });
    sessionsQuery.refetch();
  };

  // Loading state
  if (isLoading) return <SectionLoader message="Loading clinic overview…" />;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Clinic Operations Center
          </p>
          <h1 className="text-xl font-black text-slate-800 mt-0.5">
            {greeting}, {adminName}
          </h1>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] font-bold px-3 py-1.5 bg-brand-50 text-brand-700 border-brand-200 flex items-center gap-1.5 self-start"
        >
          <Building2 className="h-3 w-3" />
          {new Date().toLocaleDateString(undefined, {
            weekday: "long", month: "short", day: "numeric",
          })}
        </Badge>
      </div>

      {/* Row 1: KPI ribbon */}
      <ClinicKpiStrip
        appointmentStats={apptStats}
        avgWaitMins={avgWaitMins}
        activeEncounterCount={activeEncountersQuery.data?.active_count}
        pendingInvestigationCount={pendingInvCount}
        totalDoctors={totalDoctors}
        activeDoctors={activeDoctors}
        isLoading={todaysApptQuery.isLoading}
      />

      {/* Row 2: Live operations + alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* Live operations board */}
        <div className="lg:col-span-8">
          <DashboardSection
            title="Live Operations"
            meta={
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400">
                  {todaysItems.length} today
                </span>
              </div>
            }
          >
            <ScrollArea className="max-h-105">
              <LiveOperationsBoard
                items={todaysItems}
                isLoading={todaysApptQuery.isLoading}
              />
            </ScrollArea>
          </DashboardSection>
        </div>

        {/* Critical alerts */}
        <div className="lg:col-span-4">
          <DashboardSection
            title="Critical Alerts"
            meta={
              (() => {
                const count =
                  (activeEncounters.filter((e) => e.status === "IN_PROGRESS").length > 0 ? 1 : 0) +
                  (pendingInvCount > 0 ? 1 : 0) +
                  (todaysItems.filter((i) => i.appointment.status === "NO_SHOW").length > 0 ? 1 : 0);
                return count > 0 ? (
                  <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-[10px] font-bold">
                    {count}
                  </Badge>
                ) : null;
              })()
            }
          >
            <CriticalAlertsPanel
              activeEncounters={activeEncounters}
              todaysItems={todaysItems}
              isLoading={activeEncountersQuery.isLoading}
            />
          </DashboardSection>
        </div>
      </div>

      {/* Row 3: Funnel + payment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DashboardSection title="Appointment Funnel">
          <EncounterFunnel
            stats={apptStats}
            isLoading={todaysApptQuery.isLoading}
          />
        </DashboardSection>

        <DashboardSection title="Payment Status">
          <PaymentStatusSnapshot
            appointments={todaysAppointments}
            isLoading={todaysApptQuery.isLoading}
          />
        </DashboardSection>
      </div>

      {/* Row 4: Team management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DashboardSection title="Staff Overview">
          <StaffStatusRail
            summary={staffSummaryQuery.data}
            recentUsers={recentUsersQuery.data?.users}
            isLoading={staffSummaryQuery.isLoading}
          />
        </DashboardSection>

        <DashboardSection
          title="Active Sessions"
          meta={
            sessions.filter((s) => !s.is_revoked).length > 0 ? (
              <Badge className="bg-slate-100 text-slate-600 border-slate-200 text-[10px] font-bold">
                {sessions.filter((s) => !s.is_revoked).length} active
              </Badge>
            ) : null
          }
        >
          <ActiveSessionsPanel
            sessions={sessions}
            onRevokeSession={handleRevokeSession}
            onRefresh={() => sessionsQuery.refetch()}
            isLoading={sessionsQuery.isLoading}
          />
        </DashboardSection>
      </div>

    </div>
  );
}