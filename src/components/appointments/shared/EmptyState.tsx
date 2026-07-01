"use client";

import { HeartPulse, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    size?: "sm" | "md";
    className?: string;
}

export default function EmptyState({
    icon: Icon = HeartPulse,
    title,
    description,
    size = "md",
    className,
}: EmptyStateProps) {
    const isCompact = size === "sm";

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center text-center",
                isCompact ? "py-6 gap-1.5" : "py-12 gap-3",
                className,
            )}
        >
            <div
                className={cn(
                    "flex items-center justify-center rounded-xl bg-slate-100 text-slate-400",
                    isCompact ? "h-8 w-8" : "h-10 w-10",
                )}
            >
                <Icon className={isCompact ? "h-4 w-4" : "h-5 w-5"} />
            </div>
            <p
                className={cn(
                    "font-semibold text-slate-400 uppercase tracking-wider",
                    isCompact ? "text-[10px]" : "text-xs",
                )}
            >
                {title}
            </p>
            {description && (
                <p className={cn("text-slate-400/80", isCompact ? "text-[10px]" : "text-xs")}>
                    {description}
                </p>
            )}
        </div>
    );
}