"use client";

import React from "react";
import {
  Thermometer,
  Heart,
  Activity,
  Scale,
  Wind,
  Clock,
  History
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ItemProps {
  label: string;
  value: string | number | null;
  unit?: string;
  icon: React.ComponentType<any>;
  border: string;
  color: string;
  statusText?: string; // e.g., "Normal", "Elevated", "Target"
}

const VitalCard = ({
  label,
  value,
  unit,
  icon: Icon,
  border,
  color,
  statusText
}: ItemProps) => (
  <div
    className={`bg-white border border-slate-100 shadow-3xs p-3.5 rounded-2xl flex flex-col justify-between relative overflow-hidden group border-b-2 transition-all duration-200 hover:shadow-2xs hover:border-slate-200/80 ${border}`}
  >
    <div className="flex items-start justify-between w-full gap-3">
      <div className="space-y-1 min-w-0">
        <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
          {label}
        </span>

        <p className="text-2xl font-black text-slate-900 leading-none tracking-tight flex items-baseline gap-0.5">
          {value ?? "N/A"}
          {value && unit && (
            <span className="text-xs font-bold text-slate-400 font-sans tracking-normal ml-0.5">
              {unit}
            </span>
          )}
        </p>
      </div>

      <div
        className={`h-9 w-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shrink-0 shadow-3xs border border-transparent ${color}`}
      >
        <Icon className="h-4.5 w-4.5 stroke-[2.3]" />
      </div>
    </div>

    {/* Bottom micro-status tracking strip */}
    <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between text-[10px]">
      <span className="font-semibold text-slate-400">Threshold</span>
      <span className={`font-black uppercase tracking-wide px-1.5 py-0.2 rounded-md ${value ? "text-slate-600 bg-slate-50" : "text-slate-300 bg-slate-50/50"
        }`}>
        {value ? (statusText ?? "Normal") : "—"}
      </span>
    </div>
  </div>
);

interface VitalsSectionProps {
  vitals?: {
    bp_systolic?: number | string;
    bp_diastolic?: number | string;
    pulse_rate?: number | string;
    temperature?: number | string;
    weight_kg?: number | string;
    spo2?: number | string;
    recorded_at?: string;
    encounter_id?: string;
  } | null;
}

const VitalsSection = ({ vitals }: VitalsSectionProps) => {
  const hasBP = vitals?.bp_systolic && vitals?.bp_diastolic;

  return (
    <Card className="overflow-hidden border border-slate-100 shadow-sm bg-white rounded-2xl">
      {/* Header */}
      <CardHeader className="pb-4 border-b border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-0.5">
          <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Activity className="h-4 w-4 text-brand-700 stroke-[2.5]" />
            Encounter Vitals Panel
          </CardTitle>
          <p className="text-[11px] font-medium text-slate-400">
            Metrics captured during physical assessment
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <Badge variant="outline" className="bg-white border-slate-200/80 text-slate-600 px-2 py-1 font-bold text-[10px] flex items-center gap-1.5 rounded-lg shadow-3xs cursor-pointer hover:bg-slate-50 transition-colors">
            <History className="h-3 w-3 text-slate-400" />
            <span>Latest Log</span>
          </Badge>

          <div className="text-[11px] font-mono font-bold text-slate-400 flex items-center gap-1 bg-white border border-slate-100 px-2 py-1 rounded-lg shadow-3xs">
            <Clock className="h-3 w-3 text-slate-400" />
            <span>{vitals?.recorded_at ? vitals.recorded_at : "Just now"}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {/* 1. Blood Pressure */}
          <VitalCard
            label="Blood Pressure"
            value={hasBP ? `${vitals.bp_systolic}/${vitals.bp_diastolic}` : null}
            unit="mmHg"
            icon={Activity}
            border="border-brand-500"
            color="text-brand-700 bg-brand-50/80 border-brand-100/50"
            statusText={vitals?.bp_systolic && Number(vitals.bp_systolic) > 130 ? "Elevated" : "Normal"}
          />

          {/* 2. Heart/Pulse Rate */}
          <VitalCard
            label="Pulse Rate"
            value={vitals?.pulse_rate ?? null}
            unit="bpm"
            icon={Heart}
            border="border-amber-500"
            color="text-amber-700 bg-amber-50/80 border-amber-100/50"
            statusText="Resting"
          />

          {/* 3. Core Temperature */}
          <VitalCard
            label="Temp"
            value={vitals?.temperature ?? null}
            unit="°C"
            icon={Thermometer}
            border="border-cyan-500"
            color="text-cyan-700 bg-cyan-50/80 border-cyan-100/50"
            statusText="Optimal"
          />

          {/* 4. Total Patient Weight */}
          <VitalCard
            label="Weight Metric"
            value={vitals?.weight_kg ?? null}
            unit="kg"
            icon={Scale}
            border="border-indigo-500"
            color="text-indigo-700 bg-indigo-50/80 border-indigo-100/50"
            statusText="Stable"
          />

          {/* 5. Oxygen Saturation */}
          <VitalCard
            label="SpO₂ Level"
            value={vitals?.spo2 ?? null}
            unit="%"
            icon={Wind}
            border="border-emerald-500"
            color="text-emerald-700 bg-emerald-50/80 border-emerald-100/50"
            statusText={vitals?.spo2 && Number(vitals.spo2) < 95 ? "Target low" : "Healthy"}
          />

        </div>
      </CardContent>
    </Card>
  );
};

export default VitalsSection;