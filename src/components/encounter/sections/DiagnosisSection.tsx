"use client";

import { useState } from "react";
import { Plus, X, Search, Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SectionLoader } from "@/components/base/loading-view";

import { useDiagnosesTaxonomy } from "@/hooks/taxonomy/use-taxonomy";
import { useReplaceDiagnoses } from "@/hooks/encounter/use-encounter-workflow";

import type { EncounterDetail } from "@/lib/api";

type Props = { encounter: EncounterDetail; appointmentId: string };
type LocalDiagnosis = {
    code: string;
    isPrimary: boolean;
    toothNumbers: string;
    notes: string;
    icd10: string;
};

function fromEncounter(encounter: EncounterDetail): LocalDiagnosis[] {
    return (encounter.diagnoses ?? []).map((d: any) => ({
        code: d.diagnosis_code,
        isPrimary: d.is_primary,
        toothNumbers: d.tooth_numbers?.join(", ") ?? "",
        notes: d.notes ?? "",
        icd10: d.icd10_code ?? "",
    }));
}

export default function DiagnosisSection({ encounter, appointmentId }: Props) {
    const { data: taxonomyData, isLoading } = useDiagnosesTaxonomy();
    const replaceDiagnoses = useReplaceDiagnoses(appointmentId);

    const [diagnoses, setDiagnoses] = useState<LocalDiagnosis[]>(() => fromEncounter(encounter));
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const taxonomy = (taxonomyData as any)?.taxonomy as Record<string, string[]> | undefined;
    const existingCodes = new Set(diagnoses.map((d) => d.code));

    const filteredTaxonomy = taxonomy
        ? Object.entries(taxonomy).reduce<Record<string, string[]>>((acc, [cat, items]) => {
            const filtered = items.filter(
                (item) =>
                    !existingCodes.has(item) &&
                    item.toLowerCase().includes(search.toLowerCase())
            );
            if (filtered.length) acc[cat] = filtered;
            return acc;
        }, {})
        : {};

    const addDiagnosis = (code: string) => {
        setDiagnoses((prev) => [
            ...prev,
            {
                code,
                isPrimary: prev.length === 0, // first added becomes primary
                toothNumbers: "",
                notes: "",
                icd10: "",
            },
        ]);
        setSearch("");
        setOpen(false);
    };

    const removeDiagnosis = (code: string) => {
        setDiagnoses((prev) => {
            const next = prev.filter((d) => d.code !== code);
            // If we removed the primary and there are others, promote first
            if (next.length > 0 && !next.some((d) => d.isPrimary)) {
                next[0].isPrimary = true;
            }
            return next;
        });
    };

    const setPrimary = (code: string) => {
        setDiagnoses((prev) =>
            prev.map((d) => ({ ...d, isPrimary: d.code === code }))
        );
    };

    const updateField = (code: string, field: keyof LocalDiagnosis, value: string) => {
        setDiagnoses((prev) =>
            prev.map((d) => (d.code === code ? { ...d, [field]: value } : d))
        );
    };

    const originalCodes = JSON.stringify(fromEncounter(encounter));
    const isDirty = JSON.stringify(diagnoses) !== originalCodes;

    const hasPrimary = diagnoses.some((d) => d.isPrimary);
    const canSave = diagnoses.length > 0 && hasPrimary && isDirty;

    const handleSave = () =>
        replaceDiagnoses.mutateAsync({
            encounterId: encounter.id,
            diagnoses: diagnoses.map((d) => ({
                diagnosis_code: d.code,
                is_primary: d.isPrimary,
                tooth_numbers: d.toothNumbers
                    ? d.toothNumbers.split(",").map((n) => parseInt(n.trim(), 10)).filter(Boolean)
                    : null,
                notes: d.notes || null,
                icd10_code: d.icd10 || null,
            })),
        });

    if (isLoading) return <SectionLoader message="Loading diagnosis taxonomy..." />;

    return (
        <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-slate-800">Diagnosis</h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Exactly one diagnosis must be marked as primary.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {isDirty && <span className="text-xs font-semibold text-amber-600">Unsaved</span>}

                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button size="sm" variant="outline" className="rounded-xl gap-1.5">
                                    <Plus className="h-3.5 w-3.5" /> Add
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0 overflow-hidden" align="end">
                                <div className="p-3 border-b border-slate-100">
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                                        <Input
                                            autoFocus
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search diagnoses..."
                                            className="pl-8 h-8 text-sm"
                                        />
                                    </div>
                                </div>
                                <ScrollArea className="h-[min(320px,60vh)]">
                                    {Object.entries(filteredTaxonomy).map(([category, items]) => (
                                        <div key={category}>
                                            <div className="px-3 py-1.5 bg-slate-50 sticky top-0">
                                                <span className="text-[10px] font-bold uppercase text-slate-400">
                                                    {category}
                                                </span>
                                            </div>
                                            {items.map((item) => (
                                                <button
                                                    key={item}
                                                    onClick={() => addDiagnosis(item)}
                                                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                                                >
                                                    {item}
                                                </button>
                                            ))}
                                        </div>
                                    ))}
                                </ScrollArea>
                            </PopoverContent>
                        </Popover>

                        <Button
                            size="sm"
                            disabled={!canSave || replaceDiagnoses.isPending}
                            onClick={handleSave}
                            className="rounded-xl bg-brand-600"
                        >
                            {replaceDiagnoses.isPending ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </div>

                {/* Diagnosis list */}
                {diagnoses.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400">
                        No diagnosis added. At least one is required to complete the encounter.
                    </div>
                ) : (
                    <div className="space-y-2">
                        {diagnoses.map((d) => (
                            <div
                                key={d.code}
                                className={`
                                rounded-xl border p-3 space-y-2.5 transition-colors
                                ${d.isPrimary ? "border-brand-200 bg-brand-50/40" : "border-slate-200 bg-white"}
                                `}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <button
                                            onClick={() => setPrimary(d.code)}
                                            title="Mark as primary"
                                            className="shrink-0"
                                        >
                                            <Star
                                                className={`h-4 w-4 transition-colors ${d.isPrimary
                                                        ? "fill-amber-400 text-amber-400"
                                                        : "text-slate-300 hover:text-amber-300"
                                                    }`}
                                            />
                                        </button>
                                        <span className="text-sm font-semibold text-slate-800 truncate">
                                            {d.code}
                                        </span>
                                        {d.isPrimary && (
                                            <Badge className="text-[10px] bg-brand-600 text-white px-1.5 py-0 h-4 shrink-0">
                                                Primary
                                            </Badge>
                                        )}
                                    </div>
                                    <button onClick={() => removeDiagnosis(d.code)}>
                                        <X className="h-4 w-4 text-slate-300 hover:text-red-400" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <Input
                                        value={d.toothNumbers}
                                        onChange={(e) => updateField(d.code, "toothNumbers", e.target.value)}
                                        placeholder="Teeth: 14, 15..."
                                        className="h-7 text-xs bg-white col-span-1"
                                    />
                                    <Input
                                        value={d.icd10}
                                        onChange={(e) => updateField(d.code, "icd10", e.target.value)}
                                        placeholder="ICD-10 code"
                                        className="h-7 text-xs bg-white"
                                    />
                                    <Input
                                        value={d.notes}
                                        onChange={(e) => updateField(d.code, "notes", e.target.value)}
                                        placeholder="Notes"
                                        className="h-7 text-xs bg-white"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!hasPrimary && diagnoses.length > 0 && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                        <Star className="h-3 w-3" /> Click the star icon on a diagnosis to mark it as primary before saving.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}