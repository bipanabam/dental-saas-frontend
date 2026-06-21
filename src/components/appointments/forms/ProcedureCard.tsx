"use client";

import { Controller, UseFormSetValue, useWatch } from "react-hook-form";
import {
  Trash2,
  DollarSign,
  Clock,
  ClipboardList,
  Stethoscope,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ToothSelector from "./ToothSelector";

import ProcedureCatalogSelect from "../ProcedureCatalogSelect";

import type {
  AppointmentFormInput,
} from "@/lib/schemas/appointment";


type Props = {
  index: number;
  control: any;

  remove: (
    index: number
  ) => void;

  setValue:
  UseFormSetValue<
    AppointmentFormInput
  >;
};


export default function ProcedureCard({
  index,
  control,
  remove,
  setValue,
}: Props){

  const allProcedures = useWatch({ control, name: "procedures" }); // needs `useWatch` import

  // const teethUsedElsewhere = (allProcedures ?? [])
  //   .filter((_, i) => i !== index)
  //   .flatMap((p) => p?.tooth_numbers ?? []);

  return (
    <div className="border border-slate-200 bg-white rounded-2xl p-5 shadow-sm space-y-4 transition-all hover:border-slate-300 relative group">
      {/* CARD HEADER SECTION */}
      <div className="flex items-center justify-between border-b border-slate-50 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-brand-50 flex items-center justify-center text-brand-700">
            <Stethoscope className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-slate-700">
            Procedure #{index + 1}
          </span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => remove(index)}
          className="h-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg gap-1.5 px-2.5 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="text-xs font-bold">Remove</span>
        </Button>
      </div>

      {/* FIELD ROW 1: CATALOG INTERSECTION */}
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-slate-600">
          Select Treatment / Procedure
        </Label>
        <Controller
          control={control}
          name={`procedures.${index}.procedure_catalog_id`}
          render={({ field }) => (
            <ProcedureCatalogSelect
              value={
                field.value
              }
              onChange={(
                procedure
              ) => {

                field.onChange(
                  procedure.id
                );

                setValue(
                  `procedures.${index}.estimated_cost`,
                  procedure.default_cost ??
                  null,

                  {
                    shouldDirty:
                      true,
                  }
                );

                setValue(
                  `procedures.${index}.estimated_duration_minutes`,
                  procedure.default_duration_minutes ??
                  0
                );

                setValue(
                  `procedures.${index}.notes`,
                  procedure.description ??
                  ""
                );
              }}
            />
          )}
        />
      </div>

      {/* FIELD ROW 2: ANATOMICAL TEETH MAPPING LAYOUT */}
      <div className="space-y-2 bg-slate-50/40 border border-slate-100/80 rounded-xl p-4">
        <div>
          <Label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
            Anatomical Tooth Selector
          </Label>
          <span className="text-[11px] font-medium text-slate-400 block mt-0.5">
            Select affected teeth on the dental arch map below.
          </span>
        </div>
        <Controller
          control={control}
          name={`procedures.${index}.tooth_numbers`}
          render={({ field }) => (
            <ToothSelector
              value={field.value ?? []}
              mode="multiple"
              // disabled={teethUsedElsewhere}  // prevents re-selecting a tooth claimed by another procedure
              highlights={{
                completed: [],
                active: [],
                planned: field.value ?? [],
              }}
              onChange={(v) => {
                field.onChange(v);
              }}
            />
          )}
        />
      </div>

      {/* FIELD ROW 3: ESTIMATED METRICS GROUPING */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-600">
            Estimated Cost (Rs)
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Controller
              control={control}
              name={`procedures.${index}.estimated_cost`}
              render={({ field }) => (
                <Input
                  type="number"
                  placeholder="30"
                  className="pl-9 text-sm font-semibold border-slate-200 focus-visible:ring-brand-500 h-10"
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-600">
            Duration (Minutes)
          </Label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Controller
              control={control}
              name={`procedures.${index}.estimated_duration_minutes`}
              render={({ field }) => (
                <Input
                  type="number"
                  placeholder="0.00"
                  className="pl-9 text-sm font-semibold border-slate-200 focus-visible:ring-brand-500 h-10"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(e.target.value === "" ? null : Number(e.target.value))
                  }
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* FIELD ROW 4: OPERATIONAL CLINICAL NOTES */}
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-slate-600 flex items-center gap-1">
          <ClipboardList className="h-3.5 w-3.5 text-slate-400" />
          Clinical Treatment Notes
        </Label>
        <Controller
          control={control}
          name={`procedures.${index}.notes`}
          render={({ field }) => (
            <Textarea
              placeholder="Specify initial surface notes (e.g., MO, DO cavity), anesthesia details, or clinical materials used..."
              rows={2}
              className="text-xs font-medium border-slate-200 focus-visible:ring-brand-500 resize-none min-h-16"
              {...field}
            />
          )}
        />
      </div>
    </div>
  );
}
