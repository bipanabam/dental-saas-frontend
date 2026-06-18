"use client";

import Link from "next/link";
import { format } from "date-fns";
import {
  ClipboardList,
  Link2,
  ArrowUpRight,
  CheckCircle2,
  CircleDot,
  Banknote,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TreatmentPlanItem {
  id: string;
  encounter_id: string;
  status: "PENDING" | "DONE" | "DEFERRED" | "CANCELLED" | "CHANGED" | string;
  estimated_total_cost: number;
  total_items: number;
  completed_items: number;
  pending_items: number;
  created_at: string;
}

interface Props {
  item: TreatmentPlanItem;
  isLast: boolean;
}

const PLAN_STATUS_THEMES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200/70",
  DONE: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
  DEFERRED: "bg-indigo-50 text-indigo-700 border-indigo-200/70",
  CANCELLED: "bg-rose-50 text-rose-600 border-rose-200/60 line-through",
  CHANGED: "bg-sky-50 text-sky-700 border-sky-200/70",
};

const TreatmentPlanCard = ({ item, isLast }: Props) => {
  const total = item.total_items || 0;
  const completed = item.completed_items || 0;
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const planBadgeStyle =
    PLAN_STATUS_THEMES[item.status] ??
    "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-3xs p-4 mb-4 transition-all duration-200 hover:border-slate-200/80 hover:shadow-2xs">
      <div className="space-y-4">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-50 pb-2.5">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ClipboardList className="h-3.5 w-3.5 text-brand-700 stroke-[2.2]" />
                Plan Track
              </span>
              <Badge
                variant="outline"
                className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${planBadgeStyle}`}
              >
                {item.status.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Initialized: {format(new Date(item.created_at), "dd MMM yyyy")}
            </p>
          </div>

          {/* Quick Encounter Root Reference Link */}
          <Link
            href={`/encounters/${item.encounter_id}`}
            className="text-[10px] font-bold text-slate-400 hover:text-brand-700 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 transition-all shadow-3xs"
          >
            <Link2 className="h-3 w-3" />
            <span>Encounter Link</span>
          </Link>
        </div>

        {/* Dynamic Execution Progress Section */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline text-xs">
            <span className="font-semibold text-slate-500">
              Items Fulfillment Progress
            </span>
            <span className="font-mono font-black text-slate-900">
              {progressPercent}% ({completed}/{total})
            </span>
          </div>

          {/* Base Track Progress Bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/20">
            <div
              className="h-full bg-brand-700 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Multi-metrics Summary Row */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/70 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <div className="text-left min-w-0">
              <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wide">
                Done
              </span>
              <span className="font-mono font-black text-slate-800">
                {item.completed_items}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs border-x border-slate-200/50">
            <CircleDot className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <div className="text-left min-w-0">
              <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wide">
                Pending
              </span>
              <span className="font-mono font-black text-slate-800">
                {item.pending_items}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs">
            <Banknote className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
            <div className="text-left min-w-0">
              <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wide">
                Est. Cost
              </span>
              <span className="font-mono font-black text-indigo-900 tracking-tight">
                {item.estimated_total_cost
                  ? `Rs. ${item.estimated_total_cost.toLocaleString()}`
                  : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Primary Action Button Redirect Link to Details View */}
        <Link
          href={`/treatment-plans/${item.id}`}
          className="w-full h-8 bg-slate-100 border border-slate-150 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all shadow-3xs"
        >
          <span>Modify & Manage Comprehensive Treatment Plan</span>
          <ArrowUpRight className="h-3 w-3 stroke-[2.5]" />
        </Link>
      </div>
    </div>
  );
};

export default TreatmentPlanCard;
