import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KpiCardData {
    id: string;
    title: string;
    value: number | string;
    description?: string;
    icon: LucideIcon;
    iconBg?: string;
    iconColor?: string;
}

export function DailyKpiCard({
    title,
    value,
    icon: Icon,
    iconBg,
    iconColor,
}: Omit<KpiCardData, "id">) {
    return (
        <Card className="rounded-2xl border-slate-100 shadow-3xs bg-white overflow-hidden transition-all duration-200 hover:border-slate-200/80">
            <CardContent className="p-4 flex items-center gap-4">
                <div
                    className={cn(
                        "h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-4xs",
                        iconBg ?? "bg-slate-100"
                    )}
                >
                    <Icon className={cn("h-5 w-5", iconColor ?? "text-slate-500")} />
                </div>

                <div className="space-y-0.5 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 block truncate">
                        {title}
                    </p>
                    <p className="text-2xl font-black text-slate-800 font-mono tracking-tight leading-none">
                        {value}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export default function KpiStrip({
    items,
    columns = 5,
}: {
    items: KpiCardData[];
    columns?: 4 | 5 | 6;
}) {
    const colClass =
        columns === 4
            ? "lg:grid-cols-4"
            : columns === 6
                ? "lg:grid-cols-6"
                : "lg:grid-cols-5";

    return (
        <div className={cn("grid grid-cols-2 sm:grid-cols-3 gap-3", colClass)}>
            {items.map(({ id, ...item }) => (
                <DailyKpiCard
                    key={id}
                    {...item}
                />
            ))}
        </div>
    );
}