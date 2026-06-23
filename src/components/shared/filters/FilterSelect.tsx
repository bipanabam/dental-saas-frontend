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

  onChange: (
    value: string
  ) => void;
}

export default function FilterSelect({
  field,
  value,
  onChange,
}: Props) {
  return (
    <Select
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger
        className="w-full rounded-xl border-slate-100 bg-brand-50 shadow-xs"
      >
        <SelectValue
          placeholder={field.placeholder ?? field.label}
        />
      </SelectTrigger>

      <SelectContent>
        {field.options.map(
          (option) => (
            <SelectItem
              key={option.value}
              value={
                option.value
              }
            >
              {option.label}
            </SelectItem>
          )
        )}
      </SelectContent>
    </Select>
  );
}