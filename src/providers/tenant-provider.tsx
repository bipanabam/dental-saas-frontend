"use client";

import { createContext, useContext } from "react";
import { useSession } from "next-auth/react";

import type { Session } from "next-auth";

type Context = {
  session: Session;
};

const TenantContext = createContext<Context | null>(null);

export function TenantProvider({
  session: initialSession,
  children,
}: {
  session: Session;
  children: React.ReactNode;
}) {
  const { data: clientSession } = useSession();

  // Prefer live client session once hydrated, fall back to server-passed initial value
  const session = clientSession ?? initialSession;

  return (
    <TenantContext.Provider value={{ session }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const ctx = useContext(TenantContext);

  if (!ctx) {
    throw new Error("useTenant must be inside TenantProvider");
  }

  return ctx;
}