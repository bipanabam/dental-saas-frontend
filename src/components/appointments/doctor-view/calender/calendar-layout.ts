import { parseISO } from "date-fns";

import type { AppointmentListItem } from "@/lib/api";

const DEFAULT_DURATION_MINUTES = 30;

export interface PositionedAppointment {
    appointment: AppointmentListItem;
    /** Lane index within overlapping group, 0-based. */
    lane: number;
    /** Total lanes in this appointment's overlapping group. */
    laneCount: number;
    startMinutes: number; // minutes from midnight
    durationMinutes: number;
}

function getRange(appt: AppointmentListItem) {
    const start = parseISO(appt.appointment_date);
    const duration = appt.duration_minutes ?? DEFAULT_DURATION_MINUTES;
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    return { startMinutes, endMinutes: startMinutes + duration, duration };
}

/**
 * Assigns lane positions to overlapping appointments so they render
 * side-by-side instead of stacked on top of each other.
 *
 * Algorithm: sort by start time, greedily place each appointment in the
 * first lane whose previous occupant has already ended. Appointments that
 * transitively overlap (even via a chain, not just pairwise) share the same
 * lane-group width.
 */
export function layoutAppointments(
    appointments: AppointmentListItem[],
): PositionedAppointment[] {
    const sorted = [...appointments].sort(
        (a, b) => parseISO(a.appointment_date).getTime() - parseISO(b.appointment_date).getTime(),
    );

    // lanes[i] = endMinutes of the last appointment currently occupying lane i
    const laneEnds: number[] = [];
    const placements: { appt: AppointmentListItem; lane: number; startMinutes: number; durationMinutes: number; endMinutes: number }[] = [];

    for (const appt of sorted) {
        const { startMinutes, endMinutes, duration } = getRange(appt);

        let lane = laneEnds.findIndex((end) => end <= startMinutes);
        if (lane === -1) {
            lane = laneEnds.length;
            laneEnds.push(endMinutes);
        } else {
            laneEnds[lane] = endMinutes;
        }

        placements.push({ appt, lane, startMinutes, durationMinutes: duration, endMinutes });
    }

    // Group placements into connected overlap clusters so laneCount reflects
    // only the lanes actually contested within that cluster, not the whole day.
    const result: PositionedAppointment[] = [];
    let clusterStart = 0;

    for (let i = 0; i < placements.length; i++) {
        const isLastInCluster =
            i === placements.length - 1 ||
            placements[i + 1].startMinutes >=
                Math.max(...placements.slice(clusterStart, i + 1).map((p) => p.endMinutes));

        if (isLastInCluster) {
            const cluster = placements.slice(clusterStart, i + 1);
            const laneCount = Math.max(...cluster.map((p) => p.lane)) + 1;

            for (const p of cluster) {
                result.push({
                    appointment: p.appt,
                    lane: p.lane,
                    laneCount,
                    startMinutes: p.startMinutes,
                    durationMinutes: p.durationMinutes,
                });
            }

            clusterStart = i + 1;
        }
    }

    return result;
}