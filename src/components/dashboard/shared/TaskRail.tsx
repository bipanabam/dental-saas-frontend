import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export interface TaskItem {
    id: string;
    title: string;
    subtitle?: string;
    /** Right-aligned tag, e.g. "Tomorrow", "Rs 2,400", "3 days overdue" */
    tag?: string;
    tagTone?: "neutral" | "warning" | "danger";
    onClick?: () => void;
}

export interface TaskSection {
    key: string;
    label: string;
    items: TaskItem[];
}

const TAG_TONE: Record<NonNullable<TaskItem["tagTone"]>, string> = {
    neutral: "bg-slate-100 text-slate-500",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-rose-50 text-rose-700",
};

/**
 * Renders one or more labeled sections of compact list items.
 * Used for: Reception's "Follow-ups" (pending confirmation / tomorrow's
 * appointments / outstanding forms), Admin's "Critical Alerts" (clinical /
 * operations / finance), Doctor's "Clinical Inbox", Assistant's
 * "Assigned Tasks". Same shape, different data per role.
 */
export default function TaskRail({
    title,
    sections,
    emptyLabel = "Nothing here right now.",
}: {
    title: string;
    sections: TaskSection[];
    emptyLabel?: string;
}) {
    const isEmpty = sections.every((s) => s.items.length === 0);

    return (
        <Card className="rounded-2xl border-slate-100 shadow-3xs bg-white">
            <CardHeader className="pb-2">
                <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-400">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {isEmpty && (
                    <p className="text-sm text-slate-400 py-6 text-center">{emptyLabel}</p>
                )}

                {!isEmpty &&
                    sections.map((section) => {
                        if (section.items.length === 0) return null;
                        return (
                            <div key={section.key} className="space-y-1.5">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    {section.label}
                                </p>
                                <div className="space-y-1">
                                    {section.items.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={item.onClick}
                                            disabled={!item.onClick}
                                            className={cn(
                                                "w-full flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-left transition-colors",
                                                item.onClick
                                                    ? "hover:bg-slate-50 cursor-pointer"
                                                    : "cursor-default"
                                            )}
                                        >
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-slate-700 truncate">
                                                    {item.title}
                                                </p>
                                                {item.subtitle && (
                                                    <p className="text-xs text-slate-400 truncate">
                                                        {item.subtitle}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0">
                                                {item.tag && (
                                                    <Badge
                                                        variant="secondary"
                                                        className={cn(
                                                            "rounded-full text-[10px] font-bold border-0",
                                                            TAG_TONE[item.tagTone ?? "neutral"]
                                                        )}
                                                    >
                                                        {item.tag}
                                                    </Badge>
                                                )}
                                                {item.onClick && (
                                                    <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
            </CardContent>
        </Card>
    );
}