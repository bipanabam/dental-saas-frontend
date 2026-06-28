import { CreditCard, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

import type { AppointmentListItem } from "@/lib/api";

interface PaymentBucket {
    label: string;
    key: "PENDING" | "PARTIAL" | "PAID" | "REFUNDED";
    icon: React.ElementType;
    iconColor: string;
    bg: string;
}

const BUCKETS: PaymentBucket[] = [
    { label: "Paid", key: "PAID", icon: CheckCircle2, iconColor: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Pending", key: "PENDING", icon: Clock, iconColor: "text-amber-500", bg: "bg-amber-50" },
    { label: "Partial", key: "PARTIAL", icon: CreditCard, iconColor: "text-blue-500", bg: "bg-blue-50" },
    { label: "Refunded", key: "REFUNDED", icon: AlertCircle, iconColor: "text-slate-400", bg: "bg-slate-50" },
];

interface PaymentStatusSnapshotProps {
    /**
     * Today's appointment list items -> payment_status is on AppointmentListItem.
     * No billing API exists yet; this derives counts from appointment data.
     */
    appointments: AppointmentListItem[];
    isLoading?: boolean;
}

export default function PaymentStatusSnapshot({
    appointments,
    isLoading,
}: PaymentStatusSnapshotProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
                ))}
            </div>
        );
    }

    const counts = BUCKETS.reduce(
        (acc, b) => {
            acc[b.key] = appointments.filter((a) => a.payment_status === b.key).length;
            return acc;
        },
        {} as Record<PaymentBucket["key"], number>
    );

    const total = appointments.length;

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
                {BUCKETS.map((b) => {
                    const Icon = b.icon;
                    const count = counts[b.key];
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;

                    return (
                        <div
                            key={b.key}
                            className="flex items-center gap-2.5 rounded-xl border border-slate-100 px-3 py-2.5"
                        >
                            <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", b.bg)}>
                                <Icon className={cn("h-3.5 w-3.5", b.iconColor)} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    {b.label}
                                </p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-lg font-black font-mono text-slate-800 leading-none">
                                        {count}
                                    </span>
                                    <span className="text-[10px] text-slate-400">{pct}%</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Note: billing module not yet available */}
            <p className="text-[10px] text-slate-400 text-center px-2">
                Based on appointment payment status ·{" "}
                <span className="font-semibold">Revenue totals coming with billing module</span>
            </p>
        </div>
    );
}