"use client";

import { cn } from "@/lib/utils";
import { getStatusConfig } from "@/types/appointments";

interface StatusLegendProps {
    order: readonly string[];
    className?: string;
}

export default function StatusLegend({ order, className }: StatusLegendProps) {
    return (
        <div className={cn("flex items-center gap-3 flex-wrap", className)}>
            {order.map((status) => {
                const config = getStatusConfig(status);
                return (
                    <div key={status} className="flex items-center gap-1.5">
                        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", config.dot)} />
                        <span className="text-[10px] font-semibold text-slate-500">
                            {config.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}