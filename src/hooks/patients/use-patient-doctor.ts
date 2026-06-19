import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  assignPrimaryDoctorApiV1PatientsPatientIdAssignDoctorPostMutation,
} from "@/lib/api/@tanstack/react-query.gen";

export function useAssignPrimaryDoctor(patientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    ...assignPrimaryDoctorApiV1PatientsPatientIdAssignDoctorPostMutation(),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getPatientDetail"],
      });

      queryClient.invalidateQueries({
        queryKey: ["getPatientSummary"],
      });
    },
  });
}