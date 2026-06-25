"use client";

import { Monitor, Smartphone, Tablet, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { SectionLoader } from "@/components/base/loading-view";

import { useGetAllUserSessions } from "@/hooks/users/use-staffs";


export default function StaffSessionsPanel({ userId }: { userId: string }) {
    const { data: allSessions, isLoading } = useGetAllUserSessions();

    if (isLoading) return <SectionLoader message="Loading sessions..." />;
    const sessions = (allSessions as any[])?.filter((s) => s.user_id === userId) ?? [];

    const DeviceIcon = (type: string) => {
        if (type === "mobile") return <Smartphone className="h-4 w-4" />;
        if (type === "tablet") return <Tablet className="h-4 w-4" />;
        return <Monitor className="h-4 w-4" />;
    };

    if (!sessions.length) {
        return (
            <p className="text-xs text-slate-400 text-center py-8">
                No active sessions for this user.
            </p>
        );
    }

    return (
        <div className="space-y-2">
            {sessions.map((s: any) => (
                <div key={s.id} className="rounded-xl border border-slate-200 bg-white p-3 flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                        {DeviceIcon(s.device_type ?? "desktop")}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800">
                                {s.device_name ?? "Unknown device"}
                            </span>
                            <Badge className="text-[9px] px-1.5 h-4 bg-emerald-50 text-emerald-700 border-emerald-200 font-bold">
                                Active
                            </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 text-[11px] text-slate-400">
                            <span>{s.ip_address ?? "Unknown IP"}</span>
                            {s.last_used_at && (
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(s.last_used_at).toLocaleString()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}