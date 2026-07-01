import type {
  AppointmentStatusEnum,
  AppointmentSourceEnum,
  AppointmentTypeEnum,
} from "@/lib/api";

import type { FilterField } from "@/components/shared/filters/types";

export const statusConfig: Record<AppointmentStatusEnum,
  { label: string; className: string; dot: string }
> = {
  CHECKED_IN: {
    label: "Checked In",
    className: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-500",
  },
  BOOKED: {
    label: "Booked",
    className: "bg-amber-50 text-amber-700 border-amber-100",
    dot: "bg-amber-500",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-100",
    dot: "bg-emerald-500",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-blue-50 text-blue-700 border-blue-100",
    dot: "bg-blue-500",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-indigo-50 text-indigo-700 border-indigo-100",
    dot: "bg-indigo-500",
  },
  NO_SHOW: {
    label: "No Show",
    className: "bg-red-50 text-red-700 border-red-100",
    dot: "bg-red-500",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-zinc-100 text-zinc-500 border-zinc-200",
    dot: "bg-zinc-400",
  },
};

export const typeConfig: Record<AppointmentTypeEnum, { label: string }> = {
  BOOKED: { label: "Standard Booking" },
  WALK_IN: { label: "Walk-In" },
  FOLLOW_UP: { label: "Clinical Follow-Up" },
  RESCHEDULED: { label: "Rescheduled" },
};

export const sourceConfig: Record<AppointmentSourceEnum, { label: string; dot: string }> = {
  WALK_IN: { label: "Walk-in", dot: "bg-slate-400" },
  ONLINE: { label: "Online", dot: "bg-indigo-500" },
  PHONE: { label: "Phone", dot: "bg-emerald-500" },
  WHATSAPP: { label: "WhatsApp", dot: "bg-green-500" },
  INSTAGRAM: { label: "Instagram", dot: "bg-pink-500" },
  FRONT_DESK: { label: "Front Desk", dot: "bg-amber-500" },
};

export function getStatusConfig(status: string) {
  return statusConfig[status as AppointmentStatusEnum] ?? {
    label: status,
    className: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-400",
  };
}

export function getSourceConfig(status: string) {
  return sourceConfig[status as AppointmentSourceEnum] ?? {
    label: status,
    dot: "bg-slate-400",
  };
}

// Derived option lists
export const STATUS_FILTER_OPTIONS = Object.entries(statusConfig).map(
  ([value, cfg]) => ({ value, label: cfg.label }),
);

export const SOURCE_FILTER_OPTIONS = Object.entries(sourceConfig).map(
  ([value, cfg]) => ({ value, label: cfg.label }),
);

export const TYPE_FILTER_OPTIONS = Object.entries(typeConfig).map(
  ([value, cfg]) => ({ value, label: cfg.label }),
);

// Generic FilterField[] shape, for any shared/reusable filter UI that wants it
export const appointmentFilters: FilterField[] = [
  {
    field: "status",
    label: "Status",
    options: [{ label: "All Status", value: "ALL" }, ...STATUS_FILTER_OPTIONS],
  },
  {
    field: "source",
    label: "Source",
    options: [{ label: "All Sources", value: "ALL" }, ...SOURCE_FILTER_OPTIONS],
  },
  {
    field: "appointment_type",
    label: "Type",
    options: [{ label: "All Types", value: "ALL" }, ...TYPE_FILTER_OPTIONS],
  },
];