"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";

import {
    getTaxonomyApiV1TaxonomyGetOptions,
} from "@/lib/api/@tanstack/react-query.gen";

const DAY = 1000 * 60 * 60 * 24;

export function TaxonomyPrefetch() {
    const queryClient = useQueryClient();
    const { status } = useSession();

    useEffect(() => {
        if (status !== "authenticated") return;

        queryClient.prefetchQuery({
            ...getTaxonomyApiV1TaxonomyGetOptions(),
            staleTime: DAY,
        });
    }, [status, queryClient]);

    return null;
}