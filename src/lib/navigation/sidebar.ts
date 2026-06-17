import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ListOrdered,
  Receipt,
  ChartNoAxesCombined,
  Settings,
} from "lucide-react";

import type { UserRole } from "@/lib/auth/types";

export type SidebarItem = {
  title: string;
  url: string;

  icon: any;

  roles: UserRole[];
};

export const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "receptionist"],
  },

  {
    title: "Patients",
    url: "/patients",
    icon: Users,
    roles: ["admin", "receptionist"],
  },

  {
    title: "Appointments",
    url: "/appointments",
    icon: CalendarDays,
    roles: ["admin", "receptionist"],
  },

  {
    title: "Queue",
    url: "/queue",
    icon: ListOrdered,
    roles: ["admin", "doctor"],
  },

  {
    title: "Billing",
    url: "/billing",
    icon: Receipt,
    roles: ["admin", "accountant"],
  },

  {
    title: "Reports",
    url: "/admin/reports",
    icon: ChartNoAxesCombined,
    roles: ["admin"],
  },

  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    roles: ["admin", "doctor"],
  },
];

