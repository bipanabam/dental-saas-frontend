import Link from "next/link";

import {
  ClipboardList,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { TreatmentPlanItemStatusEnum } from "@/lib/api";

const statusColor: any = {
  DONE: "bg-emerald-50 text-emerald-700",
  DEFERRED: "bg-amber-50 text-amber-700",
  PLANNED: "bg-brand-50 text-brand-700",
};

function getEncounterState(encounter: any) {
  const hasDiagnosis = !!encounter.diagnosis?.trim();

  const hasTreatments = !!encounter.treatment_items?.length;

  if (hasDiagnosis && hasTreatments) {
    return {
      label: "Recorded",
      className: "bg-emerald-50 text-emerald-700",
    };
  }

  if (hasDiagnosis) {
    return {
      label: "Diagnosis Added",
      className: "bg-blue-50 text-blue-700",
    };
  }

  if (hasTreatments) {
    return {
      label: "Treatment Planned",
      className: "bg-amber-50 text-amber-700",
    };
  }

  return {
    label: "Pending",
    className: "bg-slate-100 text-slate-600",
  };
}

const RecentEncountersCard = ({ encounters = [] }: any) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-brand-700" />
          Recent Encounters
        </CardTitle>
      </CardHeader>

      <CardContent>
        {!encounters.length && (
          <p className="text-sm text-muted-foreground">No encounter history</p>
        )}

        <div className="space-y-4">
          {encounters.map((encounter: any) => {
            const state = getEncounterState(encounter);
            return (
              <Link
                key={encounter.id}
                href={`/encounters/${encounter.id}`}
                className="block rounded-2xl border p-4 hover:border-brand-200"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">
                        {encounter.diagnosis || "Encounter in progress"}
                      </p>

                      <Badge className={state.className}>{state.label}</Badge>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {new Date(encounter.encounter_date).toLocaleDateString()}
                    </p>
                  </div>

                  <ArrowUpRight className="h-4 w-4" />
                </div>

                {encounter.treatment_items?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {encounter.treatment_items.slice(0, 3).map((item: any) => (
                      <Badge
                        key={`${item.procedure_name}-${item.visit_number}`}
                        className={
                          statusColor[
                            item.status as TreatmentPlanItemStatusEnum
                          ] ?? "bg-slate-50"
                        }
                      >
                        {item.procedure_name}
                        {" • V"}
                        {item.visit_number}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-muted-foreground">
                    No procedures recorded yet
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentEncountersCard;
