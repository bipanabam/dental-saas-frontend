"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import {
    getUsersApiV1UsersGetOptions,
    getUserApiV1UsersUserIdGetOptions,
} from "@/lib/api/@tanstack/react-query.gen";

export function useGetAllUsers() {
  const { status } = useSession();

  return useQuery({
    ...getUsersApiV1UsersGetOptions(),

    enabled: status === "authenticated",

    staleTime: 1000 * 60 * 10,
  });
}