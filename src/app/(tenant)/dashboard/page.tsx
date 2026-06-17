"use client";

import { useTenant } from "@/providers/tenant-provider";

import AdminLayout from "@/components/dashboard/admin-layout";

const DashboardPage = () => {
  const { session } = useTenant();
  const userRole = session?.user?.role || "receptionist";

  return (
    <div>
      {userRole === "admin" &&
        <AdminLayout />
      }
    </div>
  )
}

export default DashboardPage;