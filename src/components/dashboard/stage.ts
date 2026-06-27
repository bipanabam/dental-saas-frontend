/**
 * Single source of truth for "status pill" visuals across dashboards.
 *
 * Two genuinely different backend resources feed reception/doctor/admin
 * screens, and they must NOT be collapsed into one enum:
 *
 *   - AppointmentStatusEnum: the day's PLAN. BOOKED -> CONFIRMED ->
 *     CHECKED_IN -> IN_PROGRESS -> COMPLETED, or CANCELLED / NO_SHOW.
 *     Lives in /appointments. Exists the moment a slot is booked, whether
 *     or not the patient has arrived yet.
 *
 *   - QueueStatusEnum: the physical ROOM right now. A queue row only
 *     exists once an appointment is checked in (POST /appointments/{id}/check-in
 *     returns token_number + queue_id). WAITING -> CALLED -> IN_PROGRESS ->
 *     COMPLETED, or SKIPPED / NO_SHOW. Lives in /queue.
 *
 * Appointment badge colors are derived directly from statusConfig in
 * @/lib/appointments so the two systems stay in sync automatically.
 * Queue colors are defined locally since they have no equivalent in
 * statusConfig (different resource, different lifecycle).
 */

import { statusConfig } from "@/types/appointments";

export interface StageStyle {
  /** Full Tailwind class string for the pill: bg + text + ring */
  badge: string;
  dot: string;
  label: string;
}

function appointmentStageStyle(status: string): StageStyle {
  const cfg = statusConfig[status as keyof typeof statusConfig];

  if (!cfg) {
    return {
      badge: "bg-slate-100 text-slate-600 ring-slate-200",
      dot: "bg-slate-400",
      label: status,
    };
  }

  const badge = cfg.className
    .split(" ")
    .map((cls) => (cls.startsWith("border-") ? cls.replace("border-", "ring-") : cls))
    .join(" ");

  return {
    badge,
    dot: cfg.dot,
    label: cfg.label,
  };
}

// Memoised map — built once at module load, O(1) lookups at runtime.
const APPOINTMENT_STAGE_CACHE = new Map<string, StageStyle>();

export function getAppointmentStageStyle(status: string): StageStyle {
  if (!APPOINTMENT_STAGE_CACHE.has(status)) {
    APPOINTMENT_STAGE_CACHE.set(status, appointmentStageStyle(status));
  }
  return APPOINTMENT_STAGE_CACHE.get(status)!;
}


// Queue status -> StageStyle
const QUEUE_STAGE_STYLES: Record<string, StageStyle> = {
  WAITING:     { badge: "bg-amber-50 text-amber-700 ring-amber-200",     dot: "bg-amber-500",   label: "Waiting"     },
  CALLED:      { badge: "bg-blue-50 text-blue-700 ring-blue-200",        dot: "bg-blue-500",    label: "Called"      },
  IN_PROGRESS: { badge: "bg-violet-50 text-violet-700 ring-violet-200",  dot: "bg-violet-500",  label: "In Progress" },
  COMPLETED:   { badge: "bg-indigo-50 text-indigo-700 ring-indigo-200",  dot: "bg-indigo-500",  label: "Completed"   },
  SKIPPED:     { badge: "bg-rose-50 text-rose-700 ring-rose-200",        dot: "bg-rose-500",    label: "Skipped"     },
  NO_SHOW:     { badge: "bg-red-50 text-red-700 ring-red-200",           dot: "bg-red-500",     label: "No Show"     },
};

export function getQueueStageStyle(status: string): StageStyle {
  return (
    QUEUE_STAGE_STYLES[status] ?? {
      badge: "bg-slate-100 text-slate-600 ring-slate-200",
      dot: "bg-slate-400",
      label: status,
    }
  );
}