"use client";

import { useRouter } from "next/navigation";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
    Stethoscope,
    ArrowRight,
    Activity,
    Clock3,
} from "lucide-react";

import { Progress } from "@/components/ui/progress";
import EncounterFilters from "./EncountersFilter";
import { SectionLoader } from "@/components/base/loading-view";

import type {
    EncounterListItem,
    EncounterStatusEnum
} from "@/lib/api";

type Props = {
    encounters?: EncounterListItem[];
    total?: number;
    activeCount?: number;
    isLoading?: boolean;
    isFetching?: boolean;
    filters: {
        status?: EncounterStatusEnum;
        doctor_id?: string;
        patient_id?: string;
        today?: boolean;
    };
    onFiltersChange: (value: any) => void;
};

const STATUS_STYLES = {
    IN_PROGRESS:
        "bg-brand-50 text-brand-700 border-brand-200",

    CLOSED:
        "bg-emerald-50 text-emerald-700 border-emerald-200",

    VOID:
        "bg-slate-100 text-slate-500 border-slate-200",
};

const EncounterHistoryTable = ({
    encounters,
    total,
    activeCount,
    isLoading,
    isFetching,
    filters,
    onFiltersChange
}: Props) => {
    const router = useRouter();
    const rows = encounters ?? [];

    if (isFetching) {
        return <SectionLoader message="Filtering data..." />;
    }

    return (
        <>
        <EncounterFilters
            filters={filters}
            onChange={onFiltersChange}
        />
        <Card className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-0">

            {/* Header */}
            <CardHeader className="p-5 border-b bg-linear-to-r from-brand-50/40 to-transparent">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-brand-100 flex items-center justify-center">
                            <Stethoscope className="h-5 w-5 text-brand-700" />
                        </div>

                        <div>
                            <CardTitle>
                                Encounter History
                            </CardTitle>

                            <CardDescription>
                                Resume active encounters or review previous visits
                            </CardDescription>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-2xl font-black text-brand-700">
                            {total ?? rows.length}
                        </div>

                        <div className="text-[10px] uppercase text-slate-400 font-bold">
                            Encounters
                        </div>
                    </div>
                </div>

            </CardHeader>

            <CardContent className="p-0">

                <div className="max-h-162.5 overflow-auto">

                    <Table>
                        <TableHeader className="sticky top-0 bg-slate-50 z-20">

                            <TableRow>
                                <TableHead>Patient</TableHead>
                                <TableHead>Complaint</TableHead>
                                <TableHead>Progress</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Started</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>

                        </TableHeader>

                        <TableBody>

                            {isLoading && (
                                <TableRow>

                                    <TableCell
                                        colSpan={6}
                                        className="h-56 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <Activity
                                                className="h-8 w-8 animate-pulse text-brand-600"
                                            />
                                            <div className="text-sm text-slate-500">
                                                Loading encounters...
                                            </div>
                                        </div>

                                    </TableCell>
                                </TableRow>
                            )}

                            {!isLoading &&
                                rows.length === 0 && (
                                    <TableRow>

                                        <TableCell
                                            colSpan={6}
                                            className="h-48 text-center text-slate-400"
                                        >
                                            No encounters found
                                        </TableCell>

                                    </TableRow>
                                )}

                            {rows.map((encounter) => {
                                const progress = encounter.completed_stages / encounter.total_stages!;

                                const active =
                                    encounter.status === "IN_PROGRESS";

                                return (
                                    <TableRow
                                        key={encounter.id}
                                        className={`group hover:bg-slate-50 ${active ? "bg-brand-50/30" : ""}`}
                                    >

                                        <TableCell>
                                            <div>
                                                <div className="font-semibold">
                                                    {encounter.patient_name}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {encounter.doctor_name}
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>

                                            <div className="max-w-52 truncate text-sm">
                                                {encounter.chief_complaint || "No complaint"}
                                            </div>

                                        </TableCell>

                                        <TableCell className="w-56">

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs">
                                                    <span>
                                                        { encounter.completed_stages }/{encounter.total_stages}
                                                    </span>
                                                    <span>
                                                        {Math.round(progress * 100)}%
                                                    </span>
                                                </div>

                                                <Progress value={progress * 100}
                                                />
                                            </div>

                                        </TableCell>

                                        <TableCell>

                                            <Badge
                                                variant="outline"
                                                className={STATUS_STYLES[encounter.status]}
                                            >
                                                {encounter.status}
                                            </Badge>

                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                                                {new Date(encounter.started_at).toLocaleString()}
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                variant={active ? "default" : "outline"}
                                                className="rounded-xl"
                                                onClick={() =>
                                                    router.push(`/appointments/${encounter.appointment_id}/encounter`)
                                                }
                                            >
                                                {active ? "Resume" : "Open"}
                                                <ArrowRight className="h-4 w-4" />
                                            </Button>
                                        </TableCell>

                                    </TableRow>
                                );
                            })}

                        </TableBody>

                    </Table>

                </div>

            </CardContent>

            {/* Footer */}

            <div className="border-t px-5 py-3 bg-slate-50 flex gap-6">

                <div className="text-xs">

                    Active:
                    <span className="ml-2 font-bold text-brand-700">
                        {activeCount ?? rows.filter(i => i.status === "IN_PROGRESS").length}
                    </span>

                </div>

                <div className="text-xs">

                    Closed:
                    <span className="ml-2 font-bold text-emerald-700">

                        {
                            rows.filter(
                                (i) =>
                                    i.status ===
                                    "CLOSED"
                            ).length
                        }

                    </span>

                </div>

            </div>

        </Card>
        </>
    );
};

export default EncounterHistoryTable;