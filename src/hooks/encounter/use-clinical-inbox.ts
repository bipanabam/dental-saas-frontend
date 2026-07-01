"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import { getClinicalInboxApiV1EncountersInboxGetOptions } from "@/lib/api/@tanstack/react-query.gen";

export interface InboxInvestigationItem {
    id: string;
    investigation_code: string;
    investigation_name: string;
    requested_at: string;
    encounter_id: string;
    appointment_id: string;
    patient_id: string;
    patient_name: string;
}

export interface InboxTreatmentPlanItem {
    id: string;
    procedure_catalog_id: string;
    procedure_name?: string | null;
    tooth_numbers?: number[] | null;
    encounter_id: string;
    appointment_id: string;
    patient_id: string;
    patient_name: string;
}

export interface ClinicalInboxResponse {
    pending_investigations: InboxInvestigationItem[];
    deferred_treatment_items: InboxTreatmentPlanItem[];
}

export function useClinicalInbox(doctorId?: string, today = true) {
    const { status } = useSession();
    return useQuery({
        ...getClinicalInboxApiV1EncountersInboxGetOptions({
            query: {
            doctor_id: doctorId ?? "",
            today
            },
        }),
  
        enabled: status === "authenticated" && Boolean(doctorId),
        staleTime: 30_000,
    });
}