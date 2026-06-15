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
}

const FilterPanel = ({ fields, values, onChange, onReset}: Props) => {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2 text-xs uppercase font-semibold text-slate-500 tracking-wider">
          <SlidersHorizontal className="h-3.5 w-3.5 text-brand-700" /> Filter Context Controls
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {fields.map((field) => (
            <FilterSelect
              key={field.field}
              field={field}
              value={values[field.field]}
              onChange={(value) => onChange(field.field, value)}
            />
          ))}

          <div className="flex items-center gap-2">
            {/* Change limit of query */}
            <Button variant="outline" onClick={() => {}}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={onReset}>
              <RotateCcw className="mr-1 h-4 w-4"/>
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default FilterPanel;
