"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, ShieldAlert, ClipboardList } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SectionLoader } from "@/components/base/loading-view";

import { useMedicalHistoryTaxonomy } from "@/hooks/taxonomy/use-taxonomy";
import { useUpsertMedicalHistory } from "@/hooks/encounter/use-encounter-workflow";

import type { EncounterDetail } from "@/lib/api";

// Types
type TaxonomyItem = { id: string; label: string; type: string };
type TaxonomyResponse = {
    taxonomy: Record<string, TaxonomyItem[]>;
    dental_relevant_questions: TaxonomyItem[];
};
type Props = { encounter: EncounterDetail; appointmentId: string };
type MedicalHistoryItem = {
    item_id: string;
    is_present: boolean;
    notes?: string | null;
};

// Helpers
function getSelectedIds(encounter: EncounterDetail): Set<string> {
    const items = encounter.medical_history?.items;

    if (!Array.isArray(items)) {
        return new Set();
    }

    return new Set(
        (items as MedicalHistoryItem[])
            .filter((item) => item.is_present)
            .map((item) => item.item_id)
    );
}

const SEVERITY: Record<string, { dot: string; badge: string; label: string }> = {
    critical: {
        dot: "bg-red-500",
        badge: "border-red-200 bg-red-50 text-red-700",
        label: "Critical",
    },
    warning: {
        dot: "bg-amber-400",
        badge: "border-amber-200 bg-amber-50 text-amber-700",
        label: "Review",
    },
};

// Single row: clipboard style
function FormRow({
    item,
    checked,
    onToggle,
}: {
    item: TaxonomyItem;
    checked: boolean;
    onToggle: (id: string) => void;
}) {
    const sev = SEVERITY[item.type];

    return (
        <label
            className={`
                flex items-center gap-3 py-2.5 px-3 rounded-lg cursor-pointer
                transition-colors duration-100 select-none
                ${checked
                    ? "bg-brand-50"
                    : "hover:bg-slate-50"
                }
            `}
        >
            <Checkbox
                checked={checked}
                onCheckedChange={() => onToggle(item.id)}
                className={checked ? "border-brand-600 bg-brand-600" : ""}
            />

            {/* Severity dot */}
            {sev && (
                <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${sev.dot}`} />
            )}

            <span className={`
                flex-1 text-sm
                ${checked ? "text-slate-900 font-semibold" : "text-slate-700"}
            `}>
                {item.label}
            </span>

            {sev && checked && (
                <Badge
                    variant="outline"
                    className={`text-[10px] font-bold px-1.5 py-0 h-4 shrink-0 ${sev.badge}`}
                >
                    {sev.label}
                </Badge>
            )}
        </label>
    );
}

// Category block — two-column grid
function CategoryBlock({
    category,
    items,
    selectedIds,
    onToggle,
}: {
    category: string;
    items: TaxonomyItem[];
    selectedIds: Set<string>;
    onToggle: (id: string) => void;
}) {
    const checkedCount = items.filter((i) => selectedIds.has(i.id)).length;
    const hasCritical = items.some(
        (i) => i.type === "critical" && selectedIds.has(i.id)
    );

    return (
        <div>
            {/* Category header — mimics a clipboard section divider */}
            <div className={`
                flex items-center justify-between
                px-3 py-2 rounded-t-lg border-b
                ${hasCritical
                    ? "bg-red-50 border-red-200"
                    : "bg-slate-50 border-slate-200"
                }
            `}>
                <span className={`
                    text-xs font-bold uppercase tracking-wider
                    ${hasCritical ? "text-red-700" : "text-slate-500"}
                `}>
                    {category}
                </span>

                {checkedCount > 0 && (
                    <Badge className="text-[10px] font-bold h-4 px-1.5 py-0 bg-white border border-slate-200 text-slate-600">
                        {checkedCount}/{items.length}
                    </Badge>
                )}
            </div>

            {/* Two-column grid of rows */}
            <div className="border border-t-0 border-slate-200 rounded-b-lg overflow-hidden">
                <div className="grid grid-cols-2 divide-x divide-slate-100">
                    {/* Left column */}
                    <div className="divide-y divide-slate-100">
                        {items
                            .filter((_, i) => i % 2 === 0)
                            .map((item) => (
                                <FormRow
                                    key={item.id}
                                    item={item}
                                    checked={selectedIds.has(item.id)}
                                    onToggle={onToggle}
                                />
                            ))}
                    </div>
                    {/* Right column */}
                    <div className="divide-y divide-slate-100">
                        {items
                            .filter((_, i) => i % 2 === 1)
                            .map((item) => (
                                <FormRow
                                    key={item.id}
                                    item={item}
                                    checked={selectedIds.has(item.id)}
                                    onToggle={onToggle}
                                />
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Dental questions: single column (only 8 items, questions not conditions)
function DentalQuestionsBlock({
    items,
    selectedIds,
    onToggle,
}: {
    items: TaxonomyItem[];
    selectedIds: Set<string>;
    onToggle: (id: string) => void;
}) {
    return (
        <div>
            <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-t-lg">
                <ClipboardList className="h-3.5 w-3.5 text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Dental Screening Questions
                </span>
            </div>

            <div className="border border-t-0 border-indigo-100 rounded-b-lg overflow-hidden divide-y divide-slate-100">
                {items.map((item) => (
                    <FormRow
                        key={item.id}
                        item={item}
                        checked={selectedIds.has(item.id)}
                        onToggle={onToggle}
                    />
                ))}
            </div>
        </div>
    );
}

// Main section
export default function MedicalHistorySection({ encounter, appointmentId }: Props) {
    const { data: taxonomyData, isLoading: taxonomyLoading } =
        useMedicalHistoryTaxonomy();

    const upsert = useUpsertMedicalHistory(appointmentId);

    const [selectedIds, setSelectedIds] = useState<Set<string>>(() =>
        getSelectedIds(encounter)
    );

    useEffect(() => {
        if (!upsert.isPending) {
            setSelectedIds(getSelectedIds(encounter));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [encounter.medical_history?.updated_at]);

    const originalIds = getSelectedIds(encounter);
    const isDirty =
        selectedIds.size !== originalIds.size ||
        [...selectedIds].some((id) => !originalIds.has(id)) ||
        [...originalIds].some((id) => !selectedIds.has(id));

    const toggle = (id: string) =>
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });

    const handleSave = () =>
        upsert.mutateAsync({
            encounterId: encounter.id,
            itemIds: [...selectedIds],
        });

    if (taxonomyLoading) {
        return <SectionLoader message="Loading medical history..." />;
    }

    const { taxonomy, dental_relevant_questions } =
        (taxonomyData as TaxonomyResponse) ?? {
            taxonomy: {},
            dental_relevant_questions: [],
        };

    // Critical items that are checked — for the alert banner
    const criticalFlagged = [...selectedIds].filter((id) =>
        Object.values(taxonomy)
            .flat()
            .find((i) => i.id === id && i.type === "critical")
    );

    return (
        <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-slate-800">
                            Medical History
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Check all conditions that apply.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {isDirty && (
                            <span className="text-xs font-semibold text-amber-600">
                                Unsaved
                            </span>
                        )}
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={!isDirty || upsert.isPending}
                            className="rounded-xl bg-brand-600"
                        >
                            {upsert.isPending ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </div>

                {/* Critical alert */}
                {criticalFlagged.length > 0 && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                        <div>
                            <div className="text-sm font-bold text-red-700">
                                {criticalFlagged.length} critical condition
                                {criticalFlagged.length > 1 ? "s" : ""} flagged
                            </div>
                            <p className="text-xs text-red-600 mt-0.5">
                                Review before proceeding with treatment.
                            </p>
                        </div>
                    </div>
                )}

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        Critical — may affect treatment safety
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        Review — note before proceeding
                    </span>
                </div>

                {/* Systemic categories */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 tracking-wider">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        Systemic Conditions
                    </div>

                    {Object.entries(taxonomy).map(([category, items]) => (
                        <CategoryBlock
                            key={category}
                            category={category}
                            items={items}
                            selectedIds={selectedIds}
                            onToggle={toggle}
                        />
                    ))}
                </div>

                {dental_relevant_questions.length > 0 && (
                    <>
                        <Separator />
                        <DentalQuestionsBlock
                            items={dental_relevant_questions}
                            selectedIds={selectedIds}
                            onToggle={toggle}
                        />
                    </>
                )}

            </CardContent>
        </Card>
    );
}