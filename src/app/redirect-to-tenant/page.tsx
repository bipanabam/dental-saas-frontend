import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function RedirectPage() {
    const session =
        await auth()

    if (!session?.user?.tenantSlug) {
        redirect("/login")
    }

    const host =
        process.env.NODE_ENV ===
            "development"
            ? `${session.user.tenantSlug}.app.local:3000`
            : `${session.user.tenantSlug}.dentalsaas.com`

    redirect(
        `http://${host}/dashboard`
    )
}