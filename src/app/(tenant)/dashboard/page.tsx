"use client";

import { useTenant } from "@/providers/tenant-provider";

import RoleDashboardRouter from "@/components/dashboard/RoleDashboardRouter";

export default function DashboardPage() {
  const { session } = useTenant();
  const userRole = session?.user?.role || "receptionist";

  return (
    <RoleDashboardRouter
      role={userRole}
    />
  );
}
