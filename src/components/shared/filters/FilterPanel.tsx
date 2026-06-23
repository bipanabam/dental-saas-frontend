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

  compact?: boolean;
}

const FilterPanel = ({
  fields,
  values,
  onChange,
  onReset,
  onSettingsClick,
  title = "Filter Context Controls",
  compact = false,
}: Props) => {
  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-white">
      <CardContent className={compact ? "p-4" : "p-5"}>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            <SlidersHorizontal className="h-3.5 w-3.5 text-brand-600" />
            {title}
          </div>

          {/* Main Layout */}
          <div className="flex flex-col xl:flex-row gap-4">
            {/* Dynamic Filters */}
            <div className="flex-1">
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-3"
              >
                {fields.map((field) => (
                  <div key={field.field} className="space-y-1.5 min-w-0">
                    <label
                      className="px-1 text-[10px] font-bold uppercase tracking-wide text-slate-400"
                    >
                      {field.label}
                    </label>

                    <FilterSelect
                      field={field}
                      value={values[field.field] ?? ""}
                      onChange={(value) => onChange(field.field, value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div
              className="flex xl:w-auto gap-2 xl:self-end"
            >
              {onSettingsClick && (
                <Button
                  size="icon"
                  variant="outline"
                  onClick={onSettingsClick}
                  className="h-10 w-10 rounded-xl border-slate-200 shrink-0"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}

              <Button
                variant="outline"
                onClick={onReset}
                className="h-10 min-w-40 rounded-xl border-slate-200 font-semibold gap-2"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Filters
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
