"use client";

import { useRouter } from "next/navigation";

import { Printer, FileDown, RotateCcw, FileText } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { StatusBadge } from "./badges";
import { fmtDuration, fmtMoney } from "./utils";

import type { EncounterDetail } from "@/lib/api";

type Props = {
  encounter: EncounterDetail;

  onPrint?: () => void;
  onExportPdf?: () => void;
  onReopen?: () => void;
};

function SidebarBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-slate-100 px-5 py-5 last:border-0">
      <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
        {title}
      </p>

      {children}
    </section>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-brand-600 transition-all"
        style={{
          width: `${value}%`,
        }}
      />
    </div>
  );
}

export default function SideSummary({
  encounter,
  onPrint,
  onExportPdf,
  onReopen,
}: Props) {
  const router = useRouter();
  const isClosed =
    encounter.status?.toLowerCase() === "closed" ||
    encounter.status?.toLowerCase() === "completed";

  const procedures = encounter.procedures ?? [];
  const planItems = encounter.treatment_plan?.items ?? [];

  const files =
    encounter.investigations?.filter((i) => !!i.result_file_url) ?? [];

  const billed = procedures.reduce((s, p) => s + (p.final_cost ?? 0), 0);
  const planned = encounter.treatment_plan?.estimated_total_cost ?? 0;

  // Procedure completion
  const completedProcedures = procedures.filter(
    (p) => p.status === "COMPLETED",
  ).length;

  const procedureProgress = procedures.length
    ? (completedProcedures / procedures.length) * 100
    : 0;

  // Treatment plan completion
  const completedPlan = planItems.filter((item) =>
    procedures.some((p) => p.id === item.performed_procedure_id),
  ).length;

  const treatmentProgress = planItems.length
    ? (completedPlan / planItems.length) * 100
    : 0;

  return (
    <Card className="sticky top-6 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      <CardContent className="p-0">
        {/* SUMMARY */}
        <SidebarBlock title="Encounter Summary">
          <div className="space-y-3">
            <Row
              label="Status"
              value={<StatusBadge status={encounter.status} />}
            />

            <Row
              label="Started"
              value={new Date(encounter.started_at).toLocaleString()}
            />

            <Row
              label="Duration"
              value={fmtDuration(encounter.started_at, encounter.closed_at)}
            />

            <Row label="Planned" value={fmtMoney(planned)} />

            <Row label="Billed" value={fmtMoney(billed)} strong />
          </div>
        </SidebarBlock>

        {/* CARE PROGRESS */}

        <SidebarBlock title="Care Progress">
          <div className="space-y-5">
            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-xs text-slate-500">Procedures</span>

                <span className="text-sm font-bold">
                  {completedProcedures}/{procedures.length}
                </span>
              </div>

              <ProgressBar value={procedureProgress} />

              <p className="mt-2 text-xs text-slate-400">
                Actual clinical work completed
              </p>
            </div>

            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-xs text-slate-500">Treatment Plan</span>

                <span className="text-sm font-bold">
                  {completedPlan}/{planItems.length}
                </span>
              </div>

              <ProgressBar value={treatmentProgress} />

              <p className="mt-2 text-xs text-slate-400">
                Planned items linked to performed procedures
              </p>
            </div>
          </div>
        </SidebarBlock>

        {/* REPORTS */}
        {files.length > 0 && (
          <SidebarBlock title="Attached Reports">
            <div className="space-y-2">
              {files.map((file) => (
                <a
                  key={file.id}
                  href={file.result_file_url as string}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-brand-700"
                >
                  <FileText className="h-4 w-4 shrink-0" />

                  <span className="truncate">{file.investigation_name}</span>
                </a>
              ))}
            </div>
          </SidebarBlock>
        )}

        {/* ACTIONS */}

        <SidebarBlock title="Actions">
          <div className="space-y-2">
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
              onClick={onPrint}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start"
              onClick={onExportPdf}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Export PDF
            </Button>

            {isClosed && (
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start text-amber-700"
                onClick={() =>
                    router.push(`/appointments/${encounter.appointment_id}/encounter`)
                }
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reopen
              </Button>
            )}
          </div>
        </SidebarBlock>
      </CardContent>
    </Card>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-xs text-slate-500">{label}</span>

      <span
        className={`text-right text-sm ${strong ? "font-bold" : "font-medium"}`}
      >
        {value}
      </span>
    </div>
  );
}
