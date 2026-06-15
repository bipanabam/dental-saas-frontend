"use client";

import { SessionProvider } from "next-auth/react";

import QueryProvider from "@/providers/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import ApiProvider from "@/providers/api-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ApiProvider>
        <QueryProvider>
            <TooltipProvider>
            {children}
            </TooltipProvider>
        </QueryProvider>
      </ApiProvider>
    </SessionProvider>
  );
}
