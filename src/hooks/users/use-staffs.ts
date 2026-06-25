"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import {
    getUsersApiV1UsersGetOptions,
    getUserProfileApiV1UsersUserIdProfileGetOptions,
    listTenantSessionsApiV1UsersSessionsGetOptions
} from "@/lib/api/@tanstack/react-query.gen";

export function useGetAllUsers() {
  const { status } = useSession();

  return useQuery({
    ...getUsersApiV1UsersGetOptions(),

    enabled: status === "authenticated",

    staleTime: 1000 * 60 * 10,
  });
}

export function useGetAllUserSessions() {
  const { status } = useSession();

  return useQuery({
    ...listTenantSessionsApiV1UsersSessionsGetOptions(),

    enabled: status === "authenticated",

    staleTime: 1000 * 60 * 10,
  });
}

export function useGetUserProfile(userId: string) {
  const { status } = useSession();

  return useQuery({
    ...getUserProfileApiV1UsersUserIdProfileGetOptions(
      { path: {
        user_id: userId
      }}
    ),

    enabled: status === "authenticated",

    staleTime: 1000 * 60 * 10,
  });
}
