"use client";

import Link from "next/link";

import {
    ArrowRight,
    Clock3,
    PlayCircle,
    Stethoscope,
} from "lucide-react";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { Progress } from "@/components/ui/progress";

import type { EncounterListItem } from "@/lib/api";

type Props = {
    encounters: EncounterListItem[];
};

function getElapsed(startedAt: string) {
    const diff =
        Date.now() -
        new Date(startedAt).getTime();

    const mins = Math.floor(
        diff / 60000
    );

    const hrs = Math.floor(
        mins / 60
    );

    if (hrs > 0) {
        return `${hrs}h ${mins % 60}m`;
    }

    return `${mins}m`;
}

export default function ActiveEncounterStrip({
    encounters,
}: Props) {
    if (!encounters?.length) {
        return null;
    }

    return (
        <section className="sticky top-4 z-20">

            {/* Header */}

            <div className="mb-4 flex items-center justify-between">

                <div>
                    <h2 className="text-lg font-bold text-slate-900">
                        Active Encounters
                    </h2>

                    <p className="text-sm text-slate-500">
                        Resume ongoing clinical work
                    </p>
                </div>

                <Badge
                    variant="outline"
                    className="rounded-full px-3 py-1 border-brand-200 bg-brand-50 text-brand-700 font-bold"
                >
                    {encounters.length} Active
                </Badge>

            </div>

            {/* Cards */}
            <div className="grid gap-4 xl:grid-cols-2">

                {encounters.map((encounter) => {
                    const percent =
                        (encounter.completed_stages / encounter.total_stages!) * 100;

                    return (
                        <Card
                            key={encounter.id}
                            className="group rounded-2xl border border-brand-100 bg-linear-to-br from-brand-50/60 to-white shadow-xs hover:shadow-md transition-all"
                        >
                            <CardContent className="p-5">

                                {/* Top */}
                                <div className="flex justify-between gap-5">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <div className="h-10 w-10 rounded-xl bg-brand-100 flex items-center justify-center">
                                                <Stethoscope className="h-5 w-5 text-brand-700" />
                                            </div>

                                            <div className="min-w-0">
                                                <div className="font-semibold truncate">
                                                    {encounter.patient_name}
                                                </div>

                                                <div className="text-xs text-slate-500">
                                                    {encounter.doctor_name}
                                                </div>
                                            </div>

                                        </div>

                                        <div className="mt-4">
                                            <div className="text-[10px] uppercase font-bold text-slate-400">
                                                Complaint
                                            </div>

                                            <p className="text-sm text-slate-700 truncate">
                                                {  encounter.chief_complaint || "No complaint recorded" }
                                            </p>

                                        </div>

                                    </div>

                                    <div className="text-right">

                                        <Badge
                                            className="rounded-full bg-emerald-50 text-emerald-700"
                                        >
                                            In Progress
                                        </Badge>

                                        <div className="mt-3 flex items-center justify-end gap-1 text-xs text-slate-500">
                                            <Clock3 className="h-3.5 w-3.5" />
                                            { getElapsed(encounter.started_at) }
                                        </div>
                                    </div>

                                </div>

                                {/* Progress */}
                                <div className="mt-5">

                                    <div className="mb-2 flex justify-between text-xs">
                                        <span className="text-slate-500">
                                            Encounter Progress
                                        </span>

                                        <span className="font-bold text-brand-700">
                                            {encounter.completed_stages}/
                                            {encounter.total_stages}
                                        </span>

                                    </div>

                                    <Progress
                                        value={percent}
                                        className="h-2"
                                    />

                                </div>

                                {/* Footer */}
                                <div className="mt-5 flex items-center justify-between">
                                    <div className="text-xs text-slate-500">
                                        Updated{" "}
                                        {new Date(
                                            encounter.updated_at
                                        ).toLocaleTimeString(
                                            [],
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )}
                                    </div>

                                    <Button
                                        asChild
                                        className="rounded-xl gap-2"
                                    >
                                        <Link
                                            href={`/appointments/${encounter.appointment_id}/encounter`}
                                        >
                                            <PlayCircle className="h-4 w-4" />
                                            Resume
                                            <ArrowRight className="h-4 w-4" />
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