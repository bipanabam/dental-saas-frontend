"use client";

import { useSession } from "next-auth/react";

/**
 * Gate for the Doctor View toggle.
 * Only admin and receptionist roles can switch the appointments page
 * into the per-doctor grouped/calendar view.
 */
const ALLOWED_ROLES = ["admin", "receptionist"] as const;

export function useCanViewDoctorSplit() {
    const { data: session, status } = useSession();

    if (status !== "authenticated") return false;

    const role = session?.user?.role;
    return role ? ALLOWED_ROLES.includes(role as (typeof ALLOWED_ROLES)[number]) : false;
}