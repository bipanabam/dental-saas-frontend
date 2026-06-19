import { FilterField } from "@/components/shared/filters/types";

export const roleFilters: FilterField = {
  field: "role",
  label: "Role",

  options: [
    {
      label: "All roles",
      value: "ALL",
    },
    {
      label: "Admin",
      value: "admin",
    },
    {
      label: "Doctor",
      value: "doctor",
    },
    {
      label: "Receptionist",
      value: "receptionist",
    },
    {
      label: "Assistant",
      value: "assistant",
    },
    {
      label: "Accountant",
      value: "Accountant",
    },
  ],
};

export const ROLE_BADGE_THEMES: Record<string, string> = {
  admin: "bg-rose-50 text-rose-700 border-rose-100",
  doctor: "bg-indigo-50 text-indigo-700 border-indigo-100",
  receptionist: "bg-amber-50 text-amber-700 border-amber-100",
  assistant: "bg-teal-50 text-teal-700 border-teal-100",
  accountant: "bg-emerald-50 text-emerald-700 border-emerald-100",
};
