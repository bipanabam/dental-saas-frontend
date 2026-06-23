import { format, formatDistanceStrict } from "date-fns";

export function fmtTime(iso: string | null | undefined): string {
    if (!iso) return "—";
    return format(new Date(iso), "h:mm a");
}

export function fmtDate(iso: string | null | undefined): string {
    if (!iso) return "—";
    return format(new Date(iso), "MMM d, yyyy");
}

export function fmtDuration(start: string, end: string | null | undefined): string {
    if (!end) return "In progress";
    return formatDistanceStrict(new Date(start), new Date(end));
}

export function fmtMoney(value: number | null | undefined): string {
    if (value === null || value === undefined) return "—";
    return `Rs ${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function fmtTeeth(teeth: number[] | null | undefined): string {
    if (!teeth || teeth.length === 0) return "—";
    return teeth.join(", ");
}

export function titleCase(s: string): string {
    return s
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Status -> badge tone mapping shared across encounter detail sections
export const STATUS_TONE: Record<string, string> = {
    completed: "bg-emerald-100 text-emerald-700",
    closed: "bg-emerald-100 text-emerald-700",
    in_progress: "bg-amber-100 text-amber-700",
    open: "bg-amber-100 text-amber-700",
    pending: "bg-slate-100 text-slate-600",
    requested: "bg-slate-100 text-slate-600",
    cancelled: "bg-rose-100 text-rose-700",
    void: "bg-rose-100 text-rose-700",
};

export function statusTone(status: string | null | undefined): string {
    if (!status) return "bg-slate-100 text-slate-600";
    return STATUS_TONE[status.toLowerCase()] ?? "bg-slate-100 text-slate-600";
}