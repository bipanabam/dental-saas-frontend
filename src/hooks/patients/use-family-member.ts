"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addFamilyMemberApiV1PatientsPatientIdFamilyPost,
  removeFamilyMemberApiV1PatientsPatientIdFamilyFamilyMemberIdDelete,
} from "@/lib/api";

import { listFamilyMembersApiV1PatientsPatientIdFamilyGetOptions } from "@/lib/api/@tanstack/react-query.gen";

import { toast } from "sonner";

import { getApiError } from "@/lib/utils/get-api-error";

import type { FamilyRelationshipEnum } from "@/lib/api";

function familyQueryOptions(patientId: string) {
  return listFamilyMembersApiV1PatientsPatientIdFamilyGetOptions({
    path: {
      patient_id: patientId,
    },
  });
}

export function usePatientFamily(patientId: string, enabled = true) {
  return useQuery({
    ...familyQueryOptions(patientId),

    enabled,

    staleTime: 1000 * 60 * 10,
  });
}

export function useLinkFamilyMember(patientId: string) {
  const qc = useQueryClient();

  const query = familyQueryOptions(patientId);

  return useMutation({
    mutationFn: (payload: {
      family_member_id: string;

      relationship_type: FamilyRelationshipEnum;
    }) =>
      addFamilyMemberApiV1PatientsPatientIdFamilyPost({
        path: {
          patient_id: patientId,
        },

        body: payload,
      }),

    async onSuccess(response) {
        if (response.error) {
            toast.error(getApiError(response.error))
        } else {
            toast.success("Family member linked");
        }

      await qc.invalidateQueries({
        queryKey: query.queryKey,
      });
    },

    onError(error) {
      toast.error(getApiError(error));
    },
  });
}

export function useRemoveFamilyMember(patientId: string) {
  const qc = useQueryClient();
  const query = familyQueryOptions(patientId);

  return useMutation({
    mutationFn: (familyMemberId: string) =>
      removeFamilyMemberApiV1PatientsPatientIdFamilyFamilyMemberIdDelete({
        path: {
          patient_id: patientId,
          family_member_id: familyMemberId,
        },
      }),

    async onMutate(familyMemberId) {
      await qc.cancelQueries({
        queryKey: query.queryKey,
      });

      const previous = qc.getQueryData(query.queryKey);

      qc.setQueryData(
        query.queryKey,

        (old: any[] = []) => old.filter((x) => x.id !== familyMemberId),
      );

      return {
        previous,
      };
    },

    onSuccess() {
      toast.success("Family member removed");
    },

    onError(error, _, ctx) {
      qc.setQueryData(
        query.queryKey,

        ctx?.previous,
      );

      toast.error(getApiError(error));
    },

    async onSettled() {
      await qc.invalidateQueries({
        queryKey: query.queryKey,
      });
    },
  });
}
