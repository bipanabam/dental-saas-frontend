"use client";

import { useMemo } from "react";

import AnalyticsGrid from "../shared/analytics/AnalyticsGrid";
import AnalyticsCard from "../shared/analytics/AnalyticsCard";

import {
  CalendarDays,
  CheckCircle2,
  UserCheck,
  Activity,
} from "lucide-react";

interface Props {
  appointments?: any[];
}

const AppointmentStats = ({
  appointments = [],
}: Props) => {
  const stats = useMemo(() => {
    const total = appointments.length;

    const confirmed =
      appointments.filter(
        (a) =>
          a.appointment.status ===
          "CONFIRMED"
      ).length;

    const checkedIn =
      appointments.filter(
        (a) =>
          a.appointment?.status ===
          "CHECKED_IN"
      ).length;

    const inProgress =
      appointments.filter(
        (a) =>
          a.appointment?.status ===
          "IN_PROGRESS"
      ).length;

    return {
      total,
      confirmed,
      checkedIn,
      inProgress,

      confirmationRate:
        total > 0
          ? Math.round(
            (confirmed / total) * 100
          )
          : 0,
    };
  }, [appointments]);

  return (
    <AnalyticsGrid>
      <AnalyticsCard
        title="Booked"
        value={stats.total}
        icon={CalendarDays}
        trend={{
          value: `${stats.total} today`,
          direction: "up",
        }}
        className="border-l-4 border-brand-500 bg-white"
      />

      <AnalyticsCard
        title="Confirmed"
        value={stats.confirmed}
        icon={CheckCircle2}
        description={`${stats.confirmationRate}% rate`}
        className="border-l-4 border-emerald-500 bg-white"
      />

      <AnalyticsCard
        title="Checked In"
        value={stats.checkedIn}
        icon={UserCheck}
        description="Waiting room"
        className="border-l-4 border-cyan-500 bg-white"
      />

      <AnalyticsCard
        title="In Progress"
        value={stats.inProgress}
        icon={Activity}
        description="Active treatment"
        className="border-l-4 border-brand-600 bg-white"
      />

    </AnalyticsGrid>
  );
};

export default AppointmentStats;