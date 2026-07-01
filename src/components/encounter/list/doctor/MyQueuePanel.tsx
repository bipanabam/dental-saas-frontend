"use client";

import { Users, Clock3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useDoctorQueue } from "@/hooks/queues/use-queue";
import { normalizeDoctorItem } from "@/lib/queue/normalize-queue";
import { useTenant } from "@/providers/tenant-provider";

export default function MyQueuePanel() {
    const { session } = useTenant();
    const doctorId = session?.user?.id;

    const { data } = useDoctorQueue(doctorId);
    const queue = (data?.items ?? []).map(normalizeDoctorItem);
    const waiting = queue.filter((q) => q.status === "WAITING" || q.status === "CALLED");

    if (waiting.length === 0) return null;

    return (
        <Card className="rounded-2xl border border-slate-100 bg-white shadow-xs">
            <CardContent className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-800">Waiting For You</span>
                    </div>
                    <Badge variant="secondary" className="text-xs font-bold">{waiting.length}</Badge>
                </div>
                {waiting.map((item) => (
                    <div key={item.queueId} className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700">
                            #{item.tokenNumber} · {item.patientFirstName} {item.patientLastName}
                        </span>
                        <span className="text-slate-400 flex items-center gap-1">
                            <Clock3 className="h-3 w-3" />
                            {item.estimatedWaitMins != null ? `~${item.estimatedWaitMins}m` : "—"}
                        </span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}