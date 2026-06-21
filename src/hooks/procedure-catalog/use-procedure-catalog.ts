"use client";

import { useQuery } from "@tanstack/react-query";

import { useSession } from "next-auth/react";

import { 
    searchCatalogApiV1ProcedureCatalogSearchGetOptions,
    listCatalogApiV1ProcedureCatalogGetOptions,
 } from "@/lib/api/@tanstack/react-query.gen";

export function useProcedureCatalogs(params?: {  
    limit?: number 
}) {
  const { status } = useSession();
  const limit = params?.limit ?? 20;

  return useQuery({
    ...listCatalogApiV1ProcedureCatalogGetOptions({
        query: {
            limit,
        },
    }),

    enabled: status === "authenticated",
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useSearchProcedureCatalog(
  search: string,
) {
  return useQuery({
    ...searchCatalogApiV1ProcedureCatalogSearchGetOptions({
      query: {
        q: search,
      },
    }),

    enabled: search.length >= 2,
    staleTime: 30 * 1000,
  });
}