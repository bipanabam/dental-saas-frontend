"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export type AppointmentView = "list" | "provider" | "calendar";

const VIEW_PARAM = "view";
const VALID_VIEWS: AppointmentView[] = ["list", "provider", "calendar"];

interface UseAppointmentViewResult {
    view: AppointmentView;
    setView: (view: AppointmentView) => void;
}

export function useAppointmentView(): UseAppointmentViewResult {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const view = useMemo<AppointmentView>(() => {
        const raw = searchParams.get(VIEW_PARAM);
        return VALID_VIEWS.includes(raw as AppointmentView) ? (raw as AppointmentView) : "list";
    }, [searchParams]);

    const setView = useCallback(
        (next: AppointmentView) => {
            const params = new URLSearchParams(searchParams.toString());
            if (next === "list") {
                params.delete(VIEW_PARAM);
            } else {
                params.set(VIEW_PARAM, next);
            }
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [pathname, router, searchParams],
    );

    return { view, setView };
}