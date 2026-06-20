// TaxonomyOverviewCards.tsx
"use client";

import {
    ClipboardList,
    ScanSearch,
    Search,
    Stethoscope,
    Microscope,
    Receipt,
    ArrowRight,
    Database
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useTaxonomy } from "@/hooks/taxonomy/use-taxonomy";

function count(value: unknown) {
    if (!value) return 0;
    if (Array.isArray(value)) return value.length;
    if (typeof value === "object") {
        return Object.values(value).reduce(
            (acc, v) =>
                acc +
                (Array.isArray(v)
                    ? v.length
                    : typeof v === "object"
                        ? Object.keys(v).length
                        : 0),
            0
        );
    }
    return 0;
}
// { count(data?.[step.key as keyof typeof data]) }

export default function TaxonomyOverviewCards() {
    const { data } = useTaxonomy();
    return (
        <div className="space-y-10 py-2">

            {/* SECTION I: ENCOUNTER JOURNEY PROCESS MAP */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-base font-black tracking-tight text-slate-900 uppercase">
                        Encounter Journey
                    </h2>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">
                        Understanding the progression of clinical pipelines and systemic logic.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 relative pt-2">

                    {/* Phase 1: Capture */}
                    <div className="space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                            01 / Capture
                        </span>
                        <div className="flex flex-wrap items-center gap-2 bg-slate-50/50 border border-slate-100 p-3 rounded-2xl min-h-13">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                <ClipboardList className="h-3.5 w-3.5 text-brand-700 shrink-0" />
                                History
                            </span>
                            <ArrowRight className="h-3 w-3 text-slate-300" />
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                <ScanSearch className="h-3.5 w-3.5 text-brand-700 shrink-0" />
                                Examination
                            </span>
                            <ArrowRight className="h-3 w-3 text-slate-300" />
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                <Search className="h-3.5 w-3.5 text-brand-700 shrink-0" />
                                Findings
                            </span>
                        </div>
                    </div>

                    {/* Phase 2: Decision */}
                    <div className="space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-600 block">
                            02 / Decision
                        </span>
                        <div className="flex items-center bg-brand-50/50 border border-brand-100 p-3 rounded-2xl min-h-13">
                            <span className="inline-flex items-center gap-1.5 text-xs font-black text-brand-900">
                                <Stethoscope className="h-3.5 w-3.5 text-brand-700 shrink-0" />
                                Diagnosis
                            </span>
                        </div>
                    </div>

                    {/* Phase 3: Confirmation */}
                    <div className="space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                            03 / Confirmation
                        </span>
                        <div className="flex items-center bg-slate-50/50 border border-dashed border-slate-200 p-3 rounded-2xl min-h-13">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 italic">
                                <Microscope className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                Investigation
                                <span className="text-[9px] font-semibold lowercase opacity-75 tracking-normal bg-slate-200/60 text-slate-500 px-1 py-0.5 rounded">
                                    optional
                                </span>
                            </span>
                        </div>
                    </div>

                    {/* Phase 4: Execution */}
                    <div className="space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                            04 / Execution
                        </span>
                        <div className="flex flex-wrap items-center gap-2 bg-slate-900 border border-slate-950 p-3 rounded-2xl min-h-13 shadow-sm">
                            <span className="inline-flex items-center gap-1.5 text-xs font-black text-white">
                                <Receipt className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                                Treatment Plan
                            </span>
                            <ArrowRight className="h-3 w-3 text-slate-600" />
                            <span className="text-xs font-medium text-slate-300">Procedures</span>
                            <ArrowRight className="h-3 w-3 text-slate-600" />
                            <span className="text-xs font-medium text-slate-300">Billing</span>
                        </div>
                    </div>

                </div>
            </div>

            <hr className="border-slate-100" />

            {/* SECTION II: TAXONOMY SYSTEM METRICS COVERAGE */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-brand-700" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                        System Taxonomy Coverage
                    </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-y-4 gap-x-2 border border-slate-100 bg-white rounded-2xl p-4">

                    <MetricRowItem label="History" count={count(data?.["medical_history" as keyof typeof data])} />
                    <MetricRowItem label="Examination" count={count(data?.["examination" as keyof typeof data])} />
                    <MetricRowItem label="Findings" count={count(data?.["findings" as keyof typeof data])} />
                    <MetricRowItem label="Diagnosis" count={count(data?.["diagnoses" as keyof typeof data])} />
                    <MetricRowItem label="Investigation" count={count(data?.["investigations" as keyof typeof data])} />

                </div>
            </div>

        </div>
    );
}

/* Internal Presentation Subcomponent for Statistical Data Columns */
function MetricRowItem({ label, count }: { label: string; count: number }) {
    return (
        <div className="space-y-0.5 pl-2 border-l border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 block truncate">
                {label}
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-slate-800 font-mono tracking-tight">
                    {count}
                </span>
                <span className="text-[10px] font-medium text-slate-400">items</span>
            </div>
        </div>
    );
}