"use client";

import { useState, useEffect, useRef } from "react";
import { Filter, RotateCcw, Calendar, Search, X } from "lucide-react";

import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { useDoctors } from "@/hooks/users/use-doctors";
import { useSearchPatients } from "@/hooks/patients/use-patients";

import type { EncounterStatusEnum } from "@/lib/api";

type Filters = {
    status?: EncounterStatusEnum;
    doctor_id?: string;
    patient_id?: string;
    today?: boolean;
};

type Props = {
    filters: Filters;
    onChange: (value: Filters) => void;
};

function PatientSearch({
    value,
    onChange,
}: {
    value?: string;
    onChange: (id: string | undefined, name: string | undefined) => void;
}) {
    const [query, setQuery] = useState("");
    const [selectedName, setSelectedName] = useState<string>();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const { data: results } = useSearchPatients(query);
    const patients = (results as any)?.items ?? results ?? [];

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSelect = (patient: any) => {
        const name = `${patient.first_name} ${patient.last_name}`;
        setSelectedName(name);
        setQuery("");
        setOpen(false);
        onChange(patient.id, name);
    };

    const handleClear = () => {
        setSelectedName(undefined);
        setQuery("");
        onChange(undefined, undefined);
    };

    return (
        <div className="relative" ref={ref}>
            {selectedName ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-brand-50 border-brand-200 text-sm text-brand-700 font-semibold">
                    {selectedName}
                    <button onClick={handleClear}>
                        <X className="h-3.5 w-3.5 text-brand-400 hover:text-brand-700" />
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                    <Input
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setOpen(e.target.value.length >= 2);
                        }}
                        onFocus={() => query.length >= 2 && setOpen(true)}
                        placeholder="Filter by patient..."
                        className="pl-8 h-8 text-sm w-44 bg-white"
                    />
                </div>
            )}

            {open && patients.length > 0 && (
                <div className="absolute top-full mt-1 left-0 z-50 w-64 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                    {patients.slice(0, 6).map((p: any) => (
                        <button
                            key={p.id}
                            onClick={() => handleSelect(p)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-brand-50 transition-colors border-b border-slate-50 last:border-0"
                        >
                            <div className="font-semibold text-slate-800">
                                {p.first_name} {p.last_name}
                            </div>
                            {p.phone && (
                                <div className="text-xs text-slate-400">{p.phone}</div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function EncounterFilters({ filters, onChange }: Props) {
    const { data: doctorsData } = useDoctors();
    const doctors = (doctorsData as any)?.items ?? doctorsData ?? [];

    const activeFilterCount = [
        filters.status,
        filters.doctor_id,
        filters.patient_id,
        filters.today,
    ].filter(Boolean).length;

    const reset = () => onChange({});

    return (
        <div className="flex items-center gap-2 flex-wrap justify-end">

            {/* Today toggle */}
            <Button
                variant={filters.today ? "default" : "outline"}
                size="sm"
                className={`rounded-xl h-8 gap-1.5 ${filters.today ? "bg-brand-600" : ""
                    }`}
                onClick={() =>
                    onChange({ ...filters, today: filters.today ? undefined : true })
                }
            >
                <Calendar className="h-3.5 w-3.5" />
                Today
            </Button>

            {/* Status */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl border bg-slate-50 h-8">
                <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <Select
                    value={filters.status ?? "all"}
                    onValueChange={(v) =>
                        onChange({
                            ...filters,
                            status: v === "all" ? undefined : v as EncounterStatusEnum,
                        })
                    }
                >
                    <SelectTrigger className="h-auto border-0 shadow-none px-0 bg-transparent min-w-32 text-sm">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="CLOSED">Closed</SelectItem>
                        <SelectItem value="VOID">Void</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Doctor — select */}
            <Select
                value={filters.doctor_id ?? "all"}
                onValueChange={(v) =>
                    onChange({
                        ...filters,
                        doctor_id: v === "all" ? undefined : v,
                    })
                }
            >
                <SelectTrigger className="h-8 rounded-xl text-sm min-w-36 bg-white">
                    <SelectValue placeholder="All Doctors" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Doctors</SelectItem>
                    {doctors.map((d: any) => (
                        <SelectItem key={d.id} value={d.id}>
                            {d.username ?? d.email}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Patient — search */}
            <PatientSearch
                value={filters.patient_id}
                onChange={(id) =>
                    onChange({ ...filters, patient_id: id })
                }
            />

            {/* Reset — only show if any filter is active */}
            {activeFilterCount > 0 && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl h-8 text-slate-400 hover:text-slate-700 gap-1.5"
                    onClick={reset}
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Clear {activeFilterCount > 1 ? `(${activeFilterCount})` : ""}
                </Button>
            )}

        </div>
    );
}