"use client";

import Link from "next/link";
import { format } from "date-fns";
import { AlertTriangle, ChevronRight, Activity, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HistoryItem {
  encounter_id: string;
  encounter_date: string;
  conditions: string[];
  allergy_flags: string[];
  updated_at: string;
}

interface CardProps {
  item: HistoryItem;
  isLast: boolean;
}

const MedicalHistoryCard = ({ item, isLast }: CardProps) => {
  const hasConditions = item.conditions?.length > 0;
  const hasAllergies = item.allergy_flags?.length > 0;

  return (
    <div className="relative pl-8 group pb-6">
      {/* TIMELINE LINE */}
      {!isLast && (
        <div className="absolute left-1.75 top-6 bottom-0 w-px bg-slate-200 group-hover:bg-brand-200 transition-colors" />
      )}

      {/* DOT */}
      <div className="absolute left-0 top-2 h-3.75 w-3.75 rounded-full border-2 border-white bg-slate-300 ring-2 ring-slate-100 shadow-3xs transition-all duration-300 group-hover:bg-brand-600 group-hover:ring-brand-100" />

      <div className="bg-white border border-slate-100 rounded-2xl shadow-3xs p-4 transition-all duration-200 hover:border-slate-200 hover:shadow-2xs flex gap-4 items-start justify-between">
        <div className="space-y-3 flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
            <h4 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400 stroke-[2.2]" />
              {format(new Date(item.encounter_date), "dd MMM yyyy")}
            </h4>

            <span className="text-[10px] font-semibold text-slate-400 font-mono">
              Chart modified:{" "}
              {format(new Date(item.updated_at), "dd MMM HH:mm")}
            </span>
          </div>

          {/* Clinical Findings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-0.5">
            {/* Conditions Sub-Panel */}
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Activity className="h-2.5 w-2.5 text-indigo-500 stroke-[2.5]" />
                Assessed Conditions
              </span>
              <div className="flex flex-wrap gap-1">
                {hasConditions ? (
                  item.conditions.map((condition) => (
                    <Badge
                      key={condition}
                      variant="outline"
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50/60 text-indigo-700 border-indigo-100/50 uppercase tracking-wide shadow-3xs"
                    >
                      {condition}
                    </Badge>
                  ))
                ) : (
                  <span className="text-[11px] text-slate-400 italic block pl-0.5">
                    No acute condition entries
                  </span>
                )}
              </div>
            </div>

            {/* Allergies & Drug Flags Sub-Panel */}
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-rose-600 flex items-center gap-1">
                <AlertTriangle className="h-2.5 w-2.5 text-rose-500 stroke-[2.5]" />
                Critical & Allergy Flags
              </span>
              <div className="flex flex-wrap gap-1">
                {hasAllergies ? (
                  item.allergy_flags.map((flag) => (
                    <Badge
                      key={flag}
                      variant="outline"
                      className="text-[10px] font-black px-2 py-0.5 rounded-md bg-rose-50/70 text-rose-700 border-rose-100/60 uppercase tracking-wide shadow-3xs"
                    >
                      {flag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-[11px] text-slate-400 italic block pl-0.5">
                    No recorded counter-indications
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CLINICAL RECORD LINK */}
        <Link
          href={`/patients/encounters/${item.encounter_id}`}
          className="h-8 w-8 rounded-xl bg-slate-50 border border-slate-100/80 flex items-center justify-center shrink-0 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 text-slate-400 transition-all shadow-3xs self-center"
          title="Open comprehensive encounter records"
        >
          <ChevronRight className="h-4 w-4 stroke-[2.5]" />
        </Link>
      </div>
    </div>
  );
};

export default MedicalHistoryCard;
