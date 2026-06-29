import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: string;
    direction?: "up" | "down" | "neutral";
  };
  className?: string;
  loading?: boolean;
  priority?: "high" | "critical";
}

const trendStyles = {
  up: "text-emerald-600",
  down: "text-red-600",
  neutral: "text-slate-500",
};

const priorityStyles = {
  high: "text-red-400",
  critical: "text-red-700",
  normal: "text-emerald-600",
};

const AnalyticsCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  loading,
  className,
  priority,
}: AnalyticsCardProps) => {
  if (loading) {
    return (
      <Card className={cn("rounded-xl", className)}>
        <CardContent className="p-3.5 space-y-2.5">
          <div className="h-3 w-20 rounded bg-muted animate-pulse" />
          <div className="h-6 w-16 rounded bg-muted animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("rounded-xl border-border/60 shadow-sm", className)}>
      <CardContent className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5 min-w-0">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold truncate">
              {title}
            </p>
            <h3 className="text-xl font-bold tracking-tight">{value}</h3>
          </div>

          <div className="rounded-lg bg-brand-50 p-1.5 shrink-0">
            <Icon
              className={cn(
                "h-3.5 w-3.5 text-primary",
                priorityStyles[priority ?? "normal"],
              )}
            />
          </div>
        </div>

        {(trend || description) && (
          <div className="mt-2 flex items-center gap-1.5 text-[11px]">
            {trend && (
              <div
                className={cn(
                  "flex items-center gap-0.5 font-medium",
                  trendStyles[trend.direction ?? "neutral"],
                )}
              >
                {trend.direction === "up" && <TrendingUp className="h-3 w-3" />}
                {trend.direction === "down" && <TrendingDown className="h-3 w-3" />}
                {trend.value}
              </div>
            )}

            {description && (
              <span
                className={cn(
                  "text-muted-foreground truncate",
                  priorityStyles[priority ?? "normal"],
                )}
              >
                {description}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;