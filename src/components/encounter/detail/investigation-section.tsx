"use client";

import { useState } from "react";
import { ChevronRight, FileText } from "lucide-react";

import { EmptyRow, StatusBadge } from "./badges";
import { fmtDate } from "./utils";

import type { InvestigationOut } from "@/lib/api";

function InvestigationRow({ investigation }: { investigation: InvestigationOut }) {
    const [open, setOpen] = useState(false);
    const hasDetail = !!(investigation.result || investigation.notes || investigation.result_file_url);

    return (
        <div className="border-b border-slate-50 last:border-0">
            <button
                onClick={() => hasDetail && setOpen((o) => !o)}
                className={`grid w-full grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-2 py-3 text-left ${hasDetail ? "cursor-pointer hover:bg-slate-50" : "cursor-default"
                    }`}
            >
                <span className="text-sm font-medium text-slate-800">{investigation.investigation_name}</span>
                <StatusBadge status={investigation.status} />
                <span className="text-xs text-slate-400">{fmtDate(investigation.requested_at)}</span>
                <span className="text-xs text-slate-400">{fmtDate(investigation.completed_at)}</span>
            </button>

            {open && hasDetail && (
                <div className="space-y-2 px-2 pb-4">
                    {investigation.result && (
                        <div className="rounded-lg bg-slate-50 px-3 py-2">
                            <p className="text-[11px] font-semibold uppercase text-slate-400">Result</p>
                            <p className="text-sm text-slate-700">{investigation.result}</p>
                        </div>
                    )}
                    {investigation.notes && (
                        <div className="rounded-lg bg-slate-50 px-3 py-2">
                            <p className="text-[11px] font-semibold uppercase text-slate-400">Notes</p>
                            <p className="text-sm text-slate-700">{investigation.notes}</p>
                        </div>
                    )}
                    {investigation.result_file_url && (
                        <a
                            href={investigation.result_file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline"
                        >
                            <FileText className="h-3.5 w-3.5" />
                            View attached report
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}

export default function InvestigationSection({ investigations }: { investigations: InvestigationOut[] }) {
    if (investigations.length === 0) {
        return <EmptyRow label="No investigations recorded for this encounter." />;
    }

    return (
        <div>
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-2 pb-2 text-[11px] font-bold uppercase text-slate-400">
                <span>Investigation</span>
                <span>Status</span>
                <span>Requested</span>
                <span>Completed</span>
            </div>
            {investigations.map((inv) => (
                <InvestigationRow key={inv.id} investigation={inv} />
            ))}
        </div>
    );
}