import { Card, CardContent } from "@/components/ui/card";
import { EmptyRow, StatusBadge, ToothChips } from "./badges";
import { fmtMoney, fmtDate } from "./utils";

import type { ProcedureSummary } from "@/lib/api";

function ProcedureRow({ procedure }: { procedure: ProcedureSummary }) {
    return (
        <div className="flex items-center justify-between gap-4 py-3">
            <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-800">
                    {procedure.name ?? "Unnamed Procedure"}
                </p>
                <div className="flex items-center gap-2">
                    <StatusBadge status={procedure.status} />
                    {procedure.procedure_date && (
                        <span className="text-xs text-slate-400">{fmtDate(procedure.procedure_date)}</span>
                    )}
                </div>
                {procedure.tooth_numbers && procedure.tooth_numbers.length > 0 && (
                    <ToothChips teeth={procedure.tooth_numbers} />
                )}
            </div>
            <p className="shrink-0 text-sm font-bold text-slate-800">{fmtMoney(procedure.final_cost)}</p>
        </div>
    );
}

export default function ProcedureLedger({ procedures }: { procedures: ProcedureSummary[] }) {
    const total = procedures.reduce((sum, p) => sum + (p.final_cost ?? 0), 0);

    return (
        <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">
                        Performed Procedures
                    </h3>
                </div>

                {procedures.length === 0 ? (
                    <EmptyRow label="No procedures have been performed for this encounter yet." />
                ) : (
                    <>
                        <div className="divide-y divide-slate-50">
                            {procedures.map((p) => (
                                <ProcedureRow key={p.id} procedure={p} />
                            ))}
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                            <p className="text-sm font-bold text-slate-600">Total</p>
                            <p className="text-base font-bold text-slate-900">{fmtMoney(total)}</p>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}