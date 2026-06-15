"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FilterField } from "./types";

interface Props {
  field: FilterField;
  value: string;

  onChange: (value: string) => void;
}

const FilterSelect = ({ field, value, onChange }: Props) => {
  return (
    <div className={field.width ?? "w-full"}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="rounded-xl bg-brand-50 border-slate-100 shadow-xs">
          <SelectValue placeholder={field.placeholder ?? field.label} />
        </SelectTrigger>

        <SelectContent>
          {field.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default FilterSelect;