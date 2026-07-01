"use client";

import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";

import type { EncounterDetail } from "@/lib/api";

type Props = {
    encounter: EncounterDetail;
};

export default function EncounterBreadcrumb({ encounter }: Props) {
    return (
        <div className="flex items-center gap-2.5 text-sm">
            <Link
                href={`/appointments/${encounter.appointment_id}`}
                className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors font-medium"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Appointment
            </Link>

            <span className="text-slate-300">/</span>
            <Link
                href={`/patients/${encounter.patient_id}`}
                 className="flex items-center gap-1.5 min-w-0">
                <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-800 truncate">
                    {encounter.patient_name ?? "Unknown Patient"}
                </span>
            </Link>

            {encounter.doctor_name && (
                <>
                    <span className="text-slate-300 hidden sm:inline">·</span>
                    <span className="text-slate-400 text-xs hidden sm:inline truncate">
                        Dr. {encounter.doctor_name}
                    </span>
                </>
            )}
        </div>
    );
}