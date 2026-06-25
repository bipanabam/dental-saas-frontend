"use client";

import { useState, useMemo } from "react";
import {
  Search, ClipboardList, Activity,
  Clock, DollarSign, Tag, ToggleLeft,
  RotateCcw,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionLoader } from "@/components/base/loading-view";
import SettingsHeader from "@/components/settings/SettingHeader";

import {
  useProcedureCatalogs,
  useSearchProcedureCatalog,
} from "@/hooks/procedure-catalog/use-procedure-catalog";

// Types

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

// Stat card

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  icon: any;
}) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 flex items-center gap-3">
      <div className="h-9 w-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-slate-500" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="text-xl font-black text-slate-800 leading-tight">{value}</p>
      </div>
    </div>
  );
}

// Catalog card
function CatalogCard({ item }: { item: Catalog }) {
  return (
    <div
      className={`
        rounded-2xl border bg-white p-4 space-y-3 transition-all
        ${item.is_active
          ? "border-slate-200 hover:border-slate-300 hover:shadow-sm"
          : "border-slate-100 opacity-55"
        }
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">{item.name}</p>
          {item.code && (
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">{item.code}</p>
          )}
        </div>
        <Badge
          variant="outline"
          className={`text-[10px] font-bold shrink-0 ${item.is_active
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-slate-50 text-slate-400 border-slate-200"
            }`}
        >
          {item.is_active ? "Active" : "Inactive"}
        </Badge>
      </div>

      {/* Category */}
      {item.category && (
        <div className="flex items-center gap-1.5">
          <Tag className="h-3 w-3 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500 font-medium">{item.category}</span>
        </div>
      )}

      {/* Description */}
      {item.description && (
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
          {item.description}
        </p>
      )}

      {/* Cost + duration */}
      <div className="flex items-center gap-4 pt-1 border-t border-slate-50">
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <DollarSign className="h-3.5 w-3.5 text-slate-400" />
          {item.default_cost != null ? (
            <span className="font-bold">
              Rs {item.default_cost.toLocaleString()}
            </span>
          ) : (
            <span className="text-slate-400">No default cost</span>
          )}
        </div>

        {item.default_duration_minutes != null && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {item.default_duration_minutes} min
          </div>
        )}
      </div>
    </div>
  );
}

// Page

const ProcedureCatalogSettingsPage = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  // Two query branches: search fires when ≥2 chars, list is the default
  const { data: listData, isLoading: listLoading } = useProcedureCatalogs({ limit: 100 });
  const { data: searchData, isLoading: searchLoading } =
    useSearchProcedureCatalog(search);

  const isSearching = search.length >= 2;

  const rawItems: Catalog[] = isSearching
    ? ((searchData as any) ?? [])
    : ((listData as any) ?? []);

  // Derive category list from full list
  const allItems: Catalog[] = (listData as any) ?? [];
  const categories = useMemo(() => {
    const cats = new Set(
      allItems.map((i) => i.category).filter(Boolean) as string[]
    );
    return ["ALL", ...Array.from(cats).sort()];
  }, [allItems]);

  const filtered = useMemo(() => {
    if (categoryFilter === "ALL") return rawItems;
    return rawItems.filter((i) => i.category === categoryFilter);
  }, [rawItems, categoryFilter]);

  const activeCount = allItems.filter((i) => i.is_active).length;
  const categoryCount = categories.length - 1; // exclude "ALL"

  const isLoading = isSearching ? searchLoading : listLoading;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <SettingsHeader
        title="Procedure Catalog"
        description="Clinical procedures available for appointment and treatment planning."
        icon={ClipboardList}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total" value={allItems.length} icon={ClipboardList} />
        <StatCard label="Active" value={activeCount} icon={Activity} />
        <StatCard label="Inactive" value={allItems.length - activeCount} icon={ToggleLeft} />
        <StatCard label="Categories" value={categoryCount} icon={Tag} />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative w-full m-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search procedures..."
            className="pl-9 bg-white"
          />
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-2 flex-wrap bg-brand-100/80 border border-brand-300 p-4 rounded-lg">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-bold transition-colors
                ${categoryFilter === cat
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }
              `}
            >
              {cat === "ALL" ? "All" : cat}
            </button>
          ))}

          {categoryFilter !== "ALL" && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 rounded-lg text-slate-400 hover:text-slate-700 gap-1"
              onClick={() => setCategoryFilter("ALL")}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <SectionLoader message="Loading procedures..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-sm text-slate-400">
          {isSearching
            ? `No procedures match "${search}"`
            : "No procedures found in this category."}
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-400 font-semibold">
            {filtered.length} procedure{filtered.length !== 1 ? "s" : ""}
            {categoryFilter !== "ALL" ? ` in ${categoryFilter}` : ""}
            {isSearching ? ` matching "${search}"` : ""}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <CatalogCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProcedureCatalogSettingsPage;