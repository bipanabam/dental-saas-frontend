import {
  Building2,
  Settings,
  Users,
  Shield,
  Stethoscope,
  ClipboardList,
  FolderTree,
  Bell,
  MonitorSmartphone,
} from "lucide-react";

export const settingsNav = [
  {
    title: "General",
    href: "/settings/general",
    icon: Settings,
  },

  {
    title: "Roles",
    href: "/settings/roles",
    icon: Shield,
  },

  {
    title: "Doctors",
    href: "/settings/doctors",
    icon: Stethoscope,
  },

  {
    title: "Procedure Catalog",
    href: "/settings/procedure-catalog",
    icon: ClipboardList,
  },

  //   {
//     title: "Clinic",
//     href: "/settings/clinic",
//     icon: Building2,
//   },

  // {
  //   title: "Users",
  //   href: "/settings/users",
  //   icon: Users,
  // },

  // {
  //   title: "Taxonomy",
  //   href: "/settings/taxonomy",
  //   icon: FolderTree,
  // },

//   {
//     title: "Preferences",
//     href: "/settings/preferences",
//     icon: Bell,
//   },

  // {
  //   title: "Sessions",
  //   href: "/settings/sessions",
  //   icon: MonitorSmartphone,
  // },
];