"use client";

import React from "react";
import { ShieldAlert, AlertTriangle, HelpCircle } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  critical_alerts?: [];
  clinical_flags?: [];
  risk_score?: "LOW" | "MEDIUM" | "HIGH";
}

const RISK_THEMES = {
  LOW: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    border: "border-emerald-100",
    bg: "bg-emerald-50/20",
  },
  MEDIUM: {
    badge: "bg-amber-50 text-amber-700 border-amber-200/80",
    border: "border-amber-100",
    bg: "bg-amber-50/20",
  },
  HIGH: {
    badge: "bg-rose-50 text-rose-700 border-rose-200/80 animate-pulse",
    border: "border-rose-200/60",
    bg: "bg-rose-50/30",
  },
} as const;

const CriticalAlertsCard = ({
  critical_alerts = [],
  clinical_flags = [],
  risk_score = "LOW",
}: Props) => {
  const currentRisk = RISK_THEMES[risk_score] || RISK_THEMES.LOW;
  const hasItems = critical_alerts.length > 0 || clinical_flags.length > 0;

  return (
    <Card className={`overflow-hidden border transition-all duration-200 ${currentRisk.border} ${currentRisk.bg} rounded-2xl p-0`}>
      <CardHeader className="pb-3 bg-white border-b border-slate-100 pt-4">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-600 stroke-[2.5]" />
              Patient Risks & Alerts
            </CardTitle>
            <p className="text-[11px] font-medium text-slate-400">
              Contraindications and clinical status flags
            </p>
          </div>

          <Badge
            variant="outline"
            className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-3xs ${currentRisk.badge}`}
          >
            {risk_score} Risk Level
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* EMPTY STATE */}
        {!hasItems && (
          <div className="py-8 text-center bg-white border border-dashed border-slate-200/70 rounded-xl px-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Clear Profile</p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">No recorded contradictions or active allergies flag alerts.</p>
          </div>
        )}

        {/* SEVERE CRITICAL ALERTS GROUP (RED HIGH-PRIORITY ACTION DECK) */}
        {critical_alerts.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[9px] font-black uppercase tracking-wider text-rose-600 block px-0.5">
              Active Severe Contraindications
            </span>
            <div className="space-y-1.5">
              {critical_alerts.slice(0, 5).map((alert, idx) => (
                <div
                  key={`alert-${idx}-${alert}`}
                  className="rounded-xl border border-rose-200 bg-white p-3 shadow-3xs hover:border-rose-300 transition-colors flex items-start gap-2.5"
                >
                  <ShieldAlert className="h-4 w-4 text-rose-600 stroke-[2.5] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-extrabold text-rose-950 text-xs tracking-tight">
                      {alert}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CLINICAL FLAGS GROUP (AMBER STATUS DATA PILLS DECK) */}
        {clinical_flags.length > 0 && (
          <div className="space-y-1.5 pt-0.5">
            <span className="text-[9px] font-black uppercase tracking-wider text-amber-700 block px-0.5">
              Long-term Clinical Identifiers
            </span>
            <div className="space-y-1.5">
              {clinical_flags.slice(0, 5).map((flag, idx) => (
                <div
                  key={`flag-${idx}-${flag}`}
                  className="rounded-xl border border-amber-200 bg-white p-3 shadow-3xs hover:border-amber-300 transition-colors flex items-start gap-2.5"
                >
                  <AlertTriangle className="h-4 w-4 text-amber-600 stroke-[2.5] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-xs tracking-tight">
                      {flag}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
};

export default CriticalAlertsCard;