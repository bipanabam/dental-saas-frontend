import { ClipboardCheck, Circle } from "lucide-react";
import { EmptyRow, ToothChips } from "./badges";
import { fmtMoney } from "./utils";

import type { TreatmentPlanOut, TreatmentPlanItemOut } from "@/lib/api";

function groupByVisit(items: TreatmentPlanItemOut[]): Map<number, TreatmentPlanItemOut[]> {
    const map = new Map<number, TreatmentPlanItemOut[]>();
    for (const item of items) {
        const list = map.get(item.visit_number) ?? [];
        list.push(item);
        map.set(item.visit_number, list);
    }
    return new Map([...map.entries()].sort(([a], [b]) => a - b));
}

function PlanItemRow({ item }: { item: TreatmentPlanItemOut }) {
    const performed = !!item.performed_procedure_id;

    return (
        <div className="grid grid-cols-1 gap-2 py-2.5 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-4 text-xs">
            {/* Procedure Metadata */}
            <div className="space-y-1">
                <div className="flex flex-wrap items-baseline gap-2">
                    <p className="text-sm font-bold text-slate-800">
                        {item.procedure_name ?? "Unnamed Procedure"}
                    </p>
                    {item.priority && (
                        <span className="text-[10px] font-mono tracking-wider uppercase px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-medium border border-slate-200/60">
                            {item.priority} Priority
                        </span>
                    )}
                </div>

                {item.tooth_numbers && item.tooth_numbers.length > 0 && (
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-medium text-slate-400">Site:</span>
                        <ToothChips teeth={item.tooth_numbers} />
                    </div>
                )}

                {item.notes && <p className="text-slate-500 max-w-xl italic leading-relaxed">{item.notes}</p>}
            </div>

            {/* Status Indicator Column */}
            <div className="flex items-center gap-1.5 sm:justify-center">
                {performed ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-2 py-0.5 text-[11px]">
                        <ClipboardCheck className="h-3.5 w-3.5" />
                        Executed
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 font-medium text-slate-500 bg-slate-50 border border-slate-200/60 rounded px-2 py-0.5 text-[11px] uppercase tracking-wide font-mono">
                        {item.status || "Pending"}
                    </span>
                )}
            </div>

            {/* Financial Column */}
            <div className="text-left sm:text-right font-mono font-semibold text-slate-700 sm:w-24">
                {fmtMoney(item.estimated_cost)}
            </div>
        </div>
    );
}

export default function TreatmentPlanSection({ plan }: { plan: TreatmentPlanOut | null }) {
    if (!plan || plan.items?.length === 0) {
        return <EmptyRow label="No treatment plan recorded for this encounter." />;
    }

    const visits = groupByVisit(plan.items!);

    return (
        <div className="space-y-6 text-xs">
            {plan.notes && (
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block mb-0.5">
                        Clinical Intent / Directives
                    </span>
                    {plan.notes}
                </div>
            )}

            {/* Structured Sequenced Journey Timeline */}
            <div className="space-y-6 relative before:absolute before:bottom-2 before:top-2 before:left-3.5 before:w-0.5 before:bg-slate-100">
                {[...visits.entries()].map(([visitNumber, items]) => (
                    <div key={visitNumber} className="relative pl-9 group">
                        {/* Header */}
                        <div className="absolute left-1.5 top-0.5 bg-white p-0.5 rounded-full z-10">
                            <Circle className="h-4 w-4 text-brand-600 fill-brand-50" />
                        </div>

                        <div className="mb-2">
                            <p className="text-xs font-bold text-brand-700 uppercase tracking-wider">
                                Phase / Visit {visitNumber}
                            </p>
                        </div>

                        {/* Rows */}
                        <div className="divide-y divide-slate-100 bg-white border border-slate-100 rounded-xl px-4 py-1 shadow-sm shadow-slate-100/40">
                            {items.map((item) => (
                                <PlanItemRow key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Financial Ledger Summary */}
            <div className="flex items-center justify-between border-t pt-4 bg-slate-50/50 -mx-4 px-4 sm:mx-0 sm:px-4 sm:rounded-lg py-3 border border-dashed border-slate-200">
                <div>
                    <p className="text-sm font-bold text-slate-700">Estimated Plan Estimate</p>
                    <p className="text-[10px] text-slate-400">Subject to adjustments based on operational clinical variants.</p>
                </div>
                <p className="text-base font-mono font-bold text-slate-900">{fmtMoney(plan.estimated_total_cost)}</p>
            </div>
        </div>
    );
}