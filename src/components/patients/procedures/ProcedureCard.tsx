"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ArrowUpRight, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProcedureItem {
  id: string;
  encounter_id: string;
  procedure_catalog_id: string;
  procedure_name: string;
  status: "COMPLETED" | "PENDING" | "IN_PROGRESS" | "CANCELLED" | string;
  tooth_numbers: number[];
  final_cost: number;
  performed_by_id: string;
  procedure_date: string;
}

interface Props {
  item: ProcedureItem;
  isLast: boolean;
}

const PROCEDURE_STATUS_THEMES: Record<string, string> = {
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
  PENDING: "bg-slate-50 text-slate-500 border-slate-200",
  IN_PROGRESS: "bg-amber-50 text-amber-700 border-amber-200/70 animate-pulse",
  CANCELLED: "bg-rose-50 text-rose-600 border-rose-200/60 line-through",
};

const ProcedureCard = ({ item, isLast }: Props) => {
  const procedureBadgeStyle = PROCEDURE_STATUS_THEMES[item.status] ?? "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <div 
      className="bg-white border border-slate-100 rounded-2xl shadow-3xs p-3.5 mb-3 transition-all duration-200 hover:border-slate-200 hover:shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div className="space-y-2 flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={`text-[9px] font-black tracking-wide px-1.5 py-0.5 rounded uppercase ${procedureBadgeStyle}`}
          >
            {item.status.replace("_", " ")}
          </Badge>

          <h4 className="text-sm font-black text-slate-800 tracking-tight truncate">
            {item.procedure_name}
          </h4>
        </div>

        {/* Clinical Parameters Grid Strip */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-1 text-[11px]">
            <Layers className="h-3.5 w-3.5 text-slate-400 stroke-2" />
            Site/Tooth Target:{" "}
            <span className="font-bold text-slate-700 font-mono">
              {item.tooth_numbers?.length > 0 ? `[${item.tooth_numbers.join(", ")}]` : "General/Systemic"}
            </span>
          </span>

          <span className="text-[11px] font-mono">
            Operated: {format(new Date(item.procedure_date), "dd MMM yyyy")}
          </span>
        </div>
      </div>

      {/* Financial Asset Pillar & Link Gateway Portal Container */}
      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2.5 sm:pt-0 border-slate-50 shrink-0">
        <div className="text-left sm:text-right">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Procedure Revenue</span>
          <span className="font-mono font-black text-slate-800 text-sm">
            Rs. {item.final_cost?.toLocaleString() ?? "0"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Main Procedure Execution Record Route Link */}
          <Link
            href={`/procedures/${item.id}`}
            className="h-8 w-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-all shadow-3xs"
            title="Inspect operational catalog metrics"
          >
            <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
          </Link>
        </div>
      </div>

    </div>
  );
};

export default ProcedureCard;