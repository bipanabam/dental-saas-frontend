"use client";

import { useEffect, useState } from "react";
import { Pause, Save, CheckCircle2, Activity, Thermometer, HeartPulse } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useCompleteAppointment } from "@/hooks/appointments/use-appointment-workflow";

import type { EncounterDetail } from "@/lib/api";

type Props = {
    encounter: EncounterDetail;
    onPause?: () => void;
    onSave?: () => void;
};

function useElapsed(startedAt: string) {
    const [elapsed, setElapsed] = useState("");

    useEffect(() => {
        const start = new Date(startedAt).getTime();

        const tick = () => {
            const diffMs = Date.now() - start;
            const mins = Math.floor(diffMs / 60000);
            const hrs = Math.floor(mins / 60);
            setElapsed(hrs > 0 ? `${hrs}h ${mins % 60}m` : `${mins}m`);
        };

        tick();
        const interval = setInterval(tick, 30_000);
        return () => clearInterval(interval);
    }, [startedAt]);

    return elapsed;
}

const STATUS_STYLES: Record<string, string> = {
    IN_PROGRESS: "bg-indigo-50 text-indigo-700 border-indigo-200",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    PAUSED: "bg-amber-50 text-amber-700 border-amber-200",
};

const EncounterHeader = ({
    encounter,
    onPause,
    onSave,
}: Props) => {
    const elapsed = useElapsed(encounter.started_at);
    const isClosed = Boolean(encounter.closed_at);
    const completeMutation = useCompleteAppointment();

    const vitals = [
        {
            icon: HeartPulse,
            label: "BP",
            value:
                encounter.bp_systolic != null && encounter.bp_diastolic != null
                    ? `${encounter.bp_systolic}/${encounter.bp_diastolic}`
                    : "—",
        },
        {
            icon: Activity,
            label: "Pulse",
            value: encounter.pulse_rate != null ? `${encounter.pulse_rate} bpm` : "—",
        },
        {
            icon: Thermometer,
            label: "Temp",
            value: encounter.temperature != null ? `${encounter.temperature}°F` : "—",
        },
    ];


    const handleCompleteAppointment = async () => { 
        await completeMutation.mutateAsync(encounter.appointment_id)
    }
    return (
        <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-5 flex flex-wrap items-center justify-between gap-4">
                {/* Patient + complaint */}
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg font-bold text-slate-900 truncate">
                            Encounter
                        </h1>
                        <Badge
                            variant="outline"
                            className={`text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_STYLES[encounter.status] ?? "bg-slate-50 text-slate-600 border-slate-200"
                                }`}
                        >
                            {encounter.status.replace("_", " ")}
                        </Badge>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5 truncate max-w-md">
                        {encounter.chief_complaint || "No chief complaint recorded"}
                    </p>
                </div>

                {/* Vitals strip */}
                <div className="flex items-center gap-4">
                    {vitals.map((v) => (
                        <div key={v.label} className="text-center min-w-14">
                            <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-400 uppercase">
                                <v.icon className="h-3 w-3" />
                                {v.label}
                            </div>
                            <div className="text-sm font-bold text-slate-800">{v.value}</div>
                        </div>
                    ))}
                </div>

                {/* Timer */}
                <div className="text-center">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase">
                        {isClosed ? "Duration" : "Elapsed"}
                    </div>
                    <div className="text-sm font-bold text-slate-800">
                        {isClosed
                            ? `${Math.round(
                                (new Date(encounter.closed_at!).getTime() -
                                    new Date(encounter.started_at).getTime()) /
                                60000
                            )}m`
                            : elapsed}
                    </div>
                </div>

                {/* Quick actions */}
                {!isClosed && (
                    <div className="flex items-center gap-2">
                        {/* <Button variant="outline" size="sm" className="rounded-xl" onClick={onPause}>
                            <Pause className="h-4 w-4" />
                            Pause
                        </Button> */}
                        {/* <Button variant="outline" size="sm" className="rounded-xl" onClick={onSave}>
                            <Save className="h-4 w-4" />
                            Save
                        </Button> */}
                        <Button
                            size="sm"
                            className="rounded-xl bg-brand-600"
                            onClick={handleCompleteAppointment}
                            disabled={completeMutation.isPending}
                            aria-description="Complete appointment and close encounter."
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            {completeMutation.isPending ? "Completing..." : "Complete"}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default EncounterHeader;