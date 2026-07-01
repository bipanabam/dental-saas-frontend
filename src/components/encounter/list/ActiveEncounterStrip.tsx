"use client";

import Link from "next/link";

import {
    ArrowRight,
    Clock3,
    PlayCircle,
    Stethoscope,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import type { EncounterListItem } from "@/lib/api";

type Props = {
    encounters: EncounterListItem[];
    /** Tighter card, doctor name hidden -> use when the strip shares space with other panels (e.g. doctor's own view). */
    compact?: boolean;
};

function getElapsed(startedAt: string) {
    const diff = Date.now() - new Date(startedAt).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    return hrs > 0 ? `${hrs}h ${mins % 60}m` : `${mins}m`;
}

export default function ActiveEncounterStrip({
    encounters,
    compact = false,
}: Props) {
    if (!encounters?.length) {
        return null;
    }

    return (
        <section className={compact ? "" : "sticky top-4 z-20"}>

            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900">
                    Active Encounters
                </h2>

                <Badge
                    variant="outline"
                    className="rounded-full px-2.5 py-0.5 border-brand-200 bg-brand-50 text-brand-700 font-bold text-xs"
                >
                    {encounters.length}
                </Badge>
            </div>

            <div className={compact ? "grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3" : "grid gap-4 xl:grid-cols-2"}>

                {encounters.map((encounter) => {
                    const percent =
                        (encounter.completed_stages / encounter.total_stages!) * 100;

                    return (
                        <Card
                            key={encounter.id}
                            className="group rounded-xl border border-brand-100 bg-linear-to-br from-brand-50/60 to-white shadow-xs hover:shadow-md transition-all"
                        >
                            <CardContent className={compact ? "p-3.5" : "p-5"}>

                                <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0 flex-1 flex items-center gap-2.5">
                                        <div className={`rounded-lg bg-brand-100 flex items-center justify-center shrink-0 ${compact ? "h-8 w-8" : "h-10 w-10"}`}>
                                            <Stethoscope className={compact ? "h-4 w-4 text-brand-700" : "h-5 w-5 text-brand-700"} />
                                        </div>

                                        <div className="min-w-0">
                                            <div className={`font-semibold truncate ${compact ? "text-sm" : ""}`}>
                                                {encounter.patient_name}
                                            </div>
                                            <div className="text-xs text-slate-500 truncate">
                                                {compact
                                                    ? (encounter.chief_complaint || "No complaint recorded")
                                                    : encounter.doctor_name}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <div className="flex items-center justify-end gap-1 text-xs text-slate-500">
                                            <Clock3 className="h-3 w-3" />
                                            {getElapsed(encounter.started_at)}
                                        </div>
                                    </div>
                                </div>

                                {!compact && (
                                    <div className="mt-4">
                                        <div className="text-[10px] uppercase font-bold text-slate-400">
                                            Complaint
                                        </div>
                                        <p className="text-sm text-slate-700 truncate">
                                            {encounter.chief_complaint || "No complaint recorded"}
                                        </p>
                                    </div>
                                )}

                                <div className={compact ? "mt-3" : "mt-5"}>
                                    <div className="mb-1.5 flex justify-between text-xs">
                                        <span className="text-slate-500">
                                            {compact ? "Progress" : "Encounter Progress"}
                                        </span>
                                        <span className="font-bold text-brand-700">
                                            {encounter.completed_stages}/{encounter.total_stages}
                                        </span>
                                    </div>
                                    <Progress value={percent} className={compact ? "h-1.5" : "h-2"} />
                                </div>

                                <div className={`flex items-center justify-between ${compact ? "mt-3" : "mt-5"}`}>
                                    {!compact && (
                                        <div className="text-xs text-slate-500">
                                            Updated{" "}
                                            {new Date(encounter.updated_at).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                    )}

                                    <Button
                                        asChild
                                        size={compact ? "sm" : "default"}
                                        className={`rounded-lg gap-1.5 ${compact ? "w-full" : ""}`}
                                    >
                                        <Link href={`/appointments/${encounter.appointment_id}/encounter`}>
                                            <PlayCircle className="h-3.5 w-3.5" />
                                            Resume
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </Button>
                                </div>

                            </CardContent>
                        </Card>
                    );
                })}

            </div>
        </section>
    );
}