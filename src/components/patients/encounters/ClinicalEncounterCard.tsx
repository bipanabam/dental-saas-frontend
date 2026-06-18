"use client";

import Link from "next/link";
import { format } from "date-fns";
import {
    FileText,
    Stethoscope,
    CalendarCheck,
    ArrowUpRight,
    Clock,
    User,
    Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { PatientEncounterListItem } from "@/lib/api";

interface CardProps {
    item: PatientEncounterListItem;
    isLast: boolean;
}

const getStatusTheme = (status: string) => {
    switch (status) {
        case "IN_PROGRESS":
            return "bg-amber-50 text-amber-700 border-amber-200/60 animate-pulse";
        case "CLOSED":
        case "COMPLETED":
            return "bg-slate-50 text-slate-600 border-slate-200/60";
        default:
            return "bg-brand-50 text-brand-700 border-brand-200/60";
    }
};

const ClinicalEncounterCard = ({ item, isLast }: CardProps) => {
    return (
        <div className="relative pl-8 group pb-6">
            {!isLast && (
                <div className="absolute left-1.75 top-6 bottom-0 w-px bg-slate-200 group-hover:bg-brand-200 transition-colors" />
            )}
            <div className={`absolute left-0 top-2 h-3.17 w-3.75 rounded-full border-2 border-white shadow-3xs transition-all duration-300 ${item.status === "IN_PROGRESS" ? "bg-amber-500 ring-2 ring-amber-100" : "bg-slate-300 ring-2 ring-slate-100 group-hover:bg-brand-600 group-hover:ring-brand-100"
                }`} />

            <div className="bg-white border border-slate-100 rounded-2xl shadow-3xs p-4 transition-all duration-200 hover:border-slate-200 hover:shadow-2xs flex gap-4 items-start justify-between">

                <div className="space-y-3 flex-1 min-w-0">

                    {/* Header Row: Dates, Status, Appointment Reference Link */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-50 pb-2">
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                            <span className="text-sm font-black text-slate-600 tracking-tight flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-slate-400" />
                                {format(new Date(item.started_at), "dd MMM yyyy")}
                            </span>

                            <Badge
                                variant="outline"
                                className={`text-[9px] font-extrabold px-1.5 py-0 rounded border uppercase tracking-wider ${getStatusTheme(item.status)}`}
                            >
                                {item.status?.replace("_", " ")}
                            </Badge>
                        </div>

                        {/* Linked Appointment */}
                        {item.appointment_id && (
                            <Link
                                href={`/appointments/${item.appointment_id}`}
                                className="text-[11px] font-bold text-slate-400 hover:text-brand-600 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 transition-colors"
                                title="Navigate to scheduled base appointment booking"
                            >
                                <CalendarCheck className="h-3 w-3" />
                                <span>Ref: Booking</span>
                                <ArrowUpRight className="h-2.5 w-2.5 opacity-60" />
                            </Link>
                        )}
                    </div>

                    {/* Practitioner Info & Complaint Summary */}
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                            <span>Attending Practitioner:</span>
                            <span className="font-bold text-slate-800 truncate max-w-55">
                                {item.doctor?.email?.split("@")[0] || "Staff Provider"}
                            </span>
                        </div>

                        <div className="text-xs font-semibold text-slate-500 flex items-baseline gap-1.5">
                            <span className="shrink-0 text-slate-400">Chief Complaint:</span>
                            <p className="text-slate-700 italic font-medium truncate">
                                {item.chief_complaint || "No primary complaint logged (routine check-up/follow-up)"}
                            </p>
                        </div>
                    </div>

                    {/* Footer Metrics Deck Grid: Structural Counts */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">

                        {/* Diagnosis Metric Pill */}
                        <div className="bg-indigo-50/40 border border-indigo-100/40 rounded-lg px-2 py-1 flex items-center gap-1.5 text-[11px]">
                            <Stethoscope className="h-3 w-3 text-indigo-600" />
                            <span className="font-medium text-indigo-600">Diagnoses:</span>
                            <span className="font-black text-indigo-900 font-mono">{item.diagnosis_count ?? 0}</span>
                        </div>

                        {/* Procedures Metric Pill */}
                        <div className="bg-emerald-50/40 border border-emerald-100/40 rounded-lg px-2 py-1 flex items-center gap-1.5 text-[11px]">
                            <Activity className="h-3 w-3 text-emerald-600" />
                            <span className="font-medium text-emerald-600">Procedures:</span>
                            <span className="font-black text-emerald-900 font-mono">{item.procedure_count ?? 0}</span>
                        </div>

                        {/* Treatment Status Tracker Badge */}
                        {item.treatment_plan_status && (
                            <div className="bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 flex items-center justify-center gap-1.5 text-[11px] ml-auto sm:ml-0">
                                <FileText className="h-3 w-3 text-slate-400" />
                                <span className="font-medium text-slate-400">Plan:</span>
                                <span className="font-bold text-slate-700 uppercase text-[9px] tracking-wide">{item.treatment_plan_status}</span>
                            </div>
                        )}

                    </div>

                </div>

                {/* PRIMARY SYSTEM ENCOUNTER ENTRY REDIRECT LINK */}
                <Link
                    href={`/patients/encounters/${item.id}`}
                    className="h-8 w-8 rounded-xl bg-slate-50 border border-slate-100/80 flex items-center justify-center shrink-0 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 text-slate-400 transition-all shadow-3xs self-center"
                    title="Open complete session chart and update clinical documents"
                >
                    <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
                </Link>

            </div>
        </div>
    );
};

export default ClinicalEncounterCard;