import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ListOrdered,
  Receipt,
  ChartNoAxesCombined,
  Settings,
  ClipboardPlus,
  BookOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { UserRole } from "@/lib/auth/types";

export type SidebarChild = {
  title: string;
  url: string;
};

export type SidebarItem = {
  title: string;
  url?: string;

  icon: LucideIcon;

  roles: UserRole[];

  children?: SidebarChild[];
};

export const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "receptionist", "accountant", "doctor"],
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
    title: "Encounters",
    url: "/encounters",
    icon: ClipboardPlus,
    roles: ["admin", "doctor"],
  },

  {
    title: "Queue",
    url: "/queue",
    icon: ListOrdered,
    // receptionist added: check-in/confirm/no-show are front-desk actions
    roles: ["admin", "receptionist"],
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
    roles: ["admin", "accountant"],
  },

  {
    title: "Guidelines",
    icon: BookOpen,
    roles: ["admin", "doctor"],

    children: [
      {
        title: "Clinical Taxonomy",
        url: "/taxonomy",
      },
      {
        title: "Procedure Catalog",
        url: "/procedure-catalog",
      },
    ],
  },
  {
    title: "Staff",
    url: "/staff",
    icon: Users,
    roles: ["admin"],
  },

  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    roles: ["admin"],
  },
];