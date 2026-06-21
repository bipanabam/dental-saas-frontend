"use client";

import {
    User,
    Phone,
    CalendarCheck,
    ShieldAlert,
    Sparkles,
    IdCard,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { getAge } from "@/lib/utils/get-age";

import type { PatientDetail } from "@/lib/api";


interface Props {
    patient: PatientDetail;
}


function formatDate(date?: string | null) {
    if (!date) return "No visits yet";

    return new Intl.DateTimeFormat(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    ).format(new Date(date));
}

export default function AppointmentPatientCard({
    patient,
}: Props) {
    const age = getAge(
        patient.date_of_birth
    );

    const fullName = [
        patient.first_name,
        patient.last_name,
    ]
        .filter(Boolean)
        .join(" ");

    const allergies =
        patient.medical_record?.allergies;

    return (
        <Card className="overflow-hidden rounded-2xl border bg-white shadow-4xs p-0">

            <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                {/* Identity */}
                <div className="flex items-center gap-3 md:border-r border-slate-200 pr-2">
                    <div className="h-10 w-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 shrink-0 shadow-5xs">
                        <User className="h-5 w-5 stroke-[2.2]" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-sm font-black text-slate-900 tracking-tight truncate leading-tight">
                            {patient.first_name} {patient.last_name}
                        </h3>

                        <div className="flex items-center gap-1 text-xs font-bold text-slate-400 mt-0.5">
                            <IdCard className="h-3 w-3 shrink-0" />
                            <span className="font-mono tracking-wider">{patient.patient_code || "BDC-000000"}</span>
                        </div>
                    </div>
                </div>

                {/* Demographics */}
                <div className="space-y-1 md:border-r border-slate-200 md:px-2">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                        <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono">{patient.phone || "No Contact"}</span>
                    </div>

                    <p className="text-xs font-bold text-slate-400 pl-5">
                        {patient.gender}
                        <span className="text-slate-300 mx-1">•</span>
                        {age !== null
                            ? `${age} yrs`
                            : "Age unavailable"}
                    </p>

                </div>

                {/* Visits */}
                <div className="space-y-1 md:border-r border-slate-200 md:px-2">
                    <p className="text-[10px] font-semibold uppercase text-slate-400">
                        Last Visit
                    </p>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mt-1">
                        <CalendarCheck className="h-3.5 w-3.5 text-brand-600 shrink-0" />

                        <span>
                            {formatDate(
                                patient.last_visit_at
                            )}
                        </span>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        {patient.visit_count} visits
                    </p>

                </div>

                {/* Category */}
                <div className="flex items-center justify-between md:justify-end gap-3 md:pl-2">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block md:text-right leading-none">
                            Patient Category
                        </span>
                        <div className="pt-0.5 md:text-right">
                            <Badge
                                variant="outline"
                                className="bg-brand-50/50 text-brand-700 border-brand-100 text-[10px] font-black rounded-lg uppercase tracking-wider px-2 py-0.5"
                            >
                                <Sparkles className="h-2.5 w-2.5 mr-1 text-brand-600 shrink-0" />
                                {patient.category || "REGULAR"}
                            </Badge>
                        </div>
                    </div>
                </div>

            </div>

            {!!allergies && (
                <div className="flex gap-2 border-t bg-rose-50 px-4 py-3 text-rose-700">

                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />

                    <p className="text-xs">
                        <strong>Medical Alert:</strong>{" "}
                        {allergies}
                    </p>

                </div>
            )}

        </Card>
    );
}