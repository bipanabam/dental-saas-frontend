"use client";

import { ClipboardCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AppointmentProcedureResponse } from "@/lib/api";

type Props = {
    procedures: AppointmentProcedureResponse[];
};

export default function PlannedProceduresCard({ procedures }: Props) {
    return (
        <Card className="border-slate-200 bg-white shadow-sm rounded-xl overflow-hidden p-0">
            <div className="bg-slate-50/70 px-3.5 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                    <ClipboardCheck className="h-3 w-3" />
                    Planned For This Visit
                </span>
                <span className="text-[10px] font-mono text-slate-400">{procedures.length}</span>
            </div>

            <CardContent className="p-3.5 space-y-2.5">
                {procedures.map((proc) => (
                    <div key={proc.id} className="flex items-start justify-between gap-2 text-xs">
                        <div className="min-w-0">
                            <p className="font-semibold text-slate-800 truncate">
                                {proc.procedure_catalog?.name ?? "Unnamed procedure"}
                            </p>
                            {proc.tooth_numbers && proc.tooth_numbers.length > 0 && (
                                <p className="text-slate-400 text-[11px] mt-0.5">
                                    Tooth {proc.tooth_numbers.join(", ")}
                                </p>
                            )}
                            {proc.notes && (
                                <p className="text-slate-500 text-[11px] mt-0.5 truncate">{proc.notes}</p>
                            )}
                        </div>
                        {proc.estimated_cost != null && (
                            <span className="font-mono text-[11px] text-slate-500 shrink-0">
                                Rs {proc.estimated_cost.toLocaleString()}
                            </span>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}