"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import { getAppointmentStageStyle } from "../stage";
import type { AppointmentListItem } from "@/lib/api";
import { format } from "date-fns";

export interface AppointmentBoardAction {
    label: string;
    onSelect: (item: AppointmentListItem) => void;
    variant?: "default" | "destructive";
    /** Hide this action for items where it doesn't apply (e.g. no Cancel on a COMPLETED row) */
    isVisible?: (item: AppointmentListItem) => boolean;
}

/**
 * The day's booked plan -> every appointment regardless of whether the
 * patient has arrived. This is distinct from QueueBoard (which only shows
 * patients who've already checked in and hold a token). Actions here are
 * appointment-lifecycle actions: Check In, Reschedule, Move (reassign
 * doctor), Cancel — not queue-native actions like Call/Skip.
 */
// Add onConfirm + confirmPendingId to the existing component

export default function AppointmentBoard({
    items,
    loading,
    selectedId,
    onSelectRow,
    onConfirm,
    onCheckIn,
    confirmPendingId,
    checkInPendingId,
    secondaryActions,
    emptyLabel = "No appointments booked for today.",
}: {
    items: AppointmentListItem[];
    loading?: boolean;
    selectedId?: string;
    onSelectRow?: (item: AppointmentListItem) => void;
    onConfirm?: (item: AppointmentListItem) => void;
    onCheckIn?: (item: AppointmentListItem) => void;
    confirmPendingId?: string;
    checkInPendingId?: string;
    secondaryActions?: AppointmentBoardAction[];
    emptyLabel?: string;
}) {
    // ...existing skeleton/empty states unchanged...

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="border-slate-100 bg-slate-50/50">
                        <TableHead className="text-[10px] uppercase tracking-wider text-slate-400 font-bold w-20">Time</TableHead>
                        <TableHead className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Patient</TableHead>
                        <TableHead className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Doctor</TableHead>
                        <TableHead className="text-[10px] uppercase tracking-wider text-slate-400 font-bold w-28">Status</TableHead>
                        <TableHead className="text-right text-[10px] uppercase tracking-wider text-slate-400 font-bold w-36">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => {
                        const isSelected = item.id === selectedId;
                        const isCheckPending = item.id === checkInPendingId;
                        const isConfirmPending = item.id === confirmPendingId;
                        const canConfirm = item.status === "BOOKED";
                        const canCheckIn = item.status === "CONFIRMED";
                        const visibleSecondary = (secondaryActions ?? []).filter(
                            (a) => !a.isVisible || a.isVisible(item)
                        );

                        return (
                            <TableRow
                                key={item.id}
                                onClick={() => onSelectRow?.(item)}
                                className={cn(
                                    "border-slate-50 transition-colors",
                                    onSelectRow && "cursor-pointer",
                                    isSelected ? "bg-brand-50/40" : "hover:bg-slate-50/60"
                                )}
                            >
                                <TableCell className="font-mono text-sm text-slate-500 tabular-nums">
                                    {format(new Date(item.appointment_date), "h:mm a")}
                                </TableCell>

                                <TableCell>
                                    <div className="font-semibold text-slate-800 text-sm leading-tight">
                                        {item.patient.first_name} {item.patient.last_name}
                                    </div>
                                    {item.chief_complaint && (
                                        <div className="text-[11px] text-slate-400 truncate max-w-48 mt-0.5">
                                            {item.chief_complaint}
                                        </div>
                                    )}
                                </TableCell>

                                <TableCell className="text-sm text-slate-500">
                                    { item.doctor?.email ?? (
                                        <span className="text-slate-300 italic text-xs">Unassigned</span>
                                    )}
                                </TableCell>

                                <TableCell>
                                    <StatusBadge status={getAppointmentStageStyle(item.status)} />
                                </TableCell>

                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        {/* Confirm — BOOKED → CONFIRMED */}
                                        {canConfirm && onConfirm && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                disabled={isConfirmPending}
                                                onClick={(e) => { e.stopPropagation(); onConfirm(item); }}
                                                className="h-7 rounded-lg text-[11px] font-semibold border-sky-200 text-sky-700 hover:bg-sky-50"
                                            >
                                                {isConfirmPending ? "…" : "Confirm"}
                                            </Button>
                                        )}

                                        {/* Check In — CONFIRMED → CHECKED_IN */}
                                        {canCheckIn && onCheckIn && (
                                            <Button
                                                size="sm"
                                                disabled={isCheckPending}
                                                onClick={(e) => { e.stopPropagation(); onCheckIn(item); }}
                                                className="h-7 rounded-lg text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                                            >
                                                {isCheckPending ? "…" : "Check In"}
                                            </Button>
                                        )}

                                        {visibleSecondary.length > 0 && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="h-7 w-7 rounded-lg"
                                                    >
                                                        <MoreHorizontal className="h-3.5 w-3.5 text-slate-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {visibleSecondary.map((action) => (
                                                        <DropdownMenuItem
                                                            key={action.label}
                                                            onClick={() => action.onSelect(item)}
                                                            className={cn(
                                                                "text-xs",
                                                                action.variant === "destructive" &&
                                                                "text-rose-600 focus:text-rose-600 focus:bg-rose-50"
                                                            )}
                                                        >
                                                            {action.label}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}