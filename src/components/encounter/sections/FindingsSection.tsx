"use client";

import { useState } from "react";
import { Plus, X, Search, Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SectionLoader } from "@/components/base/loading-view";

import { useFindingsTaxonomy } from "@/hooks/taxonomy/use-taxonomy";
import { useCreateFindings, useDeleteFinding } from "@/hooks/encounter/use-encounter-workflow";

import type { EncounterDetail } from "@/lib/api";

type Props = { encounter: EncounterDetail; appointmentId: string };
type PendingFinding = { code: string; toothNumbers: string; notes: string };

export default function FindingsSection({ encounter, appointmentId }: Props) {
    const { data: taxonomyData, isLoading } = useFindingsTaxonomy();
    const createFindings = useCreateFindings(appointmentId);
    const deleteFinding = useDeleteFinding(appointmentId);

    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState<PendingFinding[]>([]);

    const taxonomy = (taxonomyData as any)?.taxonomy as Record<string, string[]> | undefined;

    const existing = encounter.clinical_findings ?? [];

    const existingCodes = new Set(existing.map((f: any) => f.finding_code));
    const pendingCodes = new Set(pending.map((p) => p.code));

    const filteredTaxonomy = taxonomy
        ? Object.entries(taxonomy).reduce<Record<string, string[]>>((acc, [cat, items]) => {
            const filtered = items.filter(
                (item) =>
                    !existingCodes.has(item) &&
                    !pendingCodes.has(item) &&
                    item.toLowerCase().includes(search.toLowerCase())
            );
            if (filtered.length) acc[cat] = filtered;
            return acc;
        }, {})
        : {};

    const addToPending = (code: string) => {
        setPending((prev) => [...prev, { code, toothNumbers: "", notes: "" }]);
        setSearch("");
        setOpen(false);
    };

    const removePending = (code: string) =>
        setPending((prev) => prev.filter((p) => p.code !== code));

    const updatePending = (code: string, field: "toothNumbers" | "notes", value: string) =>
        setPending((prev) =>
            prev.map((p) => (p.code === code ? { ...p, [field]: value } : p))
        );

    const handleAdd = async () => {
        if (!pending.length) return;
        await createFindings.mutateAsync({
            encounterId: encounter.id,
            findings: pending.map((p) => ({
                finding_code: p.code,
                tooth_numbers: p.toothNumbers
                    ? p.toothNumbers.split(",").map((n) => parseInt(n.trim(), 10)).filter(Boolean)
                    : null,
                notes: p.notes || null,
            })),
        });
        setPending([]);
    };

    if (isLoading) return <SectionLoader message="Loading findings taxonomy..." />;

    return (
        <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-slate-800">Clinical Findings</h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {existing.length} finding{existing.length !== 1 ? "s" : ""} recorded
                        </p>
                    </div>

                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button size="sm" className="rounded-xl bg-brand-600 gap-1.5">
                                <Plus className="h-3.5 w-3.5" /> Add Finding
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
                                        placeholder="Search findings..."
                                        className="pl-8 h-8 text-sm"
                                    />
                                </div>
                            </div>

                            <ScrollArea className="h-[min(320px,60vh)]">
                                {Object.entries(filteredTaxonomy).map(([category, items]) => (
                                    <div key={category}>
                                        <div className="px-3 py-1.5 bg-slate-50 sticky top-0">
                                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                                {category}
                                            </span>
                                        </div>
                                        {items.map((item) => (
                                            <button
                                                key={item}
                                                onClick={() => addToPending(item)}
                                                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                ))}
                                {Object.keys(filteredTaxonomy).length === 0 && (
                                    <div className="px-3 py-6 text-center text-xs text-slate-400">
                                        No findings match your search
                                    </div>
                                )}
                            </ScrollArea>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Pending (staged, not yet saved) */}
                {pending.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-amber-600 uppercase">
                            Pending — not yet saved
                        </p>
                        {pending.map((p) => (
                            <div
                                key={p.code}
                                className="rounded-xl border border-amber-200 bg-amber-50/40 p-3 space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-slate-800">{p.code}</span>
                                    <button onClick={() => removePending(p.code)}>
                                        <X className="h-4 w-4 text-slate-400 hover:text-red-500" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        value={p.toothNumbers}
                                        onChange={(e) => updatePending(p.code, "toothNumbers", e.target.value)}
                                        placeholder="Teeth: 14, 15..."
                                        className="h-7 text-xs bg-white"
                                    />
                                    <Input
                                        value={p.notes}
                                        onChange={(e) => updatePending(p.code, "notes", e.target.value)}
                                        placeholder="Notes (optional)"
                                        className="h-7 text-xs bg-white"
                                    />
                                </div>
                            </div>
                        ))}

                        <Button
                            size="sm"
                            onClick={handleAdd}
                            disabled={createFindings.isPending}
                            className="w-full rounded-xl bg-brand-600"
                        >
                            {createFindings.isPending
                                ? "Saving..."
                                : `Save ${pending.length} Finding${pending.length > 1 ? "s" : ""}`}
                        </Button>
                    </div>
                )}

                {/* Existing findings */}
                {existing.length > 0 && (
                    <>
                        {pending.length > 0 && <Separator />}
                        <div className="space-y-2">
                            {existing.map((f: any) => (
                                <div
                                    key={f.id}
                                    className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold text-slate-800">{f.finding_name}</div>
                                        {f.tooth_numbers?.length > 0 && (
                                            <div className="flex items-center gap-1 mt-1 flex-wrap">
                                                {f.tooth_numbers.map((t: number) => (
                                                    <Badge
                                                        key={t}
                                                        variant="outline"
                                                        className="text-[10px] px-1.5 py-0 h-4 bg-slate-50"
                                                    >
                                                        #{t}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                        {f.notes && (
                                            <p className="text-xs text-slate-400 mt-1">{f.notes}</p>
                                        )}
                                    </div>

                                    <button
                                        onClick={() =>
                                            deleteFinding.mutate({ encounterId: encounter.id, findingId: f.id })
                                        }
                                        disabled={deleteFinding.isPending && deleteFinding.variables?.findingId === f.id}
                                        className="text-slate-300 hover:text-red-400 transition-colors mt-0.5 shrink-0"
                                    >
                                        {deleteFinding.isPending ?
                                        <Loader2 className="h-4 w-4 animate-spin" /> :
                                        <X className="h-4 w-4" />
                                        }
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {existing.length === 0 && pending.length === 0 && (
                    <div className="text-center py-8 text-xs text-slate-400">
                        No findings recorded. Use "Add Finding" to begin.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}