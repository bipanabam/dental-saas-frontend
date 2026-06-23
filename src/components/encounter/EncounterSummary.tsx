"use client";

import React from "react";
import { AlertTriangle, TrendingUp, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { EncounterDetail } from "@/lib/api";

type Props = { encounter: EncounterDetail };

export default function EncounterSummary({ encounter }: Props) {
    const procedures = encounter.procedures ?? [];
    const diagnoses = encounter.diagnoses ?? [];
    const clinicalFindings = encounter.clinical_findings ?? [];
    const investigations = encounter.investigations ?? [];
    const treatmentItems = encounter.treatment_plan?.items ?? [];

    const completedItems = treatmentItems.filter(
        (item: any) => item.status === "DONE" || item.status === "COMPLETED"
    );

    const completion = treatmentItems.length
        ? Math.round((completedItems.length / treatmentItems.length) * 100)
        : 0;

    const alerts = [
        encounter.medical_history?.is_diabetic && "Diabetes",
        encounter.medical_history?.has_hypertension && "Hypertension",
        encounter.medical_history?.has_heart_condition && "Heart Condition",
        encounter.medical_history?.has_medication_allergy && "Drug Allergy",
        encounter.medical_history?.is_on_blood_thinners && "Blood Thinners",
    ].filter(Boolean) as string[];

    const primaryDiagnosis = diagnoses.find((d) => d.is_primary) ?? diagnoses[0];

    return (
        <Card className="border-slate-200 bg-white shadow-sm rounded-xl overflow-hidden p-0">
            {/* Header */}
            <div className="bg-slate-50/70 px-3.5 py-2 border-b border-slate-100 flex items-center justify-between pt-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Encounter Record
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                    #{encounter.id.slice(0, 6).toUpperCase()}
                </span>
            </div>

            <CardContent className="p-3.5 space-y-3.5">
                {/* Medical Alerts*/}
                {alerts.length > 0 && (
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-red-500/90 tracking-wide">
                            <ShieldAlert className="h-3 w-3 stroke-[2.5]" />
                            Active Clinical Alerts
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {alerts.map((alert) => (
                                <Badge
                                    key={alert}
                                    variant="destructive"
                                    className="text-[9px] font-semibold bg-red-50 text-red-700 border-red-100/60 px-1.5 py-0 shadow-none rounded"
                                >
                                    {alert}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Primary Diagnosis Summary */}
                {primaryDiagnosis ? (
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Primary Diagnosis</span>
                        <div className="text-xs font-semibold text-slate-800 leading-tight">
                            {primaryDiagnosis.diagnosis_name}
                            {primaryDiagnosis.icd10_code && (
                                <span className="ml-1.5 font-mono text-[9px] bg-slate-100 border text-slate-500 px-1 rounded font-medium">
                                    {primaryDiagnosis.icd10_code}
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-xs text-slate-400 italic">No diagnosis documented yet</div>
                )}

                <Separator className="bg-slate-100" />

                {/* Micro Snapshot Statistics Grid */}
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Record Entries</span>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                        <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                            <span className="text-slate-500">Diagnoses</span>
                            <span className="font-bold text-slate-700">{diagnoses.length}</span>
                        </div>
                        <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                            <span className="text-slate-500">Findings</span>
                            <span className="font-bold text-slate-700">{clinicalFindings.length}</span>
                        </div>
                        <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                            <span className="text-slate-500">Labs / Orders</span>
                            <span className="font-bold text-slate-700">{investigations.length}</span>
                        </div>
                        <div className="flex justify-between items-center py-0.5 border-b border-dashed border-slate-100">
                            <span className="text-slate-500">Procedures</span>
                            <span className="font-bold text-slate-700">{procedures.length}</span>
                        </div>
                    </div>
                </div>

                <Separator className="bg-slate-100" />
                {/* Treatment Progress Block */}
                <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <span>Treatment Plan</span>
                        <span className="font-bold font-mono normal-case text-xs text-slate-700">
                            Rs. {encounter.treatment_plan?.estimated_total_cost?.toLocaleString() ?? 0}
                        </span>
                    </div>
                    <div className="space-y-1">
                        <Progress value={completion} className="h-1 bg-slate-100" />
                        <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                            <span>{completedItems.length}/{treatmentItems.length} Actions done</span>
                            <span>{completion}%</span>
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}