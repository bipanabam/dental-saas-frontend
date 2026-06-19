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
    title: "Encounters",
    url: "/encounters",
    icon: ClipboardPlus,
    roles: ["admin", "doctor"],
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
    title: "Settings",
    url: "/settings",
    icon: Settings,
    roles: ["admin"],
  },
];