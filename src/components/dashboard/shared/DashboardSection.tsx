import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * The "Live Operations Board" / "Queue Board" / "Encounter Funnel" pattern:
 * a card with a title, optional right-aligned meta (count, filter, link),
 * and content. Pulling this out keeps every board's chrome identical.
 */
export default function DashboardSection({
    title,
    meta,
    children,
    className,
    contentClassName,
}: {
    title: string;
    meta?: ReactNode;
    children: ReactNode;
    className?: string;
    contentClassName?: string;
}) {
    return (
        <Card className={cn("rounded-2xl border-slate-100 shadow-3xs bg-white", className)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-400">
                    {title}
                </CardTitle>
                {meta}
            </CardHeader>
            <CardContent className={cn("pt-0", contentClassName)}>{children}</CardContent>
        </Card>
    );
}