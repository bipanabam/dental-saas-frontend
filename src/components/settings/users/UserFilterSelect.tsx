"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { FilterField } from "@/components/shared/filters/types";

interface Props {
    field: FilterField;
    value: string;
    onChange: (value: string) => void;
}

const UserFilterSelect = ({ field, value, onChange }: Props) => {
    return (
        <div className={field.width ?? "w-full"}>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="h-10 rounded-xl bg-slate-50 border-slate-100 shadow-3xs text-xs font-bold text-slate-700 hover:bg-slate-100/70 transition-colors focus:ring-1 focus:ring-slate-200">
                    <SelectValue placeholder={field.placeholder ?? field.label} />
                </SelectTrigger>

                <SelectContent className="rounded-xl border-slate-100 shadow-md text-xs font-semibold text-slate-700">
                    {field.options.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value}
                            className="cursor-pointer focus:bg-slate-50 focus:text-slate-900 rounded-lg"
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default UserFilterSelect;