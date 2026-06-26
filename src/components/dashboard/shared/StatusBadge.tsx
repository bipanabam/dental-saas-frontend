import { cn } from "@/lib/utils";
import type { StageStyle } from "../stage";

/**
 * Domain-agnostic — caller resolves the style via getAppointmentStageStyle()
 * or getQueueStageStyle() and passes the result. Keeps this component from
 * needing to know which resource (appointment vs queue) it's rendering for.
 */
export default function StatusBadge({
    status,
    className,
}: {
    status: StageStyle;
    className?: string;
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset",
                status.badge,
                className
            )}
        >
            <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
            {status.label}
        </span>
    );
}