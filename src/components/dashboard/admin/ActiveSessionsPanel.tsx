"use client";

import { useState } from "react";
import { Monitor, Smartphone, Globe, LogOut, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import type { TenantSessionOut } from "@/lib/api";

// Device icon
function DeviceIcon({ deviceType }: { deviceType?: string | null }) {
    const t = (deviceType ?? "").toLowerCase();
    if (t.includes("mobile") || t.includes("phone")) {
        return <Smartphone className="h-3.5 w-3.5 text-slate-400" />;
    }
    if (t.includes("browser") || t.includes("web")) {
        return <Globe className="h-3.5 w-3.5 text-slate-400" />;
    }
    return <Monitor className="h-3.5 w-3.5 text-slate-400" />;
}

// Relative time
function relativeTime(dt?: string | null): string {
    if (!dt) return "—";
    const diff = Date.now() - new Date(dt).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}


// Session row
interface SessionRowProps {
    session: TenantSessionOut;
    onRevoke: (sessionId: string, userId: string) => void;
    isRevoking: boolean;
}

function SessionRow({ session, onRevoke, isRevoking }: SessionRowProps) {
    const isExpired = new Date(session.expires_at) < new Date();
    const isStale = !session.is_revoked && !isExpired &&
        session.last_used_at &&
        Date.now() - new Date(session.last_used_at).getTime() > 8 * 3600_000; // >8h

    return (
        <div
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                session.is_revoked || isExpired ? "opacity-40" : "hover:bg-slate-50/60"
            )}
        >
            <DeviceIcon deviceType={session.device_type} />

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-700 truncate">
                        {session.username}
                    </span>
                    {isStale && (
                        <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 rounded-full">
                            idle
                        </span>
                    )}
                    {session.is_revoked && (
                        <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 rounded-full">
                            revoked
                        </span>
                    )}
                </div>
                <p className="text-[10px] text-slate-400 truncate">
                    {session.device_name ?? session.device_type ?? "Unknown device"}
                    {session.ip_address && ` · ${session.ip_address}`}
                    {" · "}active {relativeTime(session.last_used_at)}
                </p>
            </div>

            {!session.is_revoked && !isExpired && (
                <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 shrink-0"
                    onClick={() => onRevoke(session.id, session.user_id)}
                    disabled={isRevoking}
                >
                    <LogOut className="h-3 w-3" />
                </Button>
            )}
        </div>
    );
}


// Main
interface ActiveSessionsPanelProps {
    sessions: TenantSessionOut[];
    onRevokeSession: (sessionId: string, userId: string) => Promise<void>;
    onRefresh: () => void;
    isLoading?: boolean;
}

export default function ActiveSessionsPanel({
    sessions,
    onRevokeSession,
    onRefresh,
    isLoading,
}: ActiveSessionsPanelProps) {
    const [revokingId, setRevokingId] = useState<string>();

    const handleRevoke = async (sessionId: string, userId: string) => {
        setRevokingId(sessionId);
        try {
            await onRevokeSession(sessionId, userId);
        } finally {
            setRevokingId(undefined);
        }
    };

    // Active = not revoked, not expired
    const active = sessions.filter(
        (s) => !s.is_revoked && new Date(s.expires_at) > new Date()
    );
    const inactive = sessions.filter(
        (s) => s.is_revoked || new Date(s.expires_at) <= new Date()
    );

    if (isLoading) {
        return (
            <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-10 rounded-lg bg-slate-100 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Header counts */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] font-bold text-slate-600">
                            {active.length} active
                        </span>
                    </div>
                    {inactive.length > 0 && (
                        <span className="text-[11px] text-slate-400">
                            {inactive.length} inactive
                        </span>
                    )}
                </div>
                <button
                    onClick={onRefresh}
                    className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
                >
                    <RefreshCw className="h-3 w-3" />
                    Refresh
                </button>
            </div>

            {/* Active sessions */}
            {active.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No active sessions</p>
            ) : (
                <div className="space-y-0.5 max-h-96 overflow-y-scroll scrollbar-thin">
                    {active.map((s) => (
                        <SessionRow
                            key={s.id}
                            session={s}
                            onRevoke={handleRevoke}
                            isRevoking={revokingId === s.id}
                        />
                    ))}
                </div>
            )}

            {/* Inactive / revoked -> collapsed by default */}
            {inactive.length > 0 && (
                <details className="group">
                    <summary className="text-[10px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer list-none flex items-center gap-1 px-3">
                        <span className="group-open:rotate-90 transition-transform inline-block">›</span>
                        {inactive.length} inactive / revoked
                    </summary>
                    <div className="mt-1 space-y-0.5 opacity-60">
                        {inactive.slice(0, 5).map((s) => (
                            <SessionRow
                                key={s.id}
                                session={s}
                                onRevoke={handleRevoke}
                                isRevoking={revokingId === s.id}
                            />
                        ))}
                    </div>
                </details>
            )}
        </div>
    );
}