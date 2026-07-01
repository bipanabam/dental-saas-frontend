"use client";

import { useMemo } from "react";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ENCOUNTER_STAGES, isStageComplete, type EncounterStage } from "@/lib/utils/encounter-stages";
import type { EncounterDetail } from "@/lib/api";

type Props = {
    encounter: EncounterDetail;
    stage: EncounterStage;
    onStageChange: (stage: EncounterStage) => void;
};

const EncounterStageSidebar = ({ encounter, stage, onStageChange }: Props) => {
    // First stage in declared order that isn't complete yet -> the natural
    // "keep going" suggestion for doctors following the sidebar top-to-bottom.
    const nextStageId = useMemo(() => {
        const firstIncomplete = ENCOUNTER_STAGES.find((s) => !isStageComplete(s.id, encounter));
        return firstIncomplete?.id;
    }, [encounter]);

    return (
        <Card className="rounded-xl border-slate-200 bg-white shadow-sm h-fit p-1.5">
            <div className="px-2.5 py-1.5 mb-1">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                    Encounter Workflow
                </span>
            </div>
            <ScrollArea className="max-h-[70vh]">
                <div className="space-y-0.5 relative">
                    <div className="absolute left-4 top-3 bottom-3 w-px bg-slate-100 pointer-events-none" />

                    {ENCOUNTER_STAGES.map((s) => {
                        const done = isStageComplete(s.id, encounter);
                        const active = stage === s.id;
                        const isUpNext = !active && !done && s.id === nextStageId;

                        return (
                            <Button
                                key={s.id}
                                variant="ghost"
                                onClick={() => onStageChange(s.id)}
                                className={cn(
                                    "w-full justify-start gap-3 h-9 rounded-lg text-xs font-medium transition-all relative z-10",
                                    active
                                        ? "bg-tertiary text-white shadow-sm hover:bg-tertiary/90 hover:text-white"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                                    isUpNext && "ring-1 ring-brand-200 bg-brand-50/50",
                                )}
                            >
                                <span
                                    className={cn(
                                        "h-4 w-4 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                                        done
                                            ? "bg-slate-100 border-slate-300 text-slate-600"
                                            : active
                                                ? "bg-white border-white text-slate-900"
                                                : isUpNext
                                                    ? "bg-white border-brand-400"
                                                    : "bg-white border-slate-200 text-transparent"
                                    )}
                                >
                                    {done ? (
                                        <Check className="h-2.5 w-2.5 stroke-3 text-tertiary/90" />
                                    ) : (
                                        <span className={cn(
                                            "h-1.5 w-1.5 rounded-full",
                                            active ? "bg-tertiary/90" : isUpNext ? "bg-brand-500" : "bg-slate-300",
                                        )} />
                                    )}
                                </span>

                                <span className={cn("truncate flex-1 text-left", active ? "font-semibold" : "font-medium")}>
                                    {s.label}
                                </span>

                                {isUpNext && (
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-brand-600 shrink-0">
                                        Next
                                    </span>
                                )}
                            </Button>
                        );
                    })}
                </div>
            </ScrollArea>
        </Card>
    );
};

export default EncounterStageSidebar;