import { titleCase, statusTone } from "./utils";

export function StatusBadge({ status }: { status: string | null | undefined }) {
    if (!status) return null;
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusTone(
                status
            )}`}
        >
            {titleCase(status)}
        </span>
    );
}

export function PriorityBadge({ priority }: { priority: number }) {
    // 1 = high, 2 = medium, 3 = low — adjust mapping if backend differs
    const map: Record<number, { label: string; tone: string }> = {
        1: { label: "High", tone: "bg-rose-100 text-rose-700" },
        2: { label: "Medium", tone: "bg-amber-100 text-amber-700" },
        3: { label: "Low", tone: "bg-slate-100 text-slate-600" },
    };
    const entry = map[priority] ?? { label: `P${priority}`, tone: "bg-slate-100 text-slate-600" };
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${entry.tone}`}>
            {entry.label}
        </span>
    );
}

export function ToothChips({ teeth }: { teeth: number[] | null | undefined }) {
    if (!teeth || teeth.length === 0) return null;
    return (
        <div className="flex flex-wrap gap-1">
            {teeth.map((t) => (
                <span
                    key={t}
                    className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-1.5 text-[11px] font-semibold text-slate-600"
                >
                    {t}
                </span>
            ))}
        </div>
    );
}

export function EmptyRow({ label }: { label: string }) {
    return <p className="text-sm text-slate-400 italic">{label}</p>;
}