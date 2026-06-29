import { differenceInMinutes } from "date-fns";

export type ElapsedTier = "fresh" | "warm" | "overdue";

export function getElapsedMinutes(since: string | null | undefined): number | null {
    if (!since) return null;
    return differenceInMinutes(new Date(), new Date(since));
}

export function getElapsedTier(minutes: number | null): ElapsedTier {
    if (minutes == null) return "fresh";
    if (minutes >= 20) return "overdue";
    if (minutes >= 10) return "warm";
    return "fresh";
}

export const ELAPSED_TIER_STYLES: Record<ElapsedTier, string> = {
    fresh: "text-slate-500 bg-slate-50 border-slate-200",
    warm: "text-amber-700 bg-amber-50 border-amber-200",
    overdue: "text-rose-700 bg-rose-50 border-rose-200",
};