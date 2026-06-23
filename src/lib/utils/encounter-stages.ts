import type { EncounterDetail } from "@/lib/api";

export type EncounterStage =
  | "intake"
  | "history"
  | "exam"
  | "findings"
  | "diagnosis"
  | "investigation"
  | "treatment";

export const ENCOUNTER_STAGES = [
  { id: "intake", label: "Intake" },
  { id: "history", label: "Medical History" },
  { id: "exam", label: "Examination" },
  { id: "findings", label: "Findings" },
  { id: "diagnosis", label: "Diagnosis" },
  { id: "investigation", label: "Investigation" },
  { id: "treatment", label: "Treatment" },
] as const;

export function isStageComplete(
  stage: EncounterStage,
  encounter: EncounterDetail
): boolean {

  switch (stage) {

    case "intake":
      return (
        encounter.bp_systolic != null ||
        encounter.bp_diastolic != null ||
        encounter.pulse_rate != null ||
        encounter.temperature != null ||
        encounter.weight_kg != null ||
        encounter.spo2 != null
      );

    case "history":
      return Boolean(
        encounter.medical_history?.items?.length ||
        encounter.medical_history?.is_diabetic ||
        encounter.medical_history?.has_hypertension ||
        encounter.medical_history?.has_heart_condition ||
        encounter.medical_history?.has_medication_allergy ||
        encounter.medical_history?.is_on_blood_thinners ||
        encounter.medical_history?.has_hepatitis_tb ||
        encounter.medical_history?.is_pregnant ||
        encounter.medical_history?.smokes_or_drinks
      );

    case "exam":
      return (
        encounter.examination_findings?.length ?? 0
      ) > 0;

    case "findings":
      return (
        encounter.clinical_findings?.length ?? 0
      ) > 0;

    case "diagnosis":
      return (
        encounter.diagnoses?.length ?? 0
      ) > 0;

    case "investigation":
      return (
        encounter.investigations?.length ?? 0
      ) > 0;

    case "treatment":
      return (
        encounter.treatment_plan?.items?.length ?? 0
      ) > 0;
  }
}

export function getEncounterProgress(
  encounter: EncounterDetail
) {
  const completed =
    ENCOUNTER_STAGES.filter(
      (stage) =>
        isStageComplete(
          stage.id,
          encounter
        )
    ).length;

  const total =
    ENCOUNTER_STAGES.length;

  return {
    completed,
    total,
    percent:
      Math.round(
        (completed / total) * 100
      ),
  };
}