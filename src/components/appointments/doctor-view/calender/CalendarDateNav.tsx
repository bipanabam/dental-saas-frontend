"use client";

import { useState } from "react";
import { format, addDays, isToday } from "date-fns";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface CalendarDateNavProps {
    date: Date;
    onDateChange: (date: Date) => void;
}

export default function CalendarDateNav({ date, onDateChange }: CalendarDateNavProps) {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const onToday = isToday(date);

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-slate-200 bg-white shadow-2xs">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-r-none"
                    onClick={() => onDateChange(addDays(date, -1))}
                    aria-label="Previous day"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-9 px-3 rounded-none border-x border-slate-100 gap-2 font-semibold text-sm min-w-37.5"
                        >
                            <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                            {format(date, "EEE, MMM d")}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(d) => {
                                if (d) {
                                    onDateChange(d);
                                    setPopoverOpen(false);
                                }
                            }}
                            autoFocus
                        />
                    </PopoverContent>
                </Popover>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-l-none"
                    onClick={() => onDateChange(addDays(date, 1))}
                    aria-label="Next day"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {!onToday && (
                <Button
                    variant="outline"
                    size="sm"
                    className="h-9 text-xs font-semibold"
                    onClick={() => onDateChange(new Date())}
                >
                    Today
                </Button>
            )}
        </div>
    );
}