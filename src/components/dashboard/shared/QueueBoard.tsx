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
import { PhoneCall, SkipForward, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import { getQueueStageStyle } from "../stage";

/**
 * Mirrors DoctorQueueListItem / TodaysQueueListItem from /queue. Only
 * patients who've been checked in (and therefore hold a token_number).
 */
export interface QueueBoardItem {
    queueId: string;
    tokenNumber: number;
    status: string; // QueueStatusEnum value
    patientName: string;
    doctorName?: string;
    chiefComplaint?: string | null;
    estimatedWaitMins?: number | null;
}

function WaitCell({ minutes }: { minutes?: number | null }) {
    if (minutes === undefined || minutes === null) {
        return <span className="text-slate-300">—</span>;
    }
    const urgent = minutes >= 25;
    const warm = minutes >= 15 && minutes < 25;

    return (
        <span
            className={cn(
                "font-mono text-sm tabular-nums font-semibold",
                urgent ? "text-rose-600" : warm ? "text-amber-600" : "text-slate-600"
            )}
        >
            {minutes}m
        </span>
    );
}

export default function QueueBoard({
    items,
    loading,
    onCall,
    onSkip,
    onRecall,
    pendingQueueId,
    showDoctorColumn = true,
    emptyLabel = "No one waiting right now.",
}: {
    items: QueueBoardItem[];
    loading?: boolean;
    onCall?: (item: QueueBoardItem) => void;
    onSkip?: (item: QueueBoardItem) => void;
    onRecall?: (item: QueueBoardItem) => void;
    pendingQueueId?: string;
    showDoctorColumn?: boolean;
    emptyLabel?: string;
}) {
    if (loading) {
        return (
            <div className="space-y-2 p-1">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-sm text-slate-400">{emptyLabel}</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="border-slate-100">
                        <TableHead className="w-16 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                            Token
                        </TableHead>
                        <TableHead className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                            Patient
                        </TableHead>
                        {showDoctorColumn && (
                            <TableHead className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                                Doctor
                            </TableHead>
                        )}
                        <TableHead className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                            Status
                        </TableHead>
                        <TableHead className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                            Wait
                        </TableHead>
                        <TableHead className="text-right text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => {
                        const isPending = item.queueId === pendingQueueId;
                        return (
                            <TableRow key={item.queueId} className="border-slate-50 hover:bg-slate-50/60">
                                <TableCell className="font-mono text-sm font-bold text-slate-700">
                                    #{item.tokenNumber}
                                </TableCell>
                                <TableCell>
                                    <div className="font-semibold text-slate-800 text-sm">
                                        {item.patientName}
                                    </div>
                                    {item.chiefComplaint && (
                                        <div className="text-xs text-slate-400 truncate max-w-40">
                                            {item.chiefComplaint}
                                        </div>
                                    )}
                                </TableCell>
                                {showDoctorColumn && (
                                    <TableCell className="text-sm text-slate-500">
                                        {item.doctorName ?? "—"}
                                    </TableCell>
                                )}
                                <TableCell>
                                    <StatusBadge status={getQueueStageStyle(item.status)} />
                                </TableCell>
                                <TableCell>
                                    <WaitCell minutes={item.estimatedWaitMins} />
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        {item.status === "WAITING" && onCall && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                disabled={isPending}
                                                onClick={() => onCall(item)}
                                                className="h-8 rounded-lg text-xs font-semibold gap-1"
                                            >
                                                <PhoneCall className="h-3.5 w-3.5" />
                                                {isPending ? "…" : "Call"}
                                            </Button>
                                        )}
                                        {item.status === "WAITING" && onSkip && (
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                disabled={isPending}
                                                onClick={() => onSkip(item)}
                                                className="h-8 w-8 rounded-lg"
                                                title="Skip"
                                            >
                                                <SkipForward className="h-4 w-4 text-slate-400" />
                                            </Button>
                                        )}
                                        {item.status === "SKIPPED" && onRecall && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                disabled={isPending}
                                                onClick={() => onRecall(item)}
                                                className="h-8 rounded-lg text-xs font-semibold gap-1"
                                            >
                                                <RotateCcw className="h-3.5 w-3.5" />
                                                {isPending ? "…" : "Recall"}
                                            </Button>
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