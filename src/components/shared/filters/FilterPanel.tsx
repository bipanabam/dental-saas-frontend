"use client";

import { RotateCcw, SlidersHorizontal, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import FilterSelect from "./FilterSelect";
import { FilterField } from "./types";

interface Props {
  fields: FilterField[];
  values: Record<string, string>;

  onChange: (field: string, value: string) => void;
  onReset: () => void;
  onSettingsClick?: () => void;
  title?: string;
}

const FilterPanel = ({
  fields,
  values,
  onChange,
  onReset,
  onSettingsClick,
  title = "Filter Context Controls",
}: Props) => {
  const columnCount = fields.length + 1;

  return (
    <Card className="rounded-2xl border border-slate-100 shadow-sm bg-white overflow-hidden w-full">
      <CardContent className="p-4 space-y-3.5">
        <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
          <SlidersHorizontal className="h-3.5 w-3.5 text-brand-600 stroke-[2.5]" />
          <span>{title}</span>
        </div>

        <div
          className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-none items-end"
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`
          }}
        >
          {fields.map((field) => (
            <div key={field.field} className="flex flex-col gap-1.5 w-full">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide px-0.5">
                {field.label}
              </label>
              <FilterSelect
                field={field}
                value={values[field.field] || ""}
                onChange={(value) => onChange(field.field, value)}
              />
            </div>
          ))}

          <div className="flex items-center gap-2 w-full mt-2 sm:mt-0">
            {/* Change limit of query */}
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0 rounded-xl border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
              onClick={onSettingsClick}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-xl border-slate-200 text-slate-600 font-semibold text-xs tracking-wide hover:bg-slate-50 transition-all flex-1 gap-1.5"
              onClick={onReset}
            >
              <RotateCcw className="h-3.5 w-3.5 stroke-[2.5]" />
              Reset Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default FilterPanel;
