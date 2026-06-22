import type { EncounterDetail } from "@/lib/api";

export type EncounterStage =
  | "intake"
  | "history"
  | "exam"
  | "findings"
  | "diagnosis"
  | "investigation"
  | "treatment";

export const ENCOUNTER_STAGES: { id: EncounterStage; label: string }[] = [
  { id: "intake", label: "Intake" },
  { id: "history", label: "Medical History" },
  { id: "exam", label: "Examination" },
  { id: "findings", label: "Findings" },
  { id: "diagnosis", label: "Diagnosis" },
  { id: "investigation", label: "Investigation" },
  { id: "treatment", label: "Treatment" },
];

// Returns true if the stage has *any* recorded data — used to render the
// checkmark in the sidebar. Not a strict "required field" validation.
export function isStageComplete(
  stage: EncounterStage,
  encounter: EncounterDetail
): boolean {
  switch (stage) {
    case "intake":
      return (
        encounter.bp_systolic != null &&
        encounter.bp_diastolic != null
      );

    case "history":
      return Boolean(encounter.medical_history);

    case "exam":
      return (encounter.examination_findings?.length ?? 0) > 0;

    case "findings":
      return (encounter.clinical_findings?.length ?? 0) > 0;

    case "diagnosis":
      return (encounter.diagnoses?.length ?? 0) > 0;

    case "investigation":
      return (encounter.investigations?.length ?? 0) > 0;

    case "treatment":
      return (encounter.treatment_plan?.items?.length ?? 0) > 0;
  }
}
