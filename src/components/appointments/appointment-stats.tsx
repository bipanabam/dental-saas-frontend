"use client";

import AnalyticsGrid from "../shared/analytics/AnalyticsGrid";
import AnalyticsCard from "../shared/analytics/AnalyticsCard";

import { CalendarDays, CheckCircle2, UserCheck, Activity } from "lucide-react";

import type { AppointmentStats as AppointmentStatsType } from "@/lib/api";

interface Props {
  data?: AppointmentStatsType;
}

const AppointmentStats = ({ data }: Props) => {
  const booked = data?.booked ?? 0;
  const confirmed = data?.confirmed ?? 0;
  const checkedIn = data?.checked_in ?? 0;
  const inProgress = data?.in_progress ?? 0;
  const total = data?.total ?? 0;
  const confirmationRate =
    total > 0 ? Math.round((confirmed / total) * 100) : 0;

  return (
    <AnalyticsGrid>
      <AnalyticsCard
        title="Booked"
        value={booked}
        icon={CalendarDays}
        trend={{
          value: `${booked} appointments`,
          direction: "up",
        }}
        className="border-l-4 border-brand-500 bg-white"
      />

      <AnalyticsCard
        title="Confirmed"
        value={confirmed}
        icon={CheckCircle2}
        description={`${confirmationRate}% rate`}
        className="border-l-4 border-emerald-500 bg-white"
      />

      <AnalyticsCard
        title="Checked In"
        value={checkedIn}
        icon={UserCheck}
        description="Waiting room"
        className="border-l-4 border-cyan-500 bg-white"
      />

      <AnalyticsCard
        title="In Progress"
        value={inProgress}
        icon={Activity}
        description="Active treatment"
        className="border-l-4 border-brand-600 bg-white"
      />
    </AnalyticsGrid>
  );
};

export default AppointmentStats;
