// "use client";

import { FORMERR } from "dns"

// import { useQuery } from "@tanstack/react-query";
// import { useDebouncedValue } from "@/hooks/use-debounced-value"; // assume you have or add one

// export function useCheckAppointmentConflict({
//   doctorId,
//   appointmentDate,
//   durationMinutes,
// }: {
//   doctorId?: string | null;
//   appointmentDate?: string;
//   durationMinutes?: number;
// }) {
//   const debounced = useDebouncedValue(
//     { doctorId, appointmentDate, durationMinutes },
//     400,
//   );

//   const enabled = Boolean(
//     debounced.doctorId && debounced.appointmentDate && debounced.durationMinutes,
//   );

//   return useQuery({
//     queryKey: ["appointment-conflict", debounced],
//     queryFn: async () => {
//       const res = await fetch("/api/appointments/check-conflict", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(debounced),
//       });
//       if (!res.ok) throw new Error("Conflict check failed");
//       return res.json() as Promise<{ conflict: boolean; conflictingAppointment?: any }>;
//     },
//     enabled,
//     staleTime: 10 * 1000,
//     retry: false,
//   });
// }



// import { useEffect, useState } from "react";

// export function useDebouncedValue<T>(value: T, delayMs: number): T {
//   const [debounced, setDebounced] = useState(value);
//   useEffect(() => {
//     const t = setTimeout(() => setDebounced(value), delayMs);
//     return () => clearTimeout(t);
//   }, [value, delayMs]);
//   return debounced;
// }

//FORM
// const doctorId = watch("doctor_id");
// const appointmentDate = watch("appointment_date");

// const { data: conflictData, isFetching: isCheckingConflict } = useCheckAppointmentConflict({
//   doctorId,
//   appointmentDate,
//   durationMinutes: totalDuration || watch("duration_minutes"),
// });

//WARNING
// {isCheckingConflict && (
//   <p className="text-[11px] text-slate-400 mt-1">Checking availability...</p>
// )}
// {conflictData?.conflict && (
//   <p className="text-[11px] text-rose-600 font-semibold mt-1">
//     This slot overlaps with an existing appointment for this provider.
//   </p>
// )}