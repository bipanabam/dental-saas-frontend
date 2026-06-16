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
}

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
      <Card className={cn("rounded-2xl", className)}>
        <CardContent className="p-5 space-y-4">
          <div className="h-4 w-28 rounded bg-muted animate-pulse" />
          <div className="h-8 w-24 rounded bg-muted animate-pulse" />
          <div className="h-3 w-36 rounded bg-muted animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("rounded-2xl border-border/60 shadow-sm", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {title}
            </p>

            <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
          </div>

          <div className="rounded-xl bg-brand-50 p-2">
            <Icon className={cn("h-5 w-5 text-primary",
            priorityStyles[priority ?? "normal"],
            )} />
          </div>
        </div>

        {(trend || description) && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            {trend && (
              <div
                className={cn(
                  "flex items-center gap-1",
                  trendStyles[trend.direction ?? "neutral"],
                )}
              >
                {trend.direction === "up" && <TrendingUp className="h-4 w-4" />}

                {trend.direction === "down" && (
                  <TrendingDown className="h-4 w-4" />
                )}

                {trend.value}
              </div>
            )}

            {description && (
                <span className={cn("text-muted-foreground",
                    priorityStyles[priority ?? "normal"],
                )}>
                    {description}
                </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AnalyticsCard;
