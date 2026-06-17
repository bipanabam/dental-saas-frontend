"use client";

import { HeartPulse } from "lucide-react";

/**
 * 1. Fullscreen View
 * Best used for high-level routing transitions or first-time dashboard bootup
 */
export function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/60 backdrop-blur-xs">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-950/40 animate-bounce animation-duration-[1.5s]">
          <HeartPulse size={24} className="animate-pulse" />
        </div>

        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">
          Synchronizing Ledger...
        </p>
      </div>
    </div>
  );
}

/**
 * 2. Section / Container Block Loader
 * Best used for layout slots, tab panels, and grid components
 */
export function SectionLoader({
  message = "Loading clinical details...",
}: {
  message?: string;
}) {
  return (
    <div className="flex min-h-87.5 w-full items-center justify-center p-8 rounded-2xl border border-slate-100 bg-white/50">
      <div className="flex flex-col items-center gap-3.5 text-center">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-950/50">
          <HeartPulse size={22} className="animate-pulse" />
        </div>

        {message && (
          <p className="text-xs font-semibold tracking-wide text-slate-400">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
