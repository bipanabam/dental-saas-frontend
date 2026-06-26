"use client";

import { Phone, CalendarClock, CheckCircle2, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { AppointmentListItem } from "@/lib/api";

type Props = {
    pendingConfirmation: AppointmentListItem[];
    completedToday: AppointmentListItem[];
    onReschedule?: (item: AppointmentListItem) => void;
    onFollowUp?: (item: AppointmentListItem) => void;
};

function CompactRow({
    item,
    actionLabel,
    actionColor,
    onAction,
}: {
    item: AppointmentListItem;
    actionLabel: string;
    actionColor: string;
    onAction?: () => void;
}) {
    return (
        <button
            onClick={onAction}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group text-left"
        >
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-700 truncate">
                    {item.patient.first_name} {item.patient.last_name}
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                    {format(new Date(item.appointment_date), "h:mm a")}
                    {item.doctor?.email && ` · ${item.doctor.email}`}
                </p>
            </div>
            <Badge
                variant="outline"
                className={`text-[10px] font-bold px-2 py-0 h-5 shrink-0 ${actionColor}`}
            >
                {actionLabel}
            </Badge>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500 shrink-0" />
        </button>
    );
}

export default function PendingTaskRail({
    pendingConfirmation,
    completedToday,
    onReschedule,
    onFollowUp,
}: Props) {
    const isEmpty = pendingConfirmation.length === 0 && completedToday.length === 0;

    return (
        <Card className="rounded-2xl border-slate-100 shadow-3xs bg-white">
            <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Pending Tasks
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
                {isEmpty && (
                    <p className="text-xs text-slate-400 text-center py-6">
                        No pending tasks right now.
                    </p>
                )}

                {pendingConfirmation.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                Awaiting Confirmation ({pendingConfirmation.length})
                            </p>
                        </div>
                        <div className="space-y-0.5">
                            {pendingConfirmation.slice(0, 5).map((item) => (
                                <CompactRow
                                    key={item.id}
                                    item={item}
                                    actionLabel="Call"
                                    actionColor="bg-sky-50 text-sky-700 border-sky-200"
                                    onAction={() => onReschedule?.(item)}
                                />
                            ))}
                            {pendingConfirmation.length > 5 && (
                                <p className="text-[11px] text-slate-400 text-center py-1">
                                    +{pendingConfirmation.length - 5} more
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {completedToday.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                Completed Today — Schedule Follow-up
                            </p>
                        </div>
                        <div className="space-y-0.5">
                            {completedToday.slice(0, 4).map((item) => (
                                <CompactRow
                                    key={item.id}
                                    item={item}
                                    actionLabel="Follow-up"
                                    actionColor="bg-emerald-50 text-emerald-700 border-emerald-200"
                                    onAction={() => onFollowUp?.(item)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}