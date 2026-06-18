"use client";

import { Users } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useDoctors } from "@/hooks/users/use-doctors";

interface Props {
    value?: string;                          // undefined = ALL
    onChange: (doctorId?: string) => void;  // undefined = ALL
}

const ALL = "all";

const DoctorFilter = ({ value, onChange }: Props) => {
    const { data, isLoading } = useDoctors();
    const doctors = data ?? [];

    return (
    <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100 shadow-3xs">
      <div className="h-8 w-8 rounded-lg bg-white shadow-2xs flex items-center justify-center border border-slate-100">
        <Users className="h-4 w-4 text-brand-700" />
      </div>
      <Select value={value ?? ALL} onValueChange={(v) => onChange(v === ALL ? undefined : v)}>
        <SelectTrigger className="w-56 h-8 border-0 bg-transparent shadow-none font-bold text-xs text-slate-700 focus:ring-0">
          <SelectValue placeholder={isLoading ? "Syncing..." : "All Attending Clinicians"} />
        </SelectTrigger>
        <SelectContent className="rounded-xl shadow-md border-slate-100">
          <SelectItem value={ALL} className="text-xs font-semibold text-slate-700">All Clinicians</SelectItem>
          {doctors.map((doc) => (
            <SelectItem key={doc.id} value={doc.id} className="text-xs font-semibold text-slate-700">
              Dr. {doc.username}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 

export default DoctorFilter;