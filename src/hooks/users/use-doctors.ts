"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import {
  getDoctorsApiV1UsersDoctorGetOptions,
} from "@/lib/api/@tanstack/react-query.gen";

export function useDoctors() {
  const { status } = useSession();

  return useQuery({
    ...getDoctorsApiV1UsersDoctorGetOptions(),

    enabled: status === "authenticated",

    staleTime: 1000 * 60 * 10,
  });
}