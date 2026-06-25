"use client";

import { useState, useMemo } from "react";
import { 
  Search, 
  ClipboardList, 
  Activity, 
  Clock, 
  Tag, 
  ToggleLeft, 
  RotateCcw 
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { SectionLoader } from "@/components/base/loading-view";
import SettingsHeader from "@/components/settings/SettingHeader";

import {
  useProcedureCatalogs,
  useSearchProcedureCatalog,
} from "@/hooks/procedure-catalog/use-procedure-catalog";

type Catalog = {
  id: string;
  name: string;
  code?: string | null;
  category?: string | null;
  description?: string | null;
  default_cost?: number | null;
  default_duration_minutes?: number | null;
  is_active: boolean;
};

// Audit Metric Label
function MetricLabel({ label, value, icon: Icon }: { label: string; value: number | string; icon: any }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60 text-xs">
      <Icon className="h-3.5 w-3.5 text-slate-400" />
      <span className="font-medium text-slate-500 uppercase tracking-wider text-[10px]">{label}:</span>
      <span className="font-bold text-slate-800 font-mono">{value}</span>
    </div>
  );
}

export default function ProcedureCatalogSettingsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  const { data: listData, isLoading: listLoading } = useProcedureCatalogs({ limit: 100 });
  const { data: searchData, isLoading: searchLoading } = useSearchProcedureCatalog(search);

  const isSearching = search.length >= 2;
  const rawItems: Catalog[] = isSearching ? ((searchData as any) ?? []) : ((listData as any) ?? []);

  const allItems: Catalog[] = (listData as any) ?? [];
  const categories = useMemo(() => {
    const cats = new Set(allItems.map((i) => i.category).filter(Boolean) as string[]);
    return ["ALL", ...Array.from(cats).sort()];
  }, [allItems]);

  const filtered = useMemo(() => {
    if (categoryFilter === "ALL") return rawItems;
    return rawItems.filter((i) => i.category === categoryFilter);
  }, [rawItems, categoryFilter]);

  const activeCount = allItems.filter((i) => i.is_active).length;
  const categoryCount = categories.length - 1;
  const isLoading = isSearching ? searchLoading : listLoading;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-5">
      <SettingsHeader
        title="Procedure Catalog"
        description="Clinical procedures available for appointment and treatment planning."
        icon={ClipboardList}
      />

      <div className="flex flex-wrap gap-2 items-center">
        <MetricLabel label="Total Index" value={allItems.length} icon={ClipboardList} />
        <MetricLabel label="Active Master" value={activeCount} icon={Activity} />
        <MetricLabel label="Inactive" value={allItems.length - activeCount} icon={ToggleLeft} />
        <MetricLabel label="Categories" value={categoryCount} icon={Tag} />
      </div>

      {/* Filter */}
      <div className="flex flex-col gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter catalog directory by keywords or diagnostic code..."
            className="pl-9 bg-slate-50/50 border-slate-200 text-xs h-9 focus-visible:ring-brand-500"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1.5">
            Category Grouping:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded text-xs font-semibold tracking-tight border transition-all ${categoryFilter === cat
                  ? "bg-brand-50 border-brand-300 text-brand-800 font-bold shadow-2xs"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
            >
              {cat === "ALL" ? "All Formats" : cat}
            </button>
          ))}

          {categoryFilter !== "ALL" && (
            <button
              onClick={() => setCategoryFilter("ALL")}
              className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 hover:text-red-600 ml-2 py-1"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Master Data Manifest */}
      {isLoading ? (
        <SectionLoader message="Syncing clinical directories..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-xs text-slate-400 font-medium">
          {isSearching ? `No record entry matches target query "${search}"` : "No parameters discovered in this schema location."}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="px-1 flex items-baseline justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <span>
              Showing {filtered.length} entry item{filtered.length !== 1 ? "s" : ""}
            </span>
            {isSearching && <span className="font-mono text-slate-400">Search Mode Active</span>}
          </div>

          {/* Clean, Document-Style Ledger Grid */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
                    <th className="py-2.5 px-4 w-30">Code</th>
                    <th className="py-2.5 px-4">Procedure Name / Description</th>
                    <th className="py-2.5 px-4 w-40">Category</th>
                    <th className="py-2.5 px-4 w-30 text-right">Est. Duration</th>
                    <th className="py-2.5 px-4 w-35 text-right">Base Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/60 transition-colors ${!item.is_active ? "opacity-45 bg-slate-50/30 line-through decoration-slate-300" : ""
                        }`}
                    >
                      {/* Code Indicator */}
                      <td className="py-3 px-4 font-mono font-bold tracking-wide text-slate-400">
                        {item.code ? item.code : "—"}
                      </td>

                      {/* Main Definition Cell */}
                      <td className="py-3 px-4 space-y-0.5 max-w-md">
                        <div className="font-bold text-slate-800 text-sm tracking-tight">
                          {item.name}
                        </div>
                        {item.description && (
                          <div className="text-slate-400 text-xs font-normal leading-normal line-clamp-1 not-line-through">
                            {item.description}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        {item.category ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-600 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded text-[10px] tracking-wide uppercase">
                            {item.category}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Timing Duration */}
                      <td className="py-3 px-4 text-right font-medium text-slate-600">
                        {item.default_duration_minutes ? (
                          <div className="inline-flex items-center justify-end gap-1 font-mono">
                            <Clock className="h-3 w-3 text-slate-300" />
                            <span>{item.default_duration_minutes} min</span>
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Cost */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-700">
                        {item.default_cost != null ? (
                          <span>Rs. {item.default_cost.toLocaleString()}</span>
                        ) : (
                          <span className="text-slate-300 font-normal italic">Unset</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}