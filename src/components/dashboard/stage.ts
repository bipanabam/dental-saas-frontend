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
 * Collapsing these hides exactly the signal a front desk needs: "12 booked
 * today, only 4 physically here, 1 of those skipped twice" requires
 * knowing which system a given status came from. So: one shared tone/color
 * primitive, two separate mapping functions that each own their real enum.
 */

export type StageTone =
    | "neutral"
    | "info"
    | "warning"
    | "active"
    | "progress"
    | "success"
    | "danger"
    | "muted";

interface ToneStyle {
    badge: string;
    dot: string;
}

const TONE_STYLES: Record<StageTone, ToneStyle> = {
    neutral: { badge: "bg-slate-100 text-slate-600 ring-slate-200", dot: "bg-slate-400" },
    info: { badge: "bg-sky-50 text-sky-700 ring-sky-200", dot: "bg-sky-500" },
    warning: { badge: "bg-amber-50 text-amber-700 ring-amber-200", dot: "bg-amber-500" },
    active: { badge: "bg-blue-50 text-blue-700 ring-blue-200", dot: "bg-blue-500" },
    progress: { badge: "bg-violet-50 text-violet-700 ring-violet-200", dot: "bg-violet-500" },
    success: { badge: "bg-emerald-50 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" },
    danger: { badge: "bg-rose-50 text-rose-700 ring-rose-200", dot: "bg-rose-500" },
    muted: { badge: "bg-slate-100 text-slate-400 ring-slate-200", dot: "bg-slate-300" },
};

export interface StageStyle extends ToneStyle {
    label: string;
}

function style(label: string, tone: StageTone): StageStyle {
    return { label, ...TONE_STYLES[tone] };
}

// Appointment lifecycle (AppointmentStatusEnum)
const APPOINTMENT_STAGE_STYLES: Record<string, StageStyle> = {
    BOOKED: style("Booked", "warning"),
    CONFIRMED: style("Confirmed", "info"),
    CHECKED_IN: style("Checked In", "active"),
    IN_PROGRESS: style("In Progress", "progress"),
    COMPLETED: style("Completed", "success"),
    NO_SHOW: style("No Show", "danger"),
    CANCELLED: style("Cancelled", "muted"),
};

export function getAppointmentStageStyle(status: string): StageStyle {
    return APPOINTMENT_STAGE_STYLES[status] ?? style(status, "neutral");
}

// Queue status (QueueStatusEnum) ----
// Adjust these keys if your actual QueueStatusEnum member names differ.
const QUEUE_STAGE_STYLES: Record<string, StageStyle> = {
    WAITING: style("Waiting", "warning"),
    CALLED: style("Called", "active"),
    IN_PROGRESS: style("In Progress", "progress"),
    COMPLETED: style("Completed", "success"),
    SKIPPED: style("Skipped", "danger"),
    NO_SHOW: style("No Show", "danger"),
};

export function getQueueStageStyle(status: string): StageStyle {
    return QUEUE_STAGE_STYLES[status] ?? style(status, "neutral");
}