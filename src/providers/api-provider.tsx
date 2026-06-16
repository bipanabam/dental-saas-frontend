"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { configureApiClient } from "@/lib/api/configure-client";

const ApiProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      configureApiClient(
        data?.accessToken
      );
    }
  }, [
    status,
    data?.accessToken,
  ]);

  if (status === "loading") {
    return null;
  }

  return <>{children}</>;
};

export default ApiProvider;
