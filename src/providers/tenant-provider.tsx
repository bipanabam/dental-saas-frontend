"use client";

import { createContext, useContext } from "react";

import type { Session } from "next-auth";

type Context = {
  session: Session;
};

const TenantContext = createContext<Context | null>(null);

export function TenantProvider({
  session,
  children,
}: {
  session: Session;
  children: React.ReactNode;
}) {
  return (
    <TenantContext.Provider
      value={{
        session,
      }}
    >
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
