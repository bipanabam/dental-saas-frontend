import { auth } from "@/auth"
import { redirect } from "next/navigation"

import { appConfig } from "@/lib/config/app"

export default async function RedirectPage() {
    const session =
        await auth()

    if (!session?.user?.tenantSlug) {
        redirect("/login")
    }

    const url = appConfig.tenantUrl(session.user.tenantSlug);

    redirect(`${url}/dashboard`);
}