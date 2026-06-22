"use client";

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
    return (
        <Card className="rounded-2xl border-slate-200 shadow-sm h-fit sticky top-6 p-2">
            <ScrollArea className="max-h-[70vh]">
                <div className="space-y-1">
                    {ENCOUNTER_STAGES.map((s) => {
                        const done = isStageComplete(s.id, encounter);
                        const active = stage === s.id;

                        return (
                            <Button
                                key={s.id}
                                variant="ghost"
                                onClick={() => onStageChange(s.id)}
                                className={cn(
                                    "w-full justify-start gap-2.5 h-10 rounded-xl text-sm font-semibold",
                                    active
                                        ? "bg-brand-50 text-brand-700 hover:bg-brand-50"
                                        : "text-slate-600 hover:bg-slate-50"
                                )}
                            >
                                <span
                                    className={cn(
                                        "h-4 w-4 rounded-full border flex items-center justify-center shrink-0 text-[10px]",
                                        done
                                            ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                                            : active
                                                ? "bg-brand-600 border-brand-600 text-white"
                                                : "bg-white border-slate-300 text-slate-400"
                                    )}
                                >
                                    {done ? <Check className="h-3 w-3" /> : ""}
                                </span>
                                {s.label}
                            </Button>
                        );
                    })}
                </div>
            </ScrollArea>
        </Card>
    );
}

export default EncounterStageSidebar;