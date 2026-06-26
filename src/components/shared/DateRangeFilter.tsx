"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
    label?: string;
    startValue?: string; // ISO date string, e.g. "2026-06-01"
    endValue?: string;
    onChange: (start: string | undefined, end: string | undefined) => void;
};

export default function DateRangeFilter({
    label = "Date Range",
    startValue,
    endValue,
    onChange,
}: Props) {
    const [open, setOpen] = useState(false);

    const range: DateRange | undefined = startValue
        ? {
            from: new Date(startValue),
            to: endValue ? new Date(endValue) : undefined,
        }
        : undefined;

    const display =
        range?.from && range?.to
            ? `${format(range.from, "MMM d")} – ${format(range.to, "MMM d, yyyy")}`
            : range?.from
                ? `${format(range.from, "MMM d, yyyy")} – ...`
                : label;

    const handleSelect = (next: DateRange | undefined) => {
        onChange(
            next?.from ? format(next.from, "yyyy-MM-dd") : undefined,
            next?.to ? format(next.to, "yyyy-MM-dd") : undefined,
        );
        if (next?.from && next?.to) setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-auto justify-start rounded-xl border-slate-100 bg-brand-50 shadow-xs font-normal h-10",
                        !range?.from && "text-slate-500",
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4 text-brand-600 shrink-0" />
                    <span className="truncate">{display}</span>
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="range"
                    defaultMonth={range?.from}
                    selected={range}
                    onSelect={handleSelect}
                    numberOfMonths={2}
                />
            </PopoverContent>
        </Popover>
    );
}