"use client";

import Link from "next/link";
import React from "react";
import {
    ArrowRight,
    AlertTriangle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import type { EncounterDetail } from "@/lib/api";

type Props = {
    encounter: EncounterDetail;
};

function Stat({
    label,
    value,
    className = "",
}: {
    label: string;
    value: number | string;
    className?: string;
}) {
    return (
        <div className={`rounded-lg border border-slate-100 bg-slate-50/60 p-2.5 ${className}`}>
            <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                {label}
            </div>
            <div className="mt-0.5 text-sm font-semibold text-slate-800">
                {value}
            </div>
        </div>
    );
}

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400/90">
                {title}
            </div>
            {children}
        </div>
    );
}

export default function EncounterSummary({ encounter }: Props) {
    const procedures = encounter.procedures ?? [];
    
    // Fallbacks for arrays to prevent accidental undefined mapping/length crashes
    const diagnoses = encounter.diagnoses ?? [];
    const clinicalFindings = encounter.clinical_findings ?? [];
    const investigations = encounter.investigations ?? [];
    const treatmentItems = encounter.treatment_plan?.items ?? [];

    // Filter completed treatment plan items (or procedures depending on your schema alignment)
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
        <Card className="sticky top-6 border-slate-200/80 rounded-xl shadow-sm bg-white">
            <CardContent className="p-5 space-y-4">
                
                {/* Header */}
                <div>
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-0.5">
                            <h3 className="text-base font-bold text-slate-900 tracking-tight">
                                Encounter Summary
                            </h3>
                            <p className="text-xs text-slate-400 font-medium">
                                ID: {encounter.id.slice(0, 8).toUpperCase()}
                            </p>
                        </div>
                        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 font-medium capitalize px-2.5 py-0.5">
                            {encounter.status}
                        </Badge>
                    </div>

                    {encounter.chief_complaint && (
                        <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50/40 p-2.5 text-xs text-slate-600 leading-relaxed">
                            <span className="font-semibold text-slate-500 block text-[10px] uppercase tracking-wider mb-0.5">Chief Complaint</span>
                            "{encounter.chief_complaint}"
                        </div>
                    )}
                </div>

                <Separator className="bg-slate-100" />

                {/* Vitals */}
                <Section title="Vitals">
                    <div className="grid grid-cols-2 gap-2">
                        <Stat
                            label="BP"
                            value={`${encounter.bp_systolic ?? "—"}/${encounter.bp_diastolic ?? "—"}`}
                        />
                        <Stat
                            label="Pulse"
                            value={encounter.pulse_rate ? `${encounter.pulse_rate} bpm` : "—"}
                        />
                        <Stat
                            label="Temp"
                            value={encounter.temperature ? `${encounter.temperature} °C` : "—"}
                        />
                        <Stat
                            label="SpO₂"
                            value={encounter.spo2 ? `${encounter.spo2}%` : "—"}
                        />
                    </div>
                </Section>

                <Separator className="bg-slate-100" />

                {/* Clinical Snapshot */}
                <Section title="Clinical Snapshot">
                    <div className="grid grid-cols-2 gap-2">
                        <Stat label="Diagnoses" value={diagnoses.length} />
                        <Stat label="Findings" value={clinicalFindings.length} />
                        <Stat label="Tests / Labs" value={investigations.length} />
                        <Stat label="Procedures" value={procedures.length} />
                    </div>
                </Section>

                {/* Medical Alerts */}
                {alerts.length > 0 && (
                    <>
                        <Separator className="bg-slate-100" />
                        <Section title="Medical Alerts">
                            <div className="flex flex-wrap gap-1.5">
                                {alerts.slice(0, 5).map((alert) => (
                                    <Badge
                                        key={alert}
                                        variant="destructive"
                                        className="text-[10px] font-medium bg-red-50 text-red-700 hover:bg-red-50 border-red-100/80 px-2 py-0.5 shadow-none"
                                    >
                                        <AlertTriangle className="mr-1 h-3 w-3 text-red-500 stroke-[2.5]" />
                                        {alert}
                                    </Badge>
                                ))}
                            </div>
                        </Section>
                    </>
                )}

                {/* Current Diagnosis */}
                {primaryDiagnosis && (
                    <>
                        <Separator className="bg-slate-100" />
                        <Section title="Primary Diagnosis">
                            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-2.5">
                                <div className="text-xs font-semibold text-slate-800">
                                    {primaryDiagnosis.diagnosis_name}
                                </div>
                                {primaryDiagnosis.icd10_code && (
                                    <div className="mt-1 inline-block rounded bg-slate-200/60 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-600">
                                        ICD-10: {primaryDiagnosis.icd10_code}
                                    </div>
                                )}
                            </div>
                        </Section>
                    </>
                )}

                <Separator className="bg-slate-100" />

                {/* Treatment Progress */}
                <Section title="Treatment Progress">
                    <div className="space-y-2">
                        <div className="flex justify-between items-baseline text-xs font-medium text-slate-600">
                            <span>
                                {completedItems.length}/{treatmentItems.length} items complete
                            </span>
                            <span className="font-semibold text-slate-700">
                                Rs. {encounter.treatment_plan?.estimated_total_cost?.toLocaleString() ?? 0}
                            </span>
                        </div>
                        <Progress value={completion} className="h-1.5 bg-slate-100" />
                    </div>
                </Section>

                {/* Actions */}
                <Button
                    asChild
                    variant="outline"
                    className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors mt-2 text-xs font-semibold h-9 rounded-lg"
                >
                    <Link href={`/encounter/${encounter.id}`}>
                        View Full Encounter
                        <ArrowRight className="ml-2 h-3.5 w-3.5 opacity-75" />
                    </Link>
                </Button>

            </CardContent>
        </Card>
    );
}