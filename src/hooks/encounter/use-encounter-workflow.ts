"use client";

import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getEncounterByAppointmentApiV1EncountersByAppointmentAppointmentIdGetOptions
} from "@/lib/api/@tanstack/react-query.gen";

import {
  updateEncounterApiV1EncountersEncounterIdPatch, 
  upsertMedicalHistoryApiV1EncountersEncounterIdHistoryPost,
  upsertExaminationApiV1EncountersEncounterIdExaminationPost,
  createFindingsApiV1EncountersEncounterIdFindingsPost,
  deleteFindingApiV1EncountersEncounterIdFindingsFindingIdDelete,
  createDiagnosesApiV1EncountersEncounterIdDiagnosesPost,
  createInvestigationsApiV1EncountersEncounterIdInvestigationsPost,
  updateInvestigationResultApiV1EncountersEncounterIdInvestigationsInvestigationIdResultPatch,
  createTreatmentPlanApiV1EncountersEncounterIdTreatmentPlanPost,
  performTreatmentPlanItemApiV1EncountersEncounterIdTreatmentPlanItemsItemIdPerformPost,
  deferTreatmentPlanItemApiV1EncountersEncounterIdTreatmentPlanItemsItemIdDeferPatch,
  cancelTreatmentPlanItemApiV1EncountersEncounterIdTreatmentPlanItemsItemIdCancelPatch,
  addTreatmentPlanItemsApiV1EncountersEncounterIdTreatmentPlanItemsPost,
} from "@/lib/api";

import type { EncounterUpdate } from "@/lib/api";

function extractError(err: any, fallback: string) {
  return err?.body?.detail ?? err?.detail ?? err?.message ?? fallback;
}

export function useUpdateEncounter(appointmentId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      encounterId,
      payload,
    }: {
      encounterId: string;
      payload: EncounterUpdate;
    }) => {
      const res = await updateEncounterApiV1EncountersEncounterIdPatch({
        path: { encounter_id: encounterId },
        body: payload,
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (data) => {
      qc.setQueryData(
        getEncounterByAppointmentApiV1EncountersByAppointmentAppointmentIdGetOptions({
          path: { appointment_id: appointmentId },
        }).queryKey,
        (old: any) => (old ? { ...old, ...data } : old)
      );
      toast.success("Vitals saved.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to save vitals")),
  });
}

export function useUpsertMedicalHistory(appointmentId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      encounterId,
      itemIds,
    }: {
      encounterId: string;
      itemIds: string[];
    }) => {
      const res = await upsertMedicalHistoryApiV1EncountersEncounterIdHistoryPost({
        path: { encounter_id: encounterId },
        body: {
          items: itemIds.map((id) => ({
            item_id: id,
            is_present: true,
            notes: null,
          })),
        },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (data) => {
      qc.setQueryData(
        getEncounterByAppointmentApiV1EncountersByAppointmentAppointmentIdGetOptions({
          path: { appointment_id: appointmentId },
        }).queryKey,
        (old: any) => old ? { ...old, medical_history: data } : old
      );
      toast.success("Medical history saved.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to save medical history")),
  });
}



// Shared cache patcher
// Merges partial update into the encounter cache
function usePatchEncounterCache(appointmentId: string) {
  const qc = useQueryClient();
  return (patch: Record<string, unknown>) => {
    qc.setQueryData(
      getEncounterByAppointmentApiV1EncountersByAppointmentAppointmentIdGetOptions({
        path: { appointment_id: appointmentId },
      }).queryKey,
      (old: any) => (old ? { ...old, ...patch } : old)
    );
  };
}

// Examination
export function useUpsertExamination(appointmentId: string) {
  const patch = usePatchEncounterCache(appointmentId);

  return useMutation({
    mutationFn: async ({
      encounterId,
      entries,
    }: {
      encounterId: string;
      entries: { category: string; field_id: string; value: string }[];
    }) => {
      const res = await upsertExaminationApiV1EncountersEncounterIdExaminationPost({
        path: { encounter_id: encounterId },
        body: { entries },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (data) => {
      patch({ examination_findings: data });
      toast.success("Examination saved.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to save examination")),
  });
}

// Findings
export function useCreateFindings(appointmentId: string) {
  const patch = usePatchEncounterCache(appointmentId);

  return useMutation({
    mutationFn: async ({
      encounterId,
      findings,
    }: {
      encounterId: string;
      findings: { finding_code: string; tooth_numbers?: number[] | null; notes?: string | null }[];
    }) => {
      const res = await createFindingsApiV1EncountersEncounterIdFindingsPost({
        path: { encounter_id: encounterId },
        body: { findings },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (data, vars) => {
      // Append to existing backend returns ALL findings after insert
      patch({ clinical_findings: data });
      toast.success(`${vars.findings.length} finding(s) added.`);
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to add findings")),
  });
}

export function useDeleteFinding(appointmentId: string) {
  const qc = useQueryClient();
  const queryKey = getEncounterByAppointmentApiV1EncountersByAppointmentAppointmentIdGetOptions({
    path: { appointment_id: appointmentId },
  }).queryKey;

  return useMutation({
    mutationFn: async ({ encounterId, findingId }: { encounterId: string; findingId: string }) => {
      const res = await deleteFindingApiV1EncountersEncounterIdFindingsFindingIdDelete({
        path: { encounter_id: encounterId, finding_id: findingId },
      });
      if (res.error) throw res.error;
    },
    onSuccess: (_data, vars) => {
      qc.setQueryData(queryKey, (old: any) =>
        old
          ? {
              ...old,
              clinical_findings: old.clinical_findings.filter(
                (f: any) => f.id !== vars.findingId
              ),
            }
          : old
      );
      toast.success("Finding removed.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to delete finding")),
  });
}

// Diagnosis
export function useReplaceDiagnoses(appointmentId: string) {
  const patch = usePatchEncounterCache(appointmentId);

  return useMutation({
    mutationFn: async ({
      encounterId,
      diagnoses,
    }: {
      encounterId: string;
      diagnoses: {
        diagnosis_code: string;
        is_primary: boolean;
        tooth_numbers?: number[] | null;
        notes?: string | null;
        icd10_code?: string | null;
      }[];
    }) => {
      const res = await createDiagnosesApiV1EncountersEncounterIdDiagnosesPost({
        path: { encounter_id: encounterId },
        body: { diagnoses },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (data) => {
      patch({ diagnoses: data });
      toast.success("Diagnoses saved.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to save diagnoses")),
  });
}

// Investigations
export function useCreateInvestigations(appointmentId: string) {
  const patch = usePatchEncounterCache(appointmentId);

  return useMutation({
    mutationFn: async ({
      encounterId,
      investigations,
    }: {
      encounterId: string;
      investigations: { investigation_code: string; notes?: string | null }[];
    }) => {
      const res = await createInvestigationsApiV1EncountersEncounterIdInvestigationsPost({
        path: { encounter_id: encounterId },
        body: { investigations },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (data, _vars) => {
      patch({ investigations: data });
      toast.success("Investigations ordered.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to order investigations")),
  });
}
import type { InvestigationStatusEnum } from "@/lib/api";

export function useUpdateInvestigationResult(appointmentId: string) {
  const qc = useQueryClient();
  const queryKey = getEncounterByAppointmentApiV1EncountersByAppointmentAppointmentIdGetOptions({
    path: { appointment_id: appointmentId },
  }).queryKey;

  return useMutation({
    mutationFn: async ({
      encounterId,
      investigationId,
      payload,
    }: {
      encounterId: string;
      investigationId: string;
      payload: { result?: string | null; result_file_url?: string | null; status: InvestigationStatusEnum };
    }) => {
      const res = await updateInvestigationResultApiV1EncountersEncounterIdInvestigationsInvestigationIdResultPatch({
        path: { encounter_id: encounterId, investigation_id: investigationId },
        body: payload,
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (data, vars) => {
      qc.setQueryData(queryKey, (old: any) =>
        old
          ? {
              ...old,
              investigations: old.investigations.map((i: any) =>
                i.id === vars.investigationId ? data : i
              ),
            }
          : old
      );
      toast.success("Result recorded.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to update result")),
  });
}


function useTreatmentPlanCachePatch(appointmentId: string) {
  const qc = useQueryClient();
  const queryKey = getEncounterByAppointmentApiV1EncountersByAppointmentAppointmentIdGetOptions({
    path: { appointment_id: appointmentId },
  }).queryKey;

  return {
    // Replace the whole plan (after create/perform)
    setPlan: (plan: any) =>
      qc.setQueryData(queryKey, (old: any) =>
        old ? { ...old, treatment_plan: plan } : old
      ),
    // Patch a single item within the plan (after defer/cancel)
    patchItem: (item: any) =>
      qc.setQueryData(queryKey, (old: any) => {
        if (!old?.treatment_plan) return old;
        return {
          ...old,
          treatment_plan: {
            ...old.treatment_plan,
            items: old.treatment_plan.items.map((i: any) =>
              i.id === item.id ? item : i
            ),
          },
        };
      }),
    // Full invalidate — used after perform since it also creates a Procedure
    invalidate: () => qc.invalidateQueries({ queryKey }),
  };
}

// Create plan
export function useCreateTreatmentPlan(appointmentId: string) {
  const { setPlan } = useTreatmentPlanCachePatch(appointmentId);

  return useMutation({
    mutationFn: async ({
      encounterId,
      payload,
    }: {
      encounterId: string;
      payload: {
        notes?: string | null;
        items: {
          procedure_catalog_id: string;
          tooth_numbers?: number[] | null;
          visit_number?: number;
          priority?: number;
          estimated_cost?: number | null;
          notes?: string | null;
        }[];
      };
    }) => {
      const res = await createTreatmentPlanApiV1EncountersEncounterIdTreatmentPlanPost({
        path: { encounter_id: encounterId },
        body: payload,
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (data) => {
      setPlan(data);
      toast.success("Treatment plan created.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to create treatment plan")),
  });
}

// Perform item
export function usePerformTreatmentPlanItem(appointmentId: string) {
  const { setPlan, invalidate } = useTreatmentPlanCachePatch(appointmentId);

  return useMutation({
    mutationFn: async ({
      encounterId,
      itemId,
      payload,
    }: {
      encounterId: string;
      itemId: string;
      payload: {
        final_cost?: number | null;
        notes?: string | null;
        performed_duration_minutes?: number | null;
      };
    }) => {
      const res = await performTreatmentPlanItemApiV1EncountersEncounterIdTreatmentPlanItemsItemIdPerformPost({
        path: { encounter_id: encounterId, item_id: itemId },
        body: payload,
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (data) => {
      setPlan(data);
      // Also invalidate since a new Procedure was created (affects encounter.procedures)
      invalidate();
      toast.success("Procedure performed and recorded.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to perform procedure")),
  });
}

// Defer item
export function useDeferTreatmentPlanItem(appointmentId: string) {
  const { patchItem } = useTreatmentPlanCachePatch(appointmentId);

  return useMutation({
    mutationFn: async ({ encounterId, itemId }: { encounterId: string; itemId: string }) => {
      const res = await deferTreatmentPlanItemApiV1EncountersEncounterIdTreatmentPlanItemsItemIdDeferPatch({
        path: { encounter_id: encounterId, item_id: itemId },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (data) => {
      patchItem(data);
      toast.success("Item deferred to next visit.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to defer item")),
  });
}

// Cancel item
export function useCancelTreatmentPlanItem(appointmentId: string) {
  const { patchItem } = useTreatmentPlanCachePatch(appointmentId);

  return useMutation({
    mutationFn: async ({ encounterId, itemId }: { encounterId: string; itemId: string }) => {
      const res = await cancelTreatmentPlanItemApiV1EncountersEncounterIdTreatmentPlanItemsItemIdCancelPatch({
        path: { encounter_id: encounterId, item_id: itemId },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (data) => {
      patchItem(data);
      toast.success("Item cancelled.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to cancel item")),
  });
}

export function useAddTreatmentPlanItems(appointmentId: string) {
  const { setPlan } = useTreatmentPlanCachePatch(appointmentId);

  return useMutation({
    mutationFn: async ({
      encounterId,
      items,
    }: {
      encounterId: string;
      items: {
        procedure_catalog_id: string;
        tooth_numbers?: number[] | null;
        visit_number?: number;
        estimated_cost?: number | null;
        notes?: string | null;
      }[];
    }) => {
      const res = await addTreatmentPlanItemsApiV1EncountersEncounterIdTreatmentPlanItemsPost({
        path: { encounter_id: encounterId },
        body: { items },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: (data) => {
      setPlan(data);
      toast.success("Procedure(s) added to plan.");
    },
    onError: (err: any) => toast.error(extractError(err, "Failed to add items")),
  });
}