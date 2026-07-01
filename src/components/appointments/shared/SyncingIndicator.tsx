"use client";

import { HeartPulse } from "lucide-react";

export default function SyncingIndicator({ message = "Syncing..." }: { message?: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-950/40">
                <HeartPulse size={22} className="animate-pulse" />
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {message}
            </p>
        </div>
    );
}