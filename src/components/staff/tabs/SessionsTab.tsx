"use client";

import { useState } from "react";
import {
    Monitor, Smartphone, Tablet, Clock, MapPin,
    LogOut, LogOutIcon, AlertTriangle, Wifi,
    ChevronRight
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    AlertDialog, AlertDialogContent, AlertDialogHeader,
    AlertDialogTitle, AlertDialogDescription,
    AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { SectionLoader } from "@/components/base/loading-view";

import { useUserSessions, useRevokeSession, useRevokeAllSessions } from "@/hooks/users/use-staff-detail";

function DeviceIcon({ type }: { type?: string | null }) {
    if (type === "mobile") return <Smartphone className="h-4 w-4" />;
    if (type === "tablet") return <Tablet className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
}

function formatRelative(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return new Date(date).toLocaleDateString();
}

export default function SessionsTab({ userId }: { userId: string }) {
    const { data, isLoading } = useUserSessions(userId);
    const revokeOne = useRevokeSession(userId);
    const revokeAll = useRevokeAllSessions(userId);
    const [confirmAll, setConfirmAll] = useState(false);

    if (isLoading) return <SectionLoader message="Loading sessions..." />;

    const sessions = (data as any)?.sessions ?? [];
    const activeSessions = sessions.filter((s: any) => !s.is_revoked);
    const revokedSessions = sessions.filter((s: any) => s.is_revoked);

    return (
        <div className="space-y-4">
            {/* Header with revoke-all */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[14px] font-bold text-slate-700">
                        {activeSessions.length} active session{activeSessions.length !== 1 ? "s" : ""}
                    </p>
                    <p className="text-[11px] text-slate-400">
                        Each session represents a logged-in device.
                    </p>
                </div>
                {activeSessions.length > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl text-xs gap-1.5 text-rose-600 border-rose-200 hover:bg-rose-50"
                        onClick={() => setConfirmAll(true)}
                        disabled={revokeAll.isPending}
                    >
                        <LogOutIcon className="h-3.5 w-3.5" />
                        Revoke All
                    </Button>
                )}
            </div>

            {activeSessions.length === 0 ? (
                <Card className="rounded-2xl border-dashed border-slate-200">
                    <CardContent className="py-10 text-center">
                        <p className="text-xs text-slate-400">No active sessions found.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-2">
                    {activeSessions.map((s: any) => (
                        <Card key={s.id} className="rounded-2xl border-slate-200 shadow-sm">
                            <CardContent className="p-4 flex items-start gap-3">
                                <div className={`
                                        h-9 w-9 rounded-xl flex items-center justify-center shrink-0
                                        ${s.device_type === "mobile" ? "bg-blue-50 text-blue-600" :
                                        s.device_type === "tablet" ? "bg-purple-50 text-purple-600" :
                                            "bg-slate-100 text-slate-600"}`}>
                                    <DeviceIcon type={s.device_type} />
                                </div>

                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm font-bold text-slate-800">
                                            {s.device_name ?? "Unknown device"}
                                        </span>
                                        <Badge className="text-[9px] px-1.5 h-4 bg-emerald-50 text-emerald-700 border-emerald-200 font-bold gap-1">
                                            <Wifi className="h-2.5 w-2.5" /> Active
                                        </Badge>
                                    </div>

                                    <div className="flex flex-wrap gap-3 text-[11px] text-slate-400">
                                        {s.ip_address && (
                                            <span className="flex items-center gap-1 font-mono">
                                                <MapPin className="h-3 w-3" /> {s.ip_address}
                                            </span>
                                        )}
                                        {s.last_used_at && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                Last seen {formatRelative(s.last_used_at)}
                                            </span>
                                        )}
                                        <span className="text-[10px]">
                                            Expires {new Date(s.expires_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 rounded-lg text-[11px] text-rose-500 hover:bg-rose-50 hover:text-rose-600 shrink-0"
                                    onClick={() => revokeOne.mutate(s.id)}
                                    disabled={revokeOne.isPending && revokeOne.variables === s.id}
                                >
                                    <LogOut className="h-3.5 w-3.5 mr-1" />
                                    Revoke
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Revoked history — collapsed */}
            {revokedSessions.length > 0 && (
                <details className="group">
                    <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600 font-semibold list-none flex items-center gap-1.5">
                        <ChevronRight className="group-open:rotate-90 transition-transform inline-block" size={16} />
                        {revokedSessions.length} revoked session{revokedSessions.length !== 1 ? "s" : ""}
                    </summary>
                    <div className="mt-2 space-y-1.5">
                        {revokedSessions.map((s: any) => (
                            <div key={s.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-100 bg-slate-50/50 opacity-60">
                                <DeviceIcon type={s.device_type} />
                                <span className="text-xs text-slate-500 flex-1">
                                    {s.device_name ?? "Unknown"} · Revoked {s.revoked_at ? formatRelative(s.revoked_at) : ""}
                                </span>
                            </div>
                        ))}
                    </div>
                </details>
            )}

            <AlertDialog open={confirmAll} onOpenChange={setConfirmAll}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-rose-500" />
                            Revoke all sessions?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This will immediately sign the user out of all {activeSessions.length} active device{activeSessions.length !== 1 ? "s" : ""}.
                            They will need to log in again.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => { revokeAll.mutate(); setConfirmAll(false); }}
                            className="bg-rose-600 hover:bg-rose-700"
                        >
                            Revoke All
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}