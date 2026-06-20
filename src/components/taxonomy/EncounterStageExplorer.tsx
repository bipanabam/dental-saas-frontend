"use client";

import { Card } from "@/components/ui/card";

import { encounterStages } from "./taxonomy-flow";
import { SeverityGroups, FieldGroups, GroupedChips } from "./EncounterStagesView";

type Props = {
  selected: string;
  taxonomy: any;
};

export default function EncounterStageExplorer({ selected, taxonomy }: Props) {
  const stage = encounterStages.find((s) => s.id === selected)!;

  const Icon = stage.icon;

  const raw = taxonomy?.[stage.dataKey];

  return (
    <Card className="rounded-3xl p-6">
      <div className="flex justify-between">
        <div className=" flex gap-3">
          <div className="h-11 w-11 rounded-2xl bg-brand-50 flex items-center justify-center">
            <Icon className="h-5 w-5 text-brand-700" />
          </div>

          <div>
            <div className="text-[10px] uppercase text-slate-400 font-black">
              {stage.role}
            </div>

            <h2 className="text-xl font-black">{stage.title}</h2>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-400">{stage.description}</p>

      <div className="mt-6 max-h-96 overflow-auto">
        {stage.kind === "severity" ? (
          <SeverityGroups data={raw} />
        ) : stage.kind === "field" ? (
          <FieldGroups data={raw} />
        ) : (
          <GroupedChips data={raw} />
        )}
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-4">
        <div className="text-xs uppercase font-black text-slate-500">
          Feeds Into
        </div>

        <p className="mt-2 text-sm">{stage.feedsInto}</p>
      </div>
    </Card>
  );
}
