"use client";

import Link from "next/link";
import { FlaskConical, Clock3, ArrowRight, Inbox } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionLoader } from "@/components/base/loading-view";

import { useMyClinicalInbox } from "@/hooks/encounter/use-doctor-encounters";

export default function ClinicalInboxPanel() {
    const { data, isLoading } = useMyClinicalInbox(true);

    const investigations = data?.pending_investigations ?? [];
    const deferred = data?.deferred_treatment_items ?? [];
    const total = investigations.length + deferred.length;

    if (isLoading) {
        return <SectionLoader message="Loading clinical inbox..." />;
    }

    if (total === 0) {
        return null; // nothing pending -> don't take up space
    }

    return (
        <Card className="rounded-2xl border border-amber-100 bg-amber-50/40 shadow-xs">
            <CardContent className="p-5">

                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-xl bg-amber-100 flex items-center justify-center">
                            <Inbox className="h-4.5 w-4.5 text-amber-700" />
                        </div>
                        <div>
                            <div className="font-bold text-slate-900 text-sm">
                                Clinical Inbox
                            </div>
                            <div className="text-xs text-slate-500">
                                Needs your follow-up today
                            </div>
                        </div>
                    </div>

                    <Badge
                        variant="outline"
                        className="rounded-full px-3 py-1 border-amber-200 bg-amber-100 text-amber-800 font-bold"
                    >
                        {total}
                    </Badge>
                </div>

                <div className="space-y-2">

                    {investigations.map((item) => (
                        <Link
                            key={item.id}
                            href={`/encounters/${item.encounter_id}`}
                            className="group flex items-center justify-between rounded-xl border border-slate-100 bg-white px-3 py-2.5 hover:border-brand-200 hover:bg-brand-50/40 transition-colors"
                        >
                            <div className="flex items-center gap-2.5 min-w-0">
                                <FlaskConical className="h-4 w-4 text-slate-400 shrink-0" />
                                <div className="min-w-0">
                                    <div className="text-sm font-semibold truncate">
                                        {item.investigation_name}
                                    </div>
                                    <div className="text-xs text-slate-500 truncate">
                                        {item.patient_name}
                                    </div>
                                </div>
                            </div>
                            <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-brand-600 shrink-0" />
                        </Link>
                    ))}

                    {deferred.map((item) => (
                        <Link
                            key={item.id}
                            href={`/encounters/${item.encounter_id}`}
                            className="group flex items-center justify-between rounded-xl border border-slate-100 bg-white px-3 py-2.5 hover:border-brand-200 hover:bg-brand-50/40 transition-colors"
                        >
                            <div className="flex items-center gap-2.5 min-w-0">
                                <Clock3 className="h-4 w-4 text-slate-400 shrink-0" />
                                <div className="min-w-0">
                                    <div className="text-sm font-semibold truncate">
                                        {item.procedure_name ?? "Deferred procedure"}
                                    </div>
                                    <div className="text-xs text-slate-500 truncate">
                                        {item.patient_name}
                                        {item.tooth_numbers?.length
                                            ? ` · Tooth ${item.tooth_numbers.join(", ")}`
                                            : ""}
                                    </div>
                                </div>
                            </div>
                            <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-brand-600 shrink-0" />
                        </Link>
                    ))}

                </div>

            </CardContent>
        </Card>
    );
}