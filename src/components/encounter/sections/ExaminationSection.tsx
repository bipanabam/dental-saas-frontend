"use client";

import { useState, useEffect } from "react";
import { ClipboardCheck, ChevronRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SectionLoader } from "@/components/base/loading-view";

import { useExaminationTaxonomy } from "@/hooks/taxonomy/use-taxonomy";
import { useUpsertExamination } from "@/hooks/encounter/use-encounter-workflow";

import type { EncounterDetail } from "@/lib/api";

type ExamField = { id: string; label: string; type: "text" | "checkbox" | "select"; options?: string[] };
type ExamTaxonomy = Record<string, ExamField[]>;
type Props = { encounter: EncounterDetail; appointmentId: string };

function buildInitialValues(encounter: EncounterDetail): Record<string, string> {
    return Object.fromEntries(
        (encounter.examination_findings ?? []).map((e: any) => [e.field_id, e.value])
    );
}

// Field renderers
function TextField({ field, value, onChange }: any) {
    return (
        <div className="space-y-1">
            <Label className="text-xs text-slate-500">{field.label}</Label>
            <Input
                value={value ?? ""}
                onChange={(e) => onChange(field.id, e.target.value)}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
                className="bg-white text-sm"
            />
        </div>
    );
}

function CheckboxField({ field, value, onChange }: any) {
    const checked = value === "true";
    return (
        <label className={`
      flex items-center gap-3 py-2.5 px-3 rounded-lg border cursor-pointer
      transition-colors select-none
      ${checked ? "bg-brand-50 border-brand-200" : "border-slate-100 hover:bg-slate-50"}
    `}>
            <Checkbox
                checked={checked}
                onCheckedChange={(v) => onChange(field.id, v ? "true" : "false")}
                className={checked ? "border-brand-600 bg-brand-600" : ""}
            />
            <span className={`text-sm ${checked ? "font-semibold text-slate-900" : "text-slate-700"}`}>
                {field.label}
            </span>
        </label>
    );
}

function SelectField({ field, value, onChange }: any) {
    return (
        <div className="space-y-1">
            <Label className="text-xs text-slate-500">{field.label}</Label>
            <Select value={value ?? ""} onValueChange={(v) => onChange(field.id, v)}>
                <SelectTrigger className="bg-white text-sm h-9">
                    <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                    {field.options?.map((opt: string) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

function renderField(field: ExamField, value: string | undefined, onChange: any) {
    switch (field.type) {
        case "text": return <TextField key={field.id} field={field} value={value} onChange={onChange} />;
        case "checkbox": return <CheckboxField key={field.id} field={field} value={value} onChange={onChange} />;
        case "select": return <SelectField key={field.id} field={field} value={value} onChange={onChange} />;
    }
}

// Category panel
function CategoryPanel({
    fields,
    values,
    onChange,
}: {
    fields: ExamField[];
    values: Record<string, string>;
    onChange: (id: string, v: string) => void;
}) {
    const textFields = fields.filter((f) => f.type === "text");
    const checkboxFields = fields.filter((f) => f.type === "checkbox");
    const selectFields = fields.filter((f) => f.type === "select");

    return (
        <div className="space-y-5">
            {selectFields.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                    {selectFields.map((f) => renderField(f, values[f.id], onChange))}
                </div>
            )}

            {checkboxFields.length > 0 && (
                <div>
                    <p className="text-[11px] font-bold uppercase text-slate-400 mb-2">Present / Absent</p>
                    <div className="grid grid-cols-2 gap-1.5">
                        {checkboxFields.map((f) => renderField(f, values[f.id], onChange))}
                    </div>
                </div>
            )}

            {textFields.length > 0 && (
                <div className="space-y-3">
                    {textFields.map((f) => renderField(f, values[f.id], onChange))}
                </div>
            )}
        </div>
    );
}


// Main section
export default function ExaminationSection({ encounter, appointmentId }: Props) {
    const { data: taxonomyData, isLoading } = useExaminationTaxonomy();
    const upsert = useUpsertExamination(appointmentId);

    const [values, setValues] = useState<Record<string, string>>(() =>
        buildInitialValues(encounter)
    );
    const [activeCategory, setActiveCategory] = useState<string>("");

    const taxonomy = (taxonomyData as any)?.taxonomy as ExamTaxonomy | undefined;

    useEffect(() => {
        if (taxonomy && !activeCategory) {
            setActiveCategory(Object.keys(taxonomy)[0] ?? "");
        }
    }, [taxonomy, activeCategory]);

    useEffect(() => {
        if (!upsert.isPending) setValues(buildInitialValues(encounter));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [encounter.updated_at]);

    const originalValues = buildInitialValues(encounter);
    const isDirty = Object.entries(values).some(
        ([k, v]) => originalValues[k] !== v
    ) || Object.keys(originalValues).some((k) => values[k] !== originalValues[k]);

    const handleChange = (fieldId: string, value: string) => {
        setValues((prev) => ({ ...prev, [fieldId]: value }));
    };

    const handleSave = async () => {
        if (!taxonomy) return;

        // Build entries: only include fields with non-empty values
        const entries = Object.entries(values)
            .filter(([, v]) => v !== "" && v !== undefined)
            .map(([field_id, value]) => {
                // Resolve category from taxonomy
                const category = Object.entries(taxonomy).find(([, fields]) =>
                    fields.some((f) => f.id === field_id)
                )?.[0] ?? "";
                return { category, field_id, value };
            });

        await upsert.mutateAsync({ encounterId: encounter.id, entries });
    };

    if (isLoading) return <SectionLoader message="Loading examination form..." />;
    if (!taxonomy) return null;

    const categories = Object.keys(taxonomy);
    const activeFields = taxonomy[activeCategory] ?? [];
    const filledCount = (encounter.examination_findings ?? []).length;

    return (
        <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-0">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div>
                        <h3 className="text-base font-bold text-slate-800">Clinical Examination</h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {filledCount} field{filledCount !== 1 ? "s" : ""} recorded
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {isDirty && <span className="text-xs font-semibold text-amber-600">Unsaved</span>}
                        <Button
                            size="sm"
                            disabled={!isDirty || upsert.isPending}
                            onClick={handleSave}
                            className="rounded-xl bg-brand-600"
                        >
                            {upsert.isPending ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-[200px_1fr]">
                    {/* Category sidebar */}
                    <div className="border-r border-slate-100 py-2">
                        {categories.map((cat) => {
                            const filled = taxonomy[cat].filter((f) => values[f.id]).length;
                            const isActive = cat === activeCategory;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`
                                        w-full text-left flex items-center justify-between
                                        px-4 py-2.5 text-xs font-semibold transition-colors
                                        ${isActive
                                            ? "bg-brand-50 text-brand-700 border-r-2 border-brand-600"
                                            : "text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    <span className="leading-tight">{cat}</span>
                                    {filled > 0 && (
                                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                                            {filled}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Active category fields */}
                    <div className="p-5 min-h-64">
                        <p className="text-xs font-bold uppercase text-slate-400 mb-4">
                            {activeCategory}
                        </p>
                        <CategoryPanel
                            fields={activeFields}
                            values={values}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}