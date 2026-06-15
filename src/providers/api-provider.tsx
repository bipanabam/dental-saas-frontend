"use client";

import { useSession } from "next-auth/react";

import { configureApiClient } from "@/lib/api/configure-client";

const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, status } = useSession();

  if (status === "loading") {
    return null;
  }

  configureApiClient(data?.accessToken);

  return <>{children}</>;
};

export default ApiProvider;
