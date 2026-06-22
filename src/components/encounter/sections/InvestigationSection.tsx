"use client";

import { useState } from "react";
import { Plus, Search, CheckCircle2, XCircle, Clock } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SectionLoader } from "@/components/base/loading-view";

import { useInvestigationsTaxonomy } from "@/hooks/taxonomy/use-taxonomy";
import {
    useCreateInvestigations,
    useUpdateInvestigationResult,
} from "@/hooks/encounter/use-encounter-workflow";

import type { EncounterDetail, InvestigationStatusEnum } from "@/lib/api";

type Props = { encounter: EncounterDetail; appointmentId: string };

const STATUS_CONFIG: Record<string, { icon: any; classes: string; label: string }> = {
    PENDING: {
        icon: Clock,
        classes: "bg-amber-50 text-amber-700 border-amber-200",
        label: "Pending",
    },
    COMPLETED: {
        icon: CheckCircle2,
        classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
        label: "Completed",
    },
    CANCELLED: {
        icon: XCircle,
        classes: "bg-slate-50 text-slate-500 border-slate-200",
        label: "Cancelled",
    },
};

function ResultDialog({
    investigation,
    encounterId,
    appointmentId,
    open,
    onOpenChange,
}: {
    investigation: any;
    encounterId: string;
    appointmentId: string;
    open: boolean;
    onOpenChange: (v: boolean) => void;
}) {
    const [result, setResult] = useState(investigation?.result ?? "");
    const [status, setStatus] = useState<InvestigationStatusEnum>("COMPLETED");
    const updateResult = useUpdateInvestigationResult(appointmentId);

    const handleSave = async () => {
        await updateResult.mutateAsync({
            encounterId,
            investigationId: investigation.id,
            payload: { result: result || null, status },
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Record Result</DialogTitle>
                    <p className="text-xs text-slate-400">{investigation?.investigation_name}</p>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600">Status</label>
                        <Select
                            value={status}
                            onValueChange={(value) => setStatus(value as InvestigationStatusEnum)}
                        >
                            <SelectTrigger className="h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600">Result / Findings</label>
                        <Textarea
                            value={result}
                            onChange={(e) => setResult(e.target.value)}
                            placeholder="Enter investigation result..."
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        onClick={handleSave}
                        disabled={updateResult.isPending}
                        className="bg-brand-600"
                    >
                        {updateResult.isPending ? "Saving..." : "Save Result"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function InvestigationSection({ encounter, appointmentId }: Props) {
    const { data: taxonomyData, isLoading } = useInvestigationsTaxonomy();
    const createInvestigations = useCreateInvestigations(appointmentId);

    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [resultTarget, setResultTarget] = useState<any>(null);

    const taxonomy = (taxonomyData as any)?.taxonomy as Record<string, string[]> | undefined;
    const existing = encounter.investigations ?? [];
    const existingCodes = new Set(existing.map((i: any) => i.investigation_code));

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

    const addInvestigation = async (code: string) => {
        setOpen(false);
        await createInvestigations.mutateAsync({
            encounterId: encounter.id,
            investigations: [{ investigation_code: code, notes: null }],
        });
    };

    if (isLoading) return <SectionLoader message="Loading investigations..." />;

    return (
        <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-slate-800">Investigations</h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {existing.length} ordered
                        </p>
                    </div>

                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button size="sm" className="rounded-xl bg-brand-600 gap-1.5">
                                <Plus className="h-3.5 w-3.5" /> Order
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
                                        placeholder="Search investigations..."
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
                                                onClick={() => addInvestigation(item)}
                                                disabled={createInvestigations.isPending}
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
                </div>

                {/* Existing investigations */}
                {existing.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400">
                        No investigations ordered yet.
                    </div>
                ) : (
                    <div className="space-y-2">
                        {existing.map((inv: any) => {
                            const cfg = STATUS_CONFIG[inv.status] ?? STATUS_CONFIG.PENDING;
                            const StatusIcon = cfg.icon;
                            const isPending = inv.status === "PENDING" || inv.status === "REQUESTED";

                            return (
                                <div
                                    key={inv.id}
                                    className="rounded-xl border border-slate-200 bg-white p-3 flex items-start gap-3"
                                >
                                    <StatusIcon className={`h-4 w-4 mt-0.5 shrink-0 ${inv.status === "COMPLETED" ? "text-emerald-500" :
                                            inv.status === "CANCELLED" ? "text-slate-400" : "text-amber-500"
                                        }`} />

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-sm font-semibold text-slate-800">
                                                {inv.investigation_name}
                                            </span>
                                            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 ${cfg.classes}`}>
                                                {cfg.label}
                                            </Badge>
                                        </div>

                                        {inv.result && (
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                                {inv.result}
                                            </p>
                                        )}

                                        <p className="text-[10px] text-slate-400 mt-1">
                                            Ordered {new Date(inv.requested_at).toLocaleDateString()}
                                            {inv.completed_at &&
                                                ` · Completed ${new Date(inv.completed_at).toLocaleDateString()}`}
                                        </p>
                                    </div>

                                    {isPending && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="rounded-lg h-7 text-xs shrink-0"
                                            onClick={() => setResultTarget(inv)}
                                        >
                                            Record Result
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>

            {resultTarget && (
                <ResultDialog
                    investigation={resultTarget}
                    encounterId={encounter.id}
                    appointmentId={appointmentId}
                    open={!!resultTarget}
                    onOpenChange={(v) => !v && setResultTarget(null)}
                />
            )}
        </Card>
    );
}