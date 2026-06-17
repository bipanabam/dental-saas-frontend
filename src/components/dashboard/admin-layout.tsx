"use client";

import DashboardHeader from "./dashboard-header";
import StatsGrid from "./stats-grid";

import LiveQueueSection from "./LiveQueueSection";
import ActionAlertsPanel from "./ActionAlertsPanel";
import PerformanceAnalytics from "./PerformanceAnalytics";

interface AdminDashboardClientProps {
  userName?: string;
}

const AdminLayout = ({
  userName = "Admin User",
}: AdminDashboardClientProps) => {
  const dummyStats = {
    totalPatients: 1420,
    newPatientsLast30Days: 124,
    newPatientsLast24Hours: 12,
    activePatients: 342,
    totalRevenue: 14250,
  };

  return (
    <div className="max-w-[1700px] mx-auto p-2 space-y-6">

      <DashboardHeader />
      <StatsGrid stats={dummyStats} />

      {/* OPERATIONS */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        <div className="xl:col-span-8">
          <LiveQueueSection />
        </div>

        <div className="xl:col-span-4">
          <ActionAlertsPanel />
        </div>

      </div>

      {/* ANALYTICS */}
      <PerformanceAnalytics />

    </div>
  );
};

export default AdminLayout;