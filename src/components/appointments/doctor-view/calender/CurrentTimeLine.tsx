"use client";

import { useEffect, useState } from "react";
import { isToday } from "date-fns";

interface CurrentTimeLineProps {
    date: Date;
    startHour: number;
    endHour: number;
    hourHeight: number;
}

export default function CurrentTimeLine({
    date,
    startHour,
    endHour,
    hourHeight,
}: CurrentTimeLineProps) {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 60_000); // tick every minute
        return () => clearInterval(interval);
    }, []);

    if (!isToday(date)) return null;

    const hour = now.getHours();
    const minute = now.getMinutes();
    if (hour < startHour || hour >= endHour) return null; // outside visible range

    const top = ((hour - startHour) * 60 + minute) / 60 * hourHeight;

    return (
        <div
            className="absolute left-0 right-0 z-20 pointer-events-none flex items-center"
            style={{ top }}
        >
            <div className="h-2 w-2 rounded-full bg-red-500 -ml-1 shrink-0" />
            <div className="h-px flex-1 bg-red-500" />
        </div>
    );
}