"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

export function SessionWatcher() {
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.error === "RefreshTokenExpired") {
            signOut({ callbackUrl: "/login" });
        }
    }, [session?.error]);

    return null;
}