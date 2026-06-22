"use client";

import { useState } from "react";
import {
    Plus, Search, Play, SkipForward, X,
    CheckCircle2, Clock, AlertCircle, Ban,
    ChevronRight, Wallet,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog, AlertDialogContent, AlertDialogHeader,
    AlertDialogTitle, AlertDialogDescription,
    AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { 
    useProcedureCatalogs, 
    useSearchProcedureCatalog } from "@/hooks/procedure-catalog/use-procedure-catalog";

import {
    useCreateTreatmentPlan,
    usePerformTreatmentPlanItem,
    useDeferTreatmentPlanItem,
    useCancelTreatmentPlanItem,
    useAddTreatmentPlanItems
} from "@/hooks/encounter/use-encounter-workflow";

import type { EncounterDetail } from "@/lib/api";

// Types
type Props = { encounter: EncounterDetail; appointmentId: string };

type DraftItem = {
    procedure_catalog_id: string;
    procedure_name: string;
    tooth_numbers: string;
    visit_number: number;
    estimated_cost: string;
    notes: string;
};

type PerformTarget = { id: string; name: string | null; estimated_cost: number | null };

// Status config
const ITEM_STATUS: Record<string, {
    icon: any; label: string;
    badge: string; row: string;
}> = {
    PENDING: {
        icon: Clock,
        label: "Pending",
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        row: "border-slate-200",
    },
    DONE: {
        icon: CheckCircle2,
        label: "Done",
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        row: "border-emerald-100 bg-emerald-50/30",
    },
    DEFERRED: {
        icon: SkipForward,
        label: "Deferred",
        badge: "bg-sky-50 text-sky-700 border-sky-200",
        row: "border-slate-200 opacity-70",
    },
    CANCELLED: {
        icon: Ban,
        label: "Cancelled",
        badge: "bg-slate-50 text-slate-400 border-slate-200",
        row: "border-slate-100 opacity-50",
    },
};

// Procedure catalog picker
function CatalogPicker({ onSelect }: { onSelect: (item: any) => void }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const { data: defaultList } = useProcedureCatalogs({ limit: 30 });
    const { data: searchResults } = useSearchProcedureCatalog(search);

    const items = search.length >= 2
        ? (searchResults as any)?.items ?? searchResults ?? []
        : (defaultList as any)?.items ?? defaultList ?? [];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button size="sm" variant="outline" className="rounded-xl gap-1.5">
                    <Plus className="h-3.5 w-3.5" /> Add Procedure
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 p-0 overflow-x-hidden" align="start">
                <div className="p-3 border-b border-slate-100">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                        <Input
                            autoFocus
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search procedures..."
                            className="pl-8 h-8 text-sm"
                        />
                    </div>
                </div>
                <ScrollArea className="h-[min(320px,60vh)]">
                    {items.length === 0 ? (
                        <div className="px-3 py-6 text-center text-xs text-slate-400">
                            {search.length >= 2 ? "No procedures found" : "Loading procedures..."}
                        </div>
                    ) : (
                        items.map((item: any) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onSelect(item);
                                    setSearch("");
                                    setOpen(false);
                                }}
                                className="w-full text-left px-3 py-2.5 hover:bg-brand-50 transition-colors border-b border-slate-50 last:border-0"
                            >
                                <div className="text-sm font-semibold text-slate-800">{item.name}</div>
                                {item.default_cost != null && (
                                    <div className="text-xs text-slate-400 mt-0.5">
                                        Rs {item.default_cost}
                                    </div>
                                )}
                            </button>
                        ))
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}

// Perform dialog
function PerformDialog({
    target,
    encounterId,
    appointmentId,
    open,
    onOpenChange,
}: {
    target: PerformTarget | null;
    encounterId: string;
    appointmentId: string;
    open: boolean;
    onOpenChange: (v: boolean) => void;
}) {
    const [finalCost, setFinalCost] = useState(
        target?.estimated_cost?.toString() ?? ""
    );
    const [duration, setDuration] = useState("");
    const [notes, setNotes] = useState("");

    const perform = usePerformTreatmentPlanItem(appointmentId);

    const handleSubmit = async () => {
        if (!target) return;
        await perform.mutateAsync({
            encounterId,
            itemId: target.id,
            payload: {
                final_cost: finalCost ? Number(finalCost) : null,
                notes: notes || null,
                performed_duration_minutes: duration ? Number(duration) : null,
            },
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Perform Procedure</DialogTitle>
                    <p className="text-xs text-slate-400 mt-1">{target?.name}</p>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-600">
                                Final Cost (Rs)
                            </Label>
                            <Input
                                type="number"
                                value={finalCost}
                                onChange={(e) => setFinalCost(e.target.value)}
                                placeholder={target?.estimated_cost?.toString() ?? "0"}
                                className="bg-white"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-600">
                                Duration (mins)
                            </Label>
                            <Input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                placeholder="30"
                                className="bg-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">Notes</Label>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Procedure notes..."
                            rows={2}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={perform.isPending}
                        className="bg-brand-600"
                    >
                        {perform.isPending ? "Recording..." : "Mark as Performed"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Create plan view (no existing plan)
function CreatePlanView({
    encounter,
    appointmentId,
}: {
    encounter: EncounterDetail;
    appointmentId: string;
}) {
    const [items, setItems] = useState<DraftItem[]>([]);
    const [planNotes, setPlanNotes] = useState("");

    const createPlan = useCreateTreatmentPlan(appointmentId);

    const addItem = (catalog: any) => {
        setItems((prev) => [
            ...prev,
            {
                procedure_catalog_id: catalog.id,
                procedure_name: catalog.name,
                tooth_numbers: "",
                visit_number: 1,
                estimated_cost: catalog.default_cost?.toString() ?? "",
                notes: "",
            },
        ]);
    };

    const removeItem = (idx: number) =>
        setItems((prev) => prev.filter((_, i) => i !== idx));

    const updateItem = (idx: number, field: keyof DraftItem, value: string | number) =>
        setItems((prev) =>
            prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
        );

    const totalEstimated = items.reduce(
        (sum, i) => sum + (Number(i.estimated_cost) || 0),
        0
    );

    const handleCreate = async () => {
        await createPlan.mutateAsync({
            encounterId: encounter.id,
            payload: {
                notes: planNotes || null,
                items: items.map((item) => ({
                    procedure_catalog_id: item.procedure_catalog_id,
                    tooth_numbers: item.tooth_numbers
                        ? item.tooth_numbers.split(",").map((n) => parseInt(n.trim(), 10)).filter(Boolean)
                        : null,
                    visit_number: item.visit_number,
                    estimated_cost: item.estimated_cost ? Number(item.estimated_cost) : null,
                    notes: item.notes || null,
                })),
            },
        });
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                    Build the treatment plan for this encounter. Add procedures, assign visit numbers, and set cost estimates.
                </p>
                <CatalogPicker onSelect={addItem} />
            </div>

            {items.length === 0 ? (
                <div className="text-center py-10 rounded-xl border-2 border-dashed border-slate-200">
                    <div className="text-xs text-slate-400">
                        No procedures added yet. Use "Add Procedure" to build the plan.
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className="rounded-xl border border-slate-200 bg-white p-3 space-y-2.5"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-800">
                                    {item.procedure_name}
                                </span>
                                <button onClick={() => removeItem(idx)}>
                                    <X className="h-4 w-4 text-slate-300 hover:text-red-400" />
                                </button>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                <Input
                                    value={item.tooth_numbers}
                                    onChange={(e) => updateItem(idx, "tooth_numbers", e.target.value)}
                                    placeholder="Teeth: 14,15"
                                    className="h-7 text-xs bg-white col-span-2"
                                />
                                <div className="relative">
                                    <span className="absolute left-2.5 top-1.5 text-xs text-slate-400">Rs</span>
                                    <Input
                                        type="number"
                                        value={item.estimated_cost}
                                        onChange={(e) => updateItem(idx, "estimated_cost", e.target.value)}
                                        placeholder="Cost"
                                        className="h-7 text-xs bg-white pl-7"
                                    />
                                </div>
                                <Input
                                    type="number"
                                    min={1}
                                    value={item.visit_number}
                                    onChange={(e) => updateItem(idx, "visit_number", Number(e.target.value))}
                                    placeholder="Visit #"
                                    className="h-7 text-xs bg-white"
                                    title="Visit number (1 = this visit)"
                                />
                            </div>

                            <Input
                                value={item.notes}
                                onChange={(e) => updateItem(idx, "notes", e.target.value)}
                                placeholder="Notes (optional)"
                                className="h-7 text-xs bg-white"
                            />
                        </div>
                    ))}
                </div>
            )}

            {items.length > 0 && (
                <>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">Plan Notes</Label>
                        <Textarea
                            value={planNotes}
                            onChange={(e) => setPlanNotes(e.target.value)}
                            placeholder="Overall treatment notes..."
                            rows={2}
                            className="bg-white"
                        />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                        <div className="text-sm font-bold text-slate-700">
                            Estimated Total:
                            <span className="text-brand-700 ml-1.5">Rs {totalEstimated.toLocaleString()}</span>
                        </div>
                        <Button
                            onClick={handleCreate}
                            disabled={items.length === 0 || createPlan.isPending}
                            className="rounded-xl bg-brand-600"
                        >
                            {createPlan.isPending ? "Creating..." : "Create Treatment Plan"}
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}

// Existing plan view
function PlanItemRow({
    item,
    encounterId,
    appointmentId,
    onPerform,
}: {
    item: any;
    encounterId: string;
    appointmentId: string;
    onPerform: (target: PerformTarget) => void;
}) {
    const defer = useDeferTreatmentPlanItem(appointmentId);
    const cancel = useCancelTreatmentPlanItem(appointmentId);
    const [confirmCancel, setConfirmCancel] = useState(false);

    const cfg = ITEM_STATUS[item.status] ?? ITEM_STATUS.PENDING;
    const StatusIcon = cfg.icon;
    const canAct = item.status === "PENDING" || item.status === "DEFERRED";

    return (
        <>
            <div className={`rounded-xl border p-3 flex items-start gap-3 ${cfg.row}`}>
                <StatusIcon className={`h-4 w-4 mt-0.5 shrink-0 ${item.status === "DONE" ? "text-emerald-500" :
                        item.status === "DEFERRED" ? "text-sky-400" :
                            item.status === "CANCELLED" ? "text-slate-300" : "text-amber-400"
                    }`} />

                <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-800">
                            {item.procedure_name}
                        </span>
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 ${cfg.badge}`}>
                            {cfg.label}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                        {item.tooth_numbers?.length > 0 && (
                            <span>
                                Teeth: {item.tooth_numbers.map((t: number) => `#${t}`).join(", ")}
                            </span>
                        )}
                        {item.estimated_cost != null && (
                            <span>Est. Rs {item.estimated_cost.toLocaleString()}</span>
                        )}
                        <span>Visit {item.visit_number}</span>
                    </div>

                    {item.notes && (
                        <p className="text-xs text-slate-400">{item.notes}</p>
                    )}
                </div>

                {canAct && (
                    <div className="flex items-center gap-1 shrink-0">
                        <Button
                            size="sm"
                            className="h-7 rounded-lg bg-brand-600 text-xs gap-1"
                            onClick={() =>
                                onPerform({
                                    id: item.id,
                                    name: item.procedure_name,
                                    estimated_cost: item.estimated_cost,
                                })
                            }
                        >
                            <Play className="h-3 w-3" />
                            Perform
                        </Button>

                        {item.status === "PENDING" && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-7 rounded-lg text-xs gap-1"
                                disabled={defer.isPending && defer.variables?.itemId === item.id}
                                onClick={() =>
                                    defer.mutate({ encounterId, itemId: item.id })
                                }
                            >
                                <SkipForward className="h-3 w-3" />
                            </Button>
                        )}

                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 rounded-lg text-xs text-slate-400 hover:text-red-500"
                            onClick={() => setConfirmCancel(true)}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                )}
            </div>

            <AlertDialog open={confirmCancel} onOpenChange={setConfirmCancel}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel this item?</AlertDialogTitle>
                        <AlertDialogDescription>
                            "{item.procedure_name}" will be marked as cancelled.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Keep</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                cancel.mutate({ encounterId, itemId: item.id });
                                setConfirmCancel(false);
                            }}
                        >
                            Cancel Item
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

function ExistingPlanView({
    encounter,
    appointmentId,
}: {
    encounter: EncounterDetail;
    appointmentId: string;
}) {
    const plan = encounter.treatment_plan!;
    const [performTarget, setPerformTarget] = useState<PerformTarget | null>(null);
    const [pendingAdds, setPendingAdds] = useState<DraftItem[]>([]);

    const addItems = useAddTreatmentPlanItems(appointmentId);
    const handleAddToPlan = async () => {
        await addItems.mutateAsync({
            encounterId: encounter.id,
            items: pendingAdds.map((item) => ({
                procedure_catalog_id: item.procedure_catalog_id,
                tooth_numbers: item.tooth_numbers
                    ? item.tooth_numbers.split(",").map((n) => parseInt(n.trim(), 10)).filter(Boolean)
                    : null,
                visit_number: item.visit_number,
                estimated_cost: item.estimated_cost ? Number(item.estimated_cost) : null,
                notes: item.notes || null,
            })),
        });
        setPendingAdds([]);
    };

    // Group items by visit_number
    const byVisit = plan.items?.reduce<Record<number, any[]>>((acc, item) => {
        const v = item.visit_number ?? 1;
        if (!acc[v]) acc[v] = [];
        acc[v].push(item);
        return acc;
    }, {});

    const visits = Object.keys(byVisit!)
        .map(Number)
        .sort((a, b) => a - b);

    const pendingCount = plan.items?.filter((i) => i.status === "PENDING").length;
    const doneCount = plan.items?.filter((i) => i.status === "DONE").length;

    return (
        <div className="space-y-5">
            {/* Plan header stats */}
            <div className="flex items-center justify-between">
                <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-center">
                        <div className="text-lg font-bold text-slate-800">{plan.items?.length}</div>
                        <div className="text-[11px] text-slate-400 uppercase font-semibold mt-0.5">Total Items</div>
                    </div>
                    <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-center">
                        <div className="text-lg font-bold text-amber-700">{pendingCount}</div>
                        <div className="text-[11px] text-amber-600 uppercase font-semibold mt-0.5">Pending</div>
                    </div>
                    <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center">
                        <div className="text-lg font-bold text-emerald-700">{doneCount}</div>
                        <div className="text-[11px] text-emerald-600 uppercase font-semibold mt-0.5">Done</div>
                    </div>

                    <CatalogPicker
                        onSelect={(catalog) =>
                            setPendingAdds((prev) => [
                                ...prev,
                                {
                                    procedure_catalog_id: catalog.id,
                                    procedure_name: catalog.name,
                                    tooth_numbers: "",
                                    visit_number: Math.max(...(plan.items?.map((i) => i.visit_number) ?? [1])),
                                    estimated_cost: catalog.default_cost?.toString() ?? "",
                                    notes: "",
                                },
                            ])
                        }
                    />
                </div>

            </div>

            {plan.notes && (
                <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    {plan.notes}
                </div>
            )}

            {/* Staged adds -> show inline before committing */}
            {pendingAdds.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-bold text-amber-600 uppercase">
                        Staged — not yet added to plan
                    </p>
                    {pendingAdds.map((item, idx) => (
                        <div key={idx} className="rounded-xl border border-amber-200 bg-amber-50/40 p-3 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-800">{item.procedure_name}</span>
                                <button onClick={() => setPendingAdds((p) => p.filter((_, i) => i !== idx))}>
                                    <X className="h-4 w-4 text-slate-400 hover:text-red-400" />
                                </button>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                <Input
                                    value={item.tooth_numbers}
                                    onChange={(e) =>
                                        setPendingAdds((p) =>
                                            p.map((x, i) => i === idx ? { ...x, tooth_numbers: e.target.value } : x)
                                        )
                                    }
                                    placeholder="Teeth: 14,15"
                                    className="h-7 text-xs bg-white col-span-2"
                                />
                                <div className="relative">
                                    <span className="absolute left-2 top-1.5 text-xs text-slate-400">Rs</span>
                                    <Input
                                        type="number"
                                        value={item.estimated_cost}
                                        onChange={(e) =>
                                            setPendingAdds((p) =>
                                                p.map((x, i) => i === idx ? { ...x, estimated_cost: e.target.value } : x)
                                            )
                                        }
                                        className="h-7 text-xs bg-white pl-6"
                                    />
                                </div>
                                <Input
                                    type="number"
                                    min={1}
                                    value={item.visit_number}
                                    onChange={(e) =>
                                        setPendingAdds((p) =>
                                            p.map((x, i) => i === idx ? { ...x, visit_number: Number(e.target.value) } : x)
                                        )
                                    }
                                    placeholder="Visit #"
                                    className="h-7 text-xs bg-white"
                                />
                            </div>
                        </div>
                    ))}
                    <Button
                        onClick={handleAddToPlan}
                        disabled={addItems.isPending}
                        className="w-full rounded-xl bg-brand-600"
                    >
                        {addItems.isPending
                            ? "Adding..."
                            : `Add ${pendingAdds.length} Item${pendingAdds.length > 1 ? "s" : ""} to Plan`}
                    </Button>
                </div>
            )}

            {/* Items grouped by visit */}
            {visits.map((visitNum) => (
                <div key={visitNum}>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold uppercase text-slate-500">
                            Visit : {visitNum}
                            {visitNum === 1 ? " Today" : ""}
                        </span>
                        <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    <div className="space-y-2">
                        {byVisit && byVisit[visitNum].map((item: any) => (
                            <PlanItemRow
                                key={item.id}
                                item={item}
                                encounterId={encounter.id}
                                appointmentId={appointmentId}
                                onPerform={setPerformTarget}
                            />
                        ))}
                    </div>
                </div>
            ))}

            {/* Total cost footer */}
            <Separator />
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Wallet className="h-4 w-4" />
                    Estimated Total
                </div>
                <div className="text-base font-bold text-slate-800">
                    Rs {(plan.estimated_total_cost ?? 0).toLocaleString()}
                </div>
            </div>

            <PerformDialog
                target={performTarget}
                encounterId={encounter.id}
                appointmentId={appointmentId}
                open={!!performTarget}
                onOpenChange={(v) => !v && setPerformTarget(null)}
            />
        </div>
    );
}

// Main section
export default function TreatmentPlanSection({ encounter, appointmentId }: Props) {
    const hasPlan = Boolean(encounter.treatment_plan);

    return (
        <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-slate-800">Treatment Plan</h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {hasPlan
                                ? `${encounter.treatment_plan?.items?.length} procedure(s) planned`
                                : "No plan created yet:- build one below."}
                        </p>
                    </div>

                    {hasPlan && (
                        <Badge
                            variant="outline"
                            className={`text-xs font-bold px-2.5 py-1 ${encounter.treatment_plan!.status === "COMPLETED"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                }`}
                        >
                            {encounter.treatment_plan!.status}
                        </Badge>
                    )}
                </div>

                {hasPlan ? (
                    <ExistingPlanView encounter={encounter} appointmentId={appointmentId} />
                ) : (
                    <CreatePlanView encounter={encounter} appointmentId={appointmentId} />
                )}
            </CardContent>
        </Card>
    );
}