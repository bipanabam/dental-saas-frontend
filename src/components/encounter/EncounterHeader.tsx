"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, CalendarClock, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useCompleteAppointment } from "@/hooks/appointments/use-appointment-workflow";
import { usePatientSummary } from "@/hooks/patients/use-patients";
import { getEncounterProgress } from "@/lib/utils/encounter-stages";
import { getEncounterReadiness } from "@/lib/utils/encounter-completion";
import type { EncounterDetail } from "@/lib/api";

import ClinicalAlertBanner from "./ClinicalAlertBanner";

type Props = { encounter: EncounterDetail };

function useElapsed(startedAt: string, closedAt?: string | null) {
    const [elapsed, setElapsed] = useState("");
    useEffect(() => {
        const start = new Date(startedAt).getTime();
        const tick = () => {
            const end = closedAt ? new Date(closedAt).getTime() : Date.now();
            const mins = Math.floor((end - start) / 60000);
            const hrs = Math.floor(mins / 60);
            setElapsed(hrs > 0 ? `${hrs}h ${mins % 60}m` : `${mins}m`);
        };
        tick();
        if (closedAt) return;
        const id = setInterval(tick, 30000);
        return () => clearInterval(id);
    }, [startedAt, closedAt]);
    return elapsed;
}

const STATUS_STYLES: Record<string, string> = {
    IN_PROGRESS: "bg-indigo-50 text-indigo-700 border-indigo-100",
    CLOSED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    VOID: "bg-rose-50 text-rose-700 border-rose-100",
};


export default function EncounterHeader({ encounter }: Props) {
    const completeMutation = useCompleteAppointment();
    const isClosed = Boolean(encounter.closed_at);
    const elapsed = useElapsed(encounter.started_at, encounter.closed_at);
    const progress = getEncounterProgress(encounter);
    const readiness = useMemo(() => getEncounterReadiness(encounter), [encounter]);

    const [confirmOpen, setConfirmOpen] = useState(false);

    const { data: patientSummary, isLoading: isSummaryLoading } = usePatientSummary(encounter.patient_id);

    const vitals = [
        { label: "BP", val: encounter.bp_systolic && encounter.bp_diastolic ? `${encounter.bp_systolic}/${encounter.bp_diastolic}` : null },
        { label: "HR", val: encounter.pulse_rate },
        { label: "Temp", val: encounter.temperature ? `${encounter.temperature}°F` : null },
        { label: "Wt", val: encounter.weight_kg ? `${encounter.weight_kg}kg` : null },
        { label: "SpO₂", val: encounter.spo2 ? `${encounter.spo2}%` : null },
    ].filter(v => v.val !== null);

    const runComplete = async () => {
        await completeMutation.mutateAsync(encounter.appointment_id);
    };

    const handleCompleteClick = () => {
        if (!readiness.canComplete) return; // button is disabled anyway, guard just in case
        if (readiness.warnings.length > 0) {
            setConfirmOpen(true);
        } else {
            runComplete();
        }
    };

    return (
        <Card className="rounded-xl border-slate-200 bg-white shadow-sm overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100">
                <div
                    className="h-full bg-brand-600 transition-all duration-500 ease-in-out"
                    style={{ width: `${progress.percent}%` }}
                />
            </div>

            <CardContent className="px-4 pt-4 pb-3 space-y-3">

                <ClinicalAlertBanner
                    criticalAlerts={patientSummary?.critical_alerts ?? []}
                    isLoading={isSummaryLoading}
                />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 min-w-0">
                        <div className="flex items-center gap-2">
                            <h1 className="text-sm font-bold text-slate-900 tracking-tight">Clinical Encounter</h1>
                            <Badge variant="outline" className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[encounter.status] ?? "bg-slate-100"}`}>
                                {encounter.status.replace("_", " ")}
                            </Badge>
                        </div>

                        <div className="hidden sm:block h-3.5 w-px bg-slate-200" />

                        {/* Timeline Data */}
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                            <span className="flex items-center gap-1">
                                <CalendarClock className="h-3.5 w-3.5 text-slate-400" />
                                {new Date(encounter.started_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                                {elapsed}
                            </span>
                        </div>

                        {/* Chief Complaint Inline */}
                        {encounter.chief_complaint && (
                            <>
                                <div className="hidden lg:block h-3.5 w-px bg-slate-200" />
                                <p className="text-xs text-slate-600 truncate max-w-xs lg:max-w-md">
                                    <span className="font-bold text-slate-400 uppercase text-[10px] mr-1">CC:</span>
                                    {encounter.chief_complaint}
                                </p>
                            </>
                        )}
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
                        <div className="flex items-center gap-1.5">
                            {vitals.map((v) => (
                                <div key={v.label} className="text-xs bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-md">
                                    <span className="text-slate-400 text-[10px] font-bold mr-1">{v.label}</span>
                                    <span className="font-semibold text-slate-700">{v.val}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap hidden xl:inline">
                                {progress.completed}/{progress.total} STAGES
                            </span>

                            {!isClosed && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            {/* span wrapper so the tooltip still fires on a disabled button */}
                                            <span>
                                                <Button
                                                    size="sm"
                                                    onClick={handleCompleteClick}
                                                    disabled={completeMutation.isPending || !readiness.canComplete}
                                                    className="rounded-lg h-8 px-3 text-xs font-semibold shadow-sm"
                                                >
                                                    {!readiness.canComplete && <AlertCircle className="mr-1.5 h-3.5 w-3.5" />}
                                                    {readiness.canComplete && <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />}
                                                    {completeMutation.isPending ? "Completing..." : "Complete Visit"}
                                                </Button>
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-56">
                                            {readiness.canComplete ? (
                                                "Completes appointment and closes encounter"
                                            ) : (
                                                <ul className="text-xs space-y-0.5 list-disc pl-3">
                                                    {readiness.blockingReasons.map((reason) => (
                                                        <li key={reason}>{reason}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>

            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Complete visit with incomplete documentation?</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-1.5">
                                <p>The diagnosis requirement is met, but the following weren't recorded:</p>
                                <ul className="text-xs list-disc pl-4 space-y-0.5">
                                    {readiness.warnings.map((w) => <li key={w}>{w}</li>)}
                                </ul>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Go back</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { setConfirmOpen(false); runComplete(); }}>
                            Complete Anyway
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}