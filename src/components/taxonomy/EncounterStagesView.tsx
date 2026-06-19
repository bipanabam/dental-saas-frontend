import { Badge } from "../ui/badge";

const severityDot: Record<string, string> = {
    critical: "bg-rose-500 shadow-rose-200 ring-rose-100",
    warning: "bg-amber-500 shadow-amber-200 ring-amber-100",
    info: "bg-sky-400 shadow-sky-200 ring-sky-100",
};

export type SeverityItem = { id: string; label: string; type: "critical" | "warning" | "info" };
export type FieldItem = { id: string; label: string; type: string; options?: string[] };

// Category label
const SectionHeader = ({ title }: { title: string }) => (
    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 select-none border-b border-slate-50 pb-1">
        {title.replace("_", " ")}
    </h5>
);


// Medical history style -> list of { id, label, type: critical|warning|info } grouped by category
export const SeverityGroups = ({ data }: { data: Record<string, SeverityItem[]> }) => {
    if (!Object.keys(data).length) return <EmptyPane />;
    return (
        <div className="space-y-4">
            {Object.entries(data).map(([category, items]) => (
                <div key={category}>
                    <SectionHeader title={category} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-2 text-sm bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
                            >
                                <span
                                    className={`h-2 w-2 rounded-full shrink-0 ${severityDot[item.type] ?? "bg-slate-300 ring-slate-100"}`}
                                />
                                <span className="text-slate-600 font-bold tracking-tight line-clamp-1">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// Examination style -> list of { id, label, type, options? } grouped by category, shows field type
export const FieldGroups = ({ data }: { data: Record<string, FieldItem[]> }) => {
    if (!Object.keys(data).length) return <EmptyPane />;
    return (
        <div className="space-y-4">
            {Object.entries(data).map(([category, items]) => (
                <div key={category}>
                    <SectionHeader title={category} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between gap-2 text-sm bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
                            >
                                <span className="text-slate-600 font-bold tracking-tight line-clamp-1">{item.label}</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md font-sans shrink-0">
                                    {item.type}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// Findings / Diagnoses / Investigations style -> flat string arrays grouped by category, shown as chips
export const GroupedChips = ({ data }: { data: Record<string, string[]> }) => {
    if (!Object.keys(data).length) return <EmptyPane />;
    return (
        <div className="space-y-5">
            {Object.entries(data).map(([category, items]) => (
                <div key={category} className="space-y-2">
                    <SectionHeader title={category} />
                    <div className="flex flex-wrap gap-1.5">
                        {items.map((item) => (
                            <Badge
                                key={item}
                                variant="outline"
                                className="text-xs font-bold bg-white border-slate-200/80 rounded-xl px-3 py-1 text-slate-600 shadow-4xs normal-case tracking-tight hover:border-slate-300 transition-colors"
                            >
                                {item}
                            </Badge>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

/* fallback component */
const EmptyPane = () => (
    <div className="py-6 text-center text-xs italic text-slate-400 font-medium">
        No taxonomy keys mapped under current data-key.
    </div>
);