import { useState } from "react";
import { Hash, CreditCard, Info, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

import type { AppointmentDetail } from "@/lib/api";

// Helpers
function fmtDate(dt?: string | null) {
    if (!dt) return "—";
    return new Date(dt).toLocaleDateString(undefined, {
        month: "short", day: "numeric", year: "numeric",
    });
}

function fmtTime(dt?: string | null) {
    if (!dt) return "—";
    return new Date(dt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Rail section wrapper
// Thin divider-based sections rather than nested cards
function RailSection({
    icon: Icon,
    title,
    children,
    collapsible = false,
}: {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
    collapsible?: boolean;
}) {
    const [open, setOpen] = useState(!collapsible);

    return (
        <div className="border-b border-slate-100 last:border-0">
            <button
                className={cn(
                    "w-full flex items-center justify-between py-3 text-left",
                    collapsible ? "cursor-pointer" : "cursor-default"
                )}
                onClick={() => collapsible && setOpen((o) => !o)}
                disabled={!collapsible}
            >
                <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                        {title}
                    </span>
                </div>
                {collapsible && (
                    open
                        ? <ChevronUp className="h-3.5 w-3.5 text-slate-300" />
                        : <ChevronDown className="h-3.5 w-3.5 text-slate-300" />
                )}
            </button>

            {open && (
                <div className="pb-3">
                    {children}
                </div>
            )}
        </div>
    );
}


// Field row
function FieldRow({ label, value, mono = false }: { label: string; value?: string | null; mono?: boolean }) {
    if (!value) return null;
    return (
        <div className="flex items-start justify-between gap-2 py-1">
            <span className="text-[11px] text-slate-400 shrink-0">{label}</span>
            <span className={cn("text-[11px] font-semibold text-slate-700 text-right", mono && "font-mono")}>
                {value}
            </span>
        </div>
    );
}

// Payment status
const PAYMENT_STYLE: Record<string, { bg: string; text: string; label: string }> = {
    PAID: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Paid" },
    PENDING: { bg: "bg-amber-50", text: "text-amber-700", label: "Pending" },
    PARTIAL: { bg: "bg-blue-50", text: "text-blue-700", label: "Partial" },
    REFUNDED: { bg: "bg-slate-50", text: "text-slate-600", label: "Refunded" },
};


// Side rail
interface AppointmentSideRailProps {
    appointment: AppointmentDetail;
    /** Queue data: only present on checked-in appointments */
    queueEntry?: {
        token_number?: number | null;
        status?: string | null;
        estimated_wait_mins?: number | null;
    } | null;
    totalCost?: number;
}

export default function AppointmentSideRail({
    appointment,
    queueEntry,
    totalCost,
}: AppointmentSideRailProps) {
    const payment = PAYMENT_STYLE[appointment.payment_status ?? "PENDING"] ?? PAYMENT_STYLE["PENDING"];

    return (
        <div className="bg-white border border-slate-100 rounded-2xl px-4">

            {/* Queue / arrival -> only when queued */}
            {queueEntry?.token_number && (
                <RailSection icon={Hash} title="Queue">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                            <span className="text-lg font-black font-mono text-brand-700">
                                {queueEntry.token_number}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-700">
                                Token #{queueEntry.token_number}
                            </p>
                            {queueEntry.estimated_wait_mins != null && (
                                <p className="text-[11px] text-slate-400">
                                    ~{queueEntry.estimated_wait_mins}m wait
                                </p>
                            )}
                        </div>
                    </div>
                </RailSection>
            )}

            {/* Payment */}
            <RailSection icon={CreditCard} title="Payment">
                <div className="space-y-2">
                    <div className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold",
                        payment.bg, payment.text
                    )}>
                        {payment.label}
                    </div>
                    {totalCost != null && totalCost > 0 && (
                        <FieldRow label="Estimated total" value={`Rs ${totalCost.toLocaleString()}`} mono />
                    )}
                </div>
            </RailSection>

            {/* Metadata -> collapsed by default to keep the rail light */}
            <RailSection icon={Info} title="Details" collapsible>
                <div className="space-y-0.5">
                    <FieldRow
                        label="Type"
                        value={appointment.appointment_type?.toLocaleUpperCase().replace(/_/g, " ")}
                    />
                    <FieldRow
                        label="Source"
                        value={appointment.source?.toLocaleUpperCase().replace(/_/g, " ")}
                    />
                    <FieldRow
                        label="Scheduled"
                        value={fmtDate(appointment.appointment_date)}
                    />
                    <FieldRow
                        label="Time"
                        value={fmtTime(appointment.appointment_date)}
                    />
                    {appointment.duration_minutes && (
                        <FieldRow
                            label="Duration"
                            value={`${appointment.duration_minutes} min`}
                        />
                    )}
                    <FieldRow label="Created" value={fmtDate(appointment.created_at)} />
                    <FieldRow label="Updated" value={fmtDate(appointment.updated_at)} />
                </div>
            </RailSection>
        </div>
    );
}