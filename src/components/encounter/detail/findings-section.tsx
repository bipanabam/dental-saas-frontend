import { EmptyRow, ToothChips } from "./badges";
import type { ClinicalFindingOut } from "@/lib/api";

export default function FindingsSection({ findings }: { findings: ClinicalFindingOut[] }) {
    if (findings.length === 0) {
        return <EmptyRow label="No clinical findings recorded for this encounter." />;
    }

    return (
        <div className="divide-y divide-slate-100 text-xs">
            {findings.map((finding) => (
                <div
                    key={finding.id}
                    className="py-3 first:pt-0 last:pb-0 grid grid-cols-1 gap-2 sm:grid-cols-[140px_1fr]"
                >
                    {/* Left Column: Anatomical Site / Coding Index */}
                    <div className="space-y-1.5 shrink-0">
                        {finding.tooth_numbers && finding.tooth_numbers.length > 0 ? (
                            <div className="flex flex-wrap items-center gap-1">
                                <ToothChips teeth={finding.tooth_numbers} />
                            </div>
                        ) : (
                            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/50">
                                Systemic / General
                            </span>
                        )}

                        {finding.finding_code && (
                            <div className="text-[10px] font-mono text-slate-400 font-medium">
                                Ref: {finding.finding_code}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Observation & Progress Notes */}
                    <div className="space-y-1">
                        <div className="flex items-baseline justify-between gap-2">
                            <h4 className="text-sm font-bold text-slate-800 leading-tight">
                                {finding.finding_name}
                            </h4>
                        </div>

                        {finding.notes && (
                            <p className="text-slate-600 font-normal leading-relaxed text-xs border-l-2 border-slate-200 pl-2.5 mt-1 py-0.5">
                                {finding.notes}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}