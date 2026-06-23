import { StatusBadge } from "./badges";
import { fmtTime, fmtDate, fmtDuration } from "./utils";
import ClinicalSummaryStrip from "./clinical-summary-strip";
import type { EncounterDetail } from "@/lib/api";

type Props = {
    encounter: EncounterDetail;
};

export default function EncounterHeader({ encounter }: Props) {
    return (
        <div className="bg-white border border-slate-200/80 rounded-xl divide-y divide-slate-100 shadow-sm overflow-hidden">
            {/* Top Row: Primary Administrative / Demographics Block */}
            <div className="p-4 sm:p-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between bg-slate-50/40">
                {/* Left: Patient Identity */}
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 font-mono bg-brand-50 border border-brand-100 px-1.5 py-0.5 rounded">
                            Clinical Record
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                            ID: #{encounter.id?.toString().slice(-6) ?? "—"}
                        </span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">
                        {encounter.patient_name}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                        {encounter.doctor_name ? `Attending: ${encounter.doctor_name} · ` : ""}
                        <span className="text-slate-400 font-normal">{fmtDate(encounter.started_at)}</span>
                    </p>
                </div>

                {/* Right: Timing & Status Ledger */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:flex sm:flex-wrap sm:items-start sm:gap-6 text-xs border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Status</p>
                        <StatusBadge status={encounter.status} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Started</p>
                        <p className="font-mono font-semibold text-slate-700 mt-0.5">{fmtTime(encounter.started_at)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Closed</p>
                        <p className="font-mono font-semibold text-slate-700 mt-0.5">{encounter.closed_at ? fmtTime(encounter.closed_at) : "—"}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Duration</p>
                        <p className="font-mono font-semibold text-slate-700 mt-0.5">
                            {fmtDuration(encounter.started_at, encounter.closed_at)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Integrated Clinical Highlights Line */}
            <div className="px-4 py-3 sm:px-5 bg-white">
                <ClinicalSummaryStrip encounter={encounter} />
            </div>
        </div>
    );
}