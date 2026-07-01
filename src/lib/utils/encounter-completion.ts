import type { EncounterDetail } from "@/lib/api";

export interface EncounterReadiness {
    canComplete: boolean;
    blockingReasons: string[];
    /** Non-blocking, just a courtesy nudge before closing */
    warnings: string[];
}

export function getEncounterReadiness(encounter: EncounterDetail): EncounterReadiness {
    const blockingReasons: string[] = [];
    const warnings: string[] = [];

    const diagnoses = encounter.diagnoses ?? [];
    const primaryDiagnoses = diagnoses.filter((d) => d.is_primary);

    if (diagnoses.length === 0) {
        blockingReasons.push("At least one diagnosis is required.");
    } else if (primaryDiagnoses.length !== 1) {
        blockingReasons.push("Exactly one primary diagnosis is required.");
    }

    const items = encounter.treatment_plan?.items ?? [];
    const invalidItems = items.filter(
        (item) => item.status === "DONE" && !item.performed_procedure_id,
    );
    if (invalidItems.length > 0) {
        blockingReasons.push("Completed treatment items must have procedures attached.");
    }

    // Soft nudges -> documentation that's usually filled in but isn't
    // enforced server-side. Shown once, don't block on them.
    if (!encounter.medical_history) {
        warnings.push("Medical history hasn't been recorded.");
    }
    if ((encounter.examination_findings?.length ?? 0) === 0) {
        warnings.push("No examination findings recorded.");
    }

    return {
        canComplete: blockingReasons.length === 0,
        blockingReasons,
        warnings,
    };
}