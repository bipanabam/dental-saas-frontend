"use client";

import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface QuickAction {
    key: string;
    label: string;
    description?: string;
    icon: LucideIcon;
    onClick: () => void;
    variant?: "primary" | "default";
}

export default function QuickActions({ actions }: { actions: QuickAction[] }) {
    return (
        <Card className="rounded-2xl border-slate-100 shadow-3xs bg-white">
            <CardHeader className="pb-3">
                <CardTitle className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Quick Actions
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
                {actions.map((action) => {
                    const Icon = action.icon;
                    const isPrimary = action.variant === "primary";
                    return (
                        <button
                            key={action.key}
                            onClick={action.onClick}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left group",
                                isPrimary
                                    ? "border-brand-200 bg-brand-50/60 hover:bg-brand-50 hover:border-brand-300"
                                    : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200"
                            )}
                        >
                            <div className={cn(
                                "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                                isPrimary
                                    ? "bg-brand-100 group-hover:bg-brand-200 text-brand-700"
                                    : "bg-white border border-slate-200 text-slate-500 group-hover:border-slate-300"
                            )}>
                                <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                                <p className={cn(
                                    "text-sm font-bold leading-tight",
                                    isPrimary ? "text-brand-800" : "text-slate-700"
                                )}>
                                    {action.label}
                                </p>
                                {action.description && (
                                    <p className="text-[11px] text-slate-400 mt-0.5">{action.description}</p>
                                )}
                            </div>
                        </button>
                    );
                })}
            </CardContent>
        </Card>
    );
}