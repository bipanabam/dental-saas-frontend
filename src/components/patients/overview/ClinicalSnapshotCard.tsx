"use client";

import React from "react";
import { Calendar, User, Heart, Activity, Pill, UserCheck } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAge } from "@/lib/utils/get-age";

interface Props {
  patient: {
    date_of_birth: string;
    gender: string;
    blood_group?: string;
    visit_count?: number;
    last_visit_at?: Date;
    medical_record?: {
      current_medications?: string;
    };
  };
  summary?: {
    primary_doctor_name?: string;
  };
}

const ClinicalSnapshotCard = ({ patient, summary }: Props) => {
  const age = getAge(patient.date_of_birth);
  const medications = patient.medical_record?.current_medications;

  return (
    <Card className="overflow-hidden border border-slate-100 shadow-sm bg-white rounded-2xl">
      {/* Header Panel */}
      <CardHeader className="pb-4 border-b border-slate-50 bg-slate-50/20">
        <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Activity className="h-4 w-4 text-brand-700 stroke-[2.5]" />
          Clinical Snapshot
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* 1. CORE VITALS DECK PANEL */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50/60 p-2.5 rounded-xl border border-slate-100/80 text-center">
          <div className="space-y-0.5">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Age</span>
            <span className="text-sm font-black text-slate-800 tracking-tight">{age ? `${age} yrs` : "—"}</span>
          </div>
          <div className="space-y-0.5 border-x border-slate-200/60">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Gender</span>
            <span className="text-sm font-black text-slate-800 tracking-tight capitalize">{patient.gender?.toLowerCase() || "—"}</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Blood Type</span>
            <Badge variant="outline" className="text-[10px] font-extrabold px-1.5 py-0 h-4 bg-red-50 text-red-700 border-red-100 uppercase tracking-wide inline-flex rounded shadow-3xs mx-auto">
              {patient.blood_group || "—"}
            </Badge>
          </div>
        </div>

        {/* 2. CHRONOLOGICAL LOGS & ATTENDANCE */}
        <div className="space-y-2.5 pt-1">
          {/* Assigned Practitioner */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-400 flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-slate-400 stroke-2" /> Attending Doctor
            </span>
            <span className="font-bold text-slate-800 bg-slate-100/70 px-2 py-0.5 rounded-md border border-slate-200/30">
              {summary?.primary_doctor_name ? `Dr. ${summary.primary_doctor_name}` : "Unassigned"}
            </span>
          </div>

          {/* Visit Count */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-400 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-slate-400 stroke-2" /> Lifetime Visits
            </span>
            <span className="font-mono font-black text-brand-700 bg-brand-50/50 px-2 py-0.5 rounded-md border border-brand-100/40">
              {patient.visit_count ?? 0}
            </span>
          </div>

          {/* Last Encounter Date */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-400 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400 stroke-2" /> Last Encounter
            </span>
            <span className="font-bold text-slate-700 font-mono text-[11px]">
              {patient.last_visit_at ? new Date(patient.last_visit_at,).toLocaleString() : "New Registration"}
            </span>
          </div>
        </div>

        {/* 3. CURRENT ACTIVE THERAPY BLOCK */}
        <div className="border-t border-slate-100/80 pt-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50/30 p-2.5 space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Pill className="h-3 w-3 text-brand-600 stroke-[2.5]" />
              Active Medical Prescriptions
            </span>
            {medications ? (
              <p className="text-xs font-semibold text-slate-600 leading-relaxed bg-white p-2 rounded-lg border border-slate-100 shadow-3xs line-clamp-3">
                {medications}
              </p>
            ) : (
              <div className="text-[11px] italic text-slate-400 px-0.5">
                No active continuous medications registered.
              </div>
            )}
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default ClinicalSnapshotCard;