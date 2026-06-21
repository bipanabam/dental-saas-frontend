"use client";

import { useRouter } from "next/navigation";

import { Clock3 } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";

import AppointmentQueueCard from "./AppointmentQueueCard";

import type { TodaysAppointmentListItem } from "@/lib/api";

type SecondaryAction = "reschedule" | "follow_up" | "no_show";

type Props = {
    appointments: TodaysAppointmentListItem[];

    selectedId?: string;
    loading?: boolean;

    onSelect: (item: TodaysAppointmentListItem) => void;
    onAction?: (item: TodaysAppointmentListItem) => void;
    onSecondaryAction?: (
        action: SecondaryAction,
        item: TodaysAppointmentListItem
    ) => void;
    pendingId?: string;   // NEW — id of the appointment currently mutating
};

export default function AppointmentQueue({
    appointments,
    selectedId,
    loading,
    onSelect,
    onAction,
    onSecondaryAction,
    pendingId
}: Props) {

    const router = useRouter();

    if (loading) {
        return (
            <div className="rounded-3xl border bg-white p-10">Loading queue...</div>
        );
    }

    return (
        <div className="rounded-3xl border bg-slate-50 p-4">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-brand-700" />

                        <h2 className="font-black">Visit Queue</h2>
                    </div>

                    <p className="text-xs text-slate-500">
                        Select patient → Continue workflow
                    </p>
                </div>

                <div className="rounded-xl bg-white px-3 py-2 font-black">
                    {appointments.length}
                </div>
            </div>

            <ScrollArea className="h-[90vh]">
                <div className="space-y-3">
                    {appointments.map((item) => (
                        <AppointmentQueueCard
                            key={item.appointment.id}
                            item={item}
                            selected={selectedId === item.appointment.id}
                            onSelect={() => onSelect(item)}
                            onPrimaryAction={(item) =>
                                onAction?.(item)
                            }
                            onSecondaryAction={onSecondaryAction}
                            isPending={pendingId === item.appointment.id}
                        />
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}