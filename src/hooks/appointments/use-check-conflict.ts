import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { checkAppointmentConflictApiV1AppointmentsCheckConflictGet } from "@/lib/api";

export interface ConflictCheckParams {
  doctorId?: string | null;
  appointmentDate?: string;        // ISO datetime string
  durationMinutes?: number;
  excludeAppointmentId?: string;   // pass when editing
}

export function useCheckAppointmentConflict(params: ConflictCheckParams) {
  const debounced = useDebouncedValue(params, 400);

  const enabled = Boolean(
    debounced.doctorId &&
    debounced.appointmentDate &&
    debounced.durationMinutes &&
    debounced.durationMinutes > 0,
  );

  return useQuery({
    queryKey: ["appointment-conflict", debounced],
    queryFn: async () => {
      const res = await checkAppointmentConflictApiV1AppointmentsCheckConflictGet({
        query: {
          doctor_id: debounced.doctorId!,
          appointment_date: debounced.appointmentDate!,
          duration_minutes: debounced.durationMinutes!,
          exclude_appointment_id: debounced.excludeAppointmentId,
        },
      });
      if (res.error) throw res.error;
      return res.data!;
    },
    enabled,
    staleTime: 15_000,
    retry: false,
  });
}