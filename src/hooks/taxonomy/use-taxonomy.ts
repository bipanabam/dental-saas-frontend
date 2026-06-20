"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import {
    getTaxonomyApiV1TaxonomyGetOptions,
    getMedicalHistoryTaxonomyApiV1TaxonomyMedicalHistoryGetOptions,
    getExaminationTaxonomyApiV1TaxonomyExaminationGetOptions,
    getFindingsTaxonomyApiV1TaxonomyFindingsGetOptions,
    getDiagnosesTaxonomyApiV1TaxonomyDiagnosesGetOptions,
    getInvestigationsTaxonomyApiV1TaxonomyInvestigationsGetOptions,
} from "@/lib/api/@tanstack/react-query.gen";

const DAY = 1000 * 60 * 60 * 24;
const WEEK = DAY * 7;

const taxonomyQueryConfig = {
    staleTime: DAY,
    gcTime: WEEK,
    retry: 1,
};

export function useTaxonomy() {
    const { status } = useSession();

    return useQuery({
        ...getTaxonomyApiV1TaxonomyGetOptions(),
        enabled: status === "authenticated",
        staleTime: DAY,
        gcTime: WEEK,
        retry: 1,
    });
}

export function useMedicalHistoryTaxonomy() {
    const { status } = useSession();

    return useQuery({
        ...getMedicalHistoryTaxonomyApiV1TaxonomyMedicalHistoryGetOptions(),
        enabled: status === "authenticated",
        ...taxonomyQueryConfig,
    });
}

export function useExaminationTaxonomy() {
    const { status } = useSession();

    return useQuery({
        ...getExaminationTaxonomyApiV1TaxonomyExaminationGetOptions(),
        enabled: status === "authenticated",
        ...taxonomyQueryConfig,
    });
}

export function useFindingsTaxonomy() {
    const { status } = useSession();

    return useQuery({
        ...getFindingsTaxonomyApiV1TaxonomyFindingsGetOptions(),
        enabled: status === "authenticated",
        ...taxonomyQueryConfig,
    });
}

export function useDiagnosesTaxonomy() {
    const { status } = useSession();

    return useQuery({
        ...getDiagnosesTaxonomyApiV1TaxonomyDiagnosesGetOptions(),
        enabled: status === "authenticated",
        ...taxonomyQueryConfig,
    });
}

export function useInvestigationsTaxonomy() {
    const { status } = useSession();

    return useQuery({
        ...getInvestigationsTaxonomyApiV1TaxonomyInvestigationsGetOptions(),
        enabled: status === "authenticated",
        ...taxonomyQueryConfig,
    });
}