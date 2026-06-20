"use client";

import { ArrowDown, ChevronRight, Activity, Receipt } from "lucide-react";
import { Card } from "@/components/ui/card";
import { encounterStages } from "./taxonomy-flow";

type Props = {
  value: string;
  onChange: (id: string) => void;
  counts: Record<string, number>;
};

const EncounterJourneySidebar = ({ value, onChange, counts }: Props) => {
  return (
    <aside className="sticky top-24 xl:block hidden shrink-0 select-none">
      <Card className="rounded-2xl border border-slate-100 shadow-3xs p-4 bg-white space-y-5">
        {/* Title */}
        <div>
          <h2 className="text-[13px] font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-brand-700" />
            Encounter Journey
          </h2>
          <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
            Clinical workflow logic path mapping
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-1">
          {encounterStages.map((step, i) => {
            const Icon = step.icon;
            const active = value === step.id;
            const itemVolume = counts[step.id] ?? 0;

            return (
              <div key={step.id}>
                <button
                  onClick={() => onChange(step.id)}
                  className={`
                    w-full rounded-xl p-2.5 text-left transition-all duration-200 border relative overflow-hidden flex items-center justify-between gap-3 group cursor-pointer
                    ${
                      active
                        ? "bg-brand-50/70 border-brand-200/60 shadow-3xs text-brand-950 font-bold"
                        : "border-transparent text-slate-600 hover:bg-slate-50/80 hover:text-slate-900"
                    }
                  `}
                >
                  {/* Left Active State Ribbon Accent */}
                  {active && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-700 rounded-r" />
                  )}

                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                        active
                          ? "bg-white text-brand-700 border-brand-200/40 shadow-4xs"
                          : "bg-slate-50 text-slate-400 border-slate-100"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 stroke-[2.2]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block leading-none">
                        {step.role}
                      </span>
                      <span className="text-[14px] font-bold block truncate mt-0.5">
                        {step.title}
                      </span>
                    </div>
                  </div>

                  {/* Items Badge Counter */}
                  <div className="text-right shrink-0 pr-1">
                    <span className="text-xs font-black font-mono block text-slate-800 group-hover:text-brand-900">
                      {itemVolume}
                    </span>
                    <span className="text-[9px] text-slate-400 block font-medium leading-none">
                      items
                    </span>
                  </div>
                </button>

                {/* Connection Line */}
                {i < encounterStages.length - 1 && (
                  <div className="flex justify-center py-0.5">
                    <ArrowDown className="h-3 w-3 text-slate-200 stroke-[2.5]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="rounded-xl bg-slate-800 text-white p-3 border border-slate-950 shadow-sm space-y-2">
          <div className="text-[9px] font-black uppercase tracking-widest text-brand-400 flex items-center gap-1">
            <Receipt className="h-3 w-3" />
            <span>Downstream Target</span>
          </div>
          <div className="flex items-center flex-wrap gap-x-1.5 gap-y-0.5 text-[11px] font-bold text-white">
            <span>Plan</span>
            <ChevronRight className="h-3 w-3 text-slate-600 shrink-0" />
            <span>Procedures</span>
            <ChevronRight className="h-3 w-3 text-slate-600 shrink-0" />
            <span className="text-white font-black">Billing</span>
          </div>
        </div>
      </Card>
    </aside>
  );
};

export default EncounterJourneySidebar;
