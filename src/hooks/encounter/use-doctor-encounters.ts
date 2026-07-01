import { useSession } from "next-auth/react";
import { useListEncounters } from "./use-encounter";
import { useClinicalInbox } from "./use-clinical-inbox";
import { EncounterStatusEnum } from "@/lib/api/types.gen";

export function useMyActiveEncounters() {
  const { data: session } = useSession();
  return useListEncounters(
    { status: "IN_PROGRESS", doctor_id: session?.user?.id },
    { enabled: Boolean(session?.user?.id) }
  );
}

export function useMyEncounterHistory(filters: { status?: EncounterStatusEnum; today?: boolean }) {
  const { data: session } = useSession();
  return useListEncounters(
    { ...filters, doctor_id: session?.user?.id },
    { enabled: Boolean(session?.user?.id) }
  );
}

export function useMyClinicalInbox(today = true) {
  const { data: session } = useSession();
  return useClinicalInbox(session?.user?.id, today);
}