"use client";

import { SessionProvider } from "next-auth/react";

import QueryProvider from "@/providers/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import ApiProvider from "@/providers/api-provider";
import { TaxonomyPrefetch } from "@/providers/taxonomy-prefetch";
import { SessionWatcher } from "@/providers/session-watcher";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionWatcher />
      <ApiProvider>
        <QueryProvider>
          <TooltipProvider>
            <TaxonomyPrefetch />
            {children}
          </TooltipProvider>
        </QueryProvider>
      </ApiProvider>
    </SessionProvider>
  );
}