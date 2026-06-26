"use client";

import {
    CalendarCheck,
    BadgeCheck,
    UserRoundCheck,
    Activity,
    ChevronRight,
    Clock,
    UserX
} from "lucide-react";

import type { AppointmentStats } from "@/lib/api";

import DailyKpiStrip from "../../shared/DailyKpiStrip";

type Props = {
    data?: AppointmentStats;
};

export default function TopMetrics({ data }: Props) {
    const booked = data?.booked ?? 0;
    const checked_in = data?.checked_in ?? 0;
    const confirmed = data?.confirmed ?? 0;
    const progress = data?.in_progress ?? 0;
    const no_show = data?.no_show ?? 0;

    return (
        <div className="space-y-6 w-full">
            <div
                className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6" >
                <DailyKpiStrip
                    title="Booked"
                    value={booked}
                    icon={CalendarCheck}
                    description=""
                />
                <DailyKpiStrip
                    title="Confirmed"
                    value={confirmed}
                    icon={BadgeCheck}
                    description=""
                />
                <DailyKpiStrip
                    title="Check-In"
                    value={checked_in}
                    icon={UserRoundCheck}
                    description=""
                />
                <DailyKpiStrip
                    title="In Progress"
                    value={progress}
                    icon={Activity}
                    description=""
                />
                <DailyKpiStrip
                    title="No Shows"
                    value={no_show}
                    icon={UserX}
                    description=""
                />

            </div>
        </div>
    )
}