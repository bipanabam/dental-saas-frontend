"use client";

import {
    Clock3,
    ArrowRight,
    PlayCircle,
    CheckCircle2,
    User,
    Loader2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import AppointmentActionsMenu from "./AppointmentActionsMenu";

import type {
    TodaysAppointmentListItem,
} from "@/lib/api";

type SecondaryAction = "reschedule" | "follow_up" | "no_show";

type Props = {
    selected?: boolean;
    item: TodaysAppointmentListItem;

    onSelect: () => void;

    onPrimaryAction?: (
        item: TodaysAppointmentListItem
    ) => void;

    onSecondaryAction?: (
        action: SecondaryAction,
        item: TodaysAppointmentListItem
    ) => void;
    isPending?: boolean;
};

const ACTIONS = {
    BOOKED: "Confirm",
    CONFIRMED: "Check In",
    CHECKED_IN: "Start Encounter",
    IN_PROGRESS: "Close Encounter",
    COMPLETED: "Completed",
};

export default function AppointmentQueueCard({
    item,
    selected,
    onSelect,
    onPrimaryAction,
    onSecondaryAction,
    isPending,
}: Props) {
    const a = item.appointment;
    const action = ACTIONS[a.status as keyof typeof ACTIONS];

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onSelect}
            onKeyDown={(e) => {
                if (
                    e.key === "Enter" ||
                    e.key === " "
                ) {
                    onSelect();
                }
            }}
            className={cn(
                "p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left shadow-2xs",
                selected
                    ? "border-brand-600 bg-brand-50 ring-2 ring-brand-500/10"
                    : "border-slate-300 bg-white hover:border-slate-400 hover:shadow-xs"
            )}
        >
            <div className="flex justify-between items-start mb-2.5">
                <Badge variant="outline" className="px-2.5 py-2 bg-brand-50 text-brand-700 text-xs font-bold border border-brand-100">
                    <Clock3 className="mr-1 h-3 w-3" />

                    {new Date(
                        a.appointment_date
                    ).toLocaleTimeString(
                        [],
                        {
                            hour: "2-digit",
                            minute: "2-digit",
                        }
                    )}
                </Badge>

                <div className="flex items-center gap-1">
                    {item.queue && (
                        <Badge className="text-xs font-mono text-white border border-slate-100 px-1.5 py-0.5 rounded">
                            # {item.queue?.token_number}
                        </Badge>
                    )}

                    <AppointmentActionsMenu
                        status={a.status}
                        onAction={(secondaryAction) =>
                            onSecondaryAction?.(secondaryAction, item)
                        }
                    />
                </div>
            </div>
            <h4 className="font-bold text-slate-900 text-base">
                {a.patient.first_name} {a.patient.last_name}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {a.chief_complaint}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-brand-700 flex items-center gap-1">
                    <User className="h-3 w-3" /> {a.doctor?.email}
                </span>
            </div>

            <Button
                size="sm"
                className="mt-5 w-full rounded-xl"
                onClick={(e) => {
                    e.stopPropagation();
                    onPrimaryAction?.(item);
                }}
            >
                {isPending ? (
                    <Loader2 className="animate-spin" />
                ) : a.status === "CHECKED_IN" ? (
                    <PlayCircle />
                ) : (
                    <CheckCircle2 />
                )}

                {isPending ? "Processing..." : action}

                {!isPending && <ArrowRight />}
            </Button>
        </div>
    );
}