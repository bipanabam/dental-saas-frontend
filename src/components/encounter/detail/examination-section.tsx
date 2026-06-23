import { EmptyRow } from "./badges";
import { titleCase } from "./utils";

import type { ExaminationEntryOut } from "@/lib/api";

function groupByCategory(entries: ExaminationEntryOut[]): Record<string, ExaminationEntryOut[]> {
    return entries.reduce((acc, entry) => {
        (acc[entry.category] ??= []).push(entry);
        return acc;
    }, {} as Record<string, ExaminationEntryOut[]>);
}

function EntryRow({ entry }: { entry: ExaminationEntryOut }) {
    const isBoolean = entry.value === "true" || entry.value === "false";

    return (
        <div className="flex items-center justify-between py-1.5">
            <span className="text-sm text-slate-600">{titleCase(entry.field_id)}</span>
            {isBoolean ? (
                <span
                    className={`text-xs font-semibold ${entry.value === "true" ? "text-rose-600" : "text-slate-400"
                        }`}
                >
                    {entry.value === "true" ? "Present" : "Absent"}
                </span>
            ) : (
                <span className="text-sm font-semibold text-slate-800">{entry.value}</span>
            )}
        </div>
    );
}

export function ExaminationGroup({ category, entries }: { category: string; entries: ExaminationEntryOut[] }) {
    return (
        <div className="rounded-xl border border-slate-100 p-4">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">{category}</p>
            <div className="divide-y divide-slate-50">
                {entries.map((entry) => (
                    <EntryRow key={entry.id} entry={entry} />
                ))}
            </div>
        </div>
    );
}

export default function ExaminationSection({ findings }: { findings: ExaminationEntryOut[] }) {
    if (findings.length === 0) {
        return <EmptyRow label="No examination recorded for this encounter." />;
    }

    const grouped = groupByCategory(findings);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Object.entries(grouped).map(([category, entries]) => (
                <ExaminationGroup key={category} category={category} entries={entries} />
            ))}
        </div>
    );
}