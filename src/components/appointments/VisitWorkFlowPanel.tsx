"use client";

import Link from "next/link";
import {
    CalendarClock,
    Activity,
    CreditCard,
    Workflow,
    Check,
    ArrowRight,
    FolderOpen,
    ClipboardList,
    Stethoscope,
    Calendar,
    Loader2
} from "lucide-react";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SectionLoader } from "../base/loading-view";

import AppointmentActionsMenu from "./AppointmentActionsMenu";

import {
    WorkflowAction,
    AppointmentItem,
    getAvailableActions,
} from "@/lib/utils/appointment-workflow";

type SecondaryAction = "reschedule" | "follow_up" | "no_show";

const STEPS = [
    "BOOKED",
    "CONFIRMED",
    "CHECKED_IN",
    "IN_PROGRESS",
    "COMPLETED",
];

const VISIT_STATE = {
    BOOKED: {
        title: "Awaiting Confirmation",
        description:
            "Appointment created and pending operational confirmation.",
        tone: "slate",
    },
    CONFIRMED: {
        title: "Ready For Arrival",
        description:
            "Patient confirmed. Waiting for check-in at reception.",
        tone: "sky",
    },
    CHECKED_IN: {
        title: "Ready For Encounter",
        description:
            "Patient has arrived and can enter clinical assessment.",
        tone: "amber",
    },
    IN_PROGRESS: {
        title: "Encounter In Progress",
        description:
            "Clinical documentation and procedures are ongoing.",
        tone: "indigo",
    },
    COMPLETED: {
        title: "Visit Completed",
        description:
            "Encounter finalized and operational flow completed.",
        tone: "emerald",
    },
};

function formatDate(dateString?: string) {
    if (!dateString) return "N/A";
    try {
        return new Date(dateString).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    } catch {
        return dateString;
    }
}

interface VisitWorkflowPanelProps {
    appointment: any;
    loading: boolean;
    onAction?: (action: WorkflowAction, appointment: AppointmentItem) => void;
    onSecondaryAction?: (action: SecondaryAction, appointment: any) => void;
    pendingAction?: WorkflowAction;
}

export default function VisitWorkflowPanel({
    appointment,
    loading,
    onAction,
    onSecondaryAction,
    pendingAction,
}: VisitWorkflowPanelProps) {

    if (loading) {
        return <SectionLoader message="Loading visit workflow..." />;
    }

    if (!appointment) {
        return <EmptyState />;
    }

    const actions = getAvailableActions(appointment.status);

    const summary = [
        {
            icon: CalendarClock,
            label: "Date & Time",
            value: formatDate(appointment.appointment_date),
        },
        {
            icon: Activity,
            label: "Est. Duration",
            value: `${appointment.duration_minutes || 0} mins`,
        },
        {
            icon: Workflow,
            label: "Channel/Source",
            value: appointment.source || "Direct Walk-in",
        },
        {
            icon: CreditCard,
            label: "Billing Status",
            value: appointment.payment_status || "Pending",
        },
    ];

    return (
        <Card className="sticky top-6 rounded-2xl border-slate-200 shadow-md overflow-hidden bg-white w-full p-0">
            {/* Header */}
            <CardHeader className="bg-slate-50 border-b border-slate-100 p-5">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="h-11 w-11 rounded-xl bg-indigo-50 flex items-center justify-center text-brand-600 border border-indigo-100 shrink-0">
                            <Calendar className="h-6 w-6 stroke-[1.75]" />
                        </div>
                        <div className="min-w-0">
                            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Appointment Detail:
                            </CardDescription>
                            <CardTitle className="text-lg font-bold text-slate-800 truncate mt-0.5">
                                {appointment.patient?.name || "Unnamed Patient"}
                            </CardTitle>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                        <StatusBadge status={appointment.status} />

                        <AppointmentActionsMenu
                            status={appointment.status}
                            onAction={(action) =>
                                onSecondaryAction?.(action, appointment)
                            }
                        />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-5 space-y-6">

                <SummarySection
                    complaint={appointment.chief_complaint}
                    items={summary}
                />

                {!!appointment.procedures?.length && (
                    <>
                        <Separator />
                        <ProcedureSection
                            procedures={appointment.procedures}
                        />
                    </>
                )}

                <Separator />

                <JourneySection current={appointment.status} />

                <Separator />

                <CurrentStateSection status={appointment.status} />

                {(actions.length > 0 ||
                    appointment.status === "IN_PROGRESS") && (
                        <>
                            <Separator />

                            <ActionSection
                                appointment={appointment}
                                actions={actions}
                                onAction={onAction}
                                pendingAction={pendingAction}
                            />
                        </>
                    )}

            </CardContent>
        </Card>
    );
}


const SummarySection = ({ complaint, items }: any) => {
    return (
        <section className="space-y-4">
            <div>
                <SectionTitle icon={Stethoscope}>Chief Complaint</SectionTitle>
                <div className="mt-2 rounded-xl border border-amber-100 bg-amber-50/40 p-3.5 text-sm font-medium text-slate-700 leading-relaxed shadow-3xs">
                    {complaint || "No historical complaint details reported."}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {items.map((item: any) => (
                    <InfoTile key={item.label} {...item} />
                ))}
            </div>
        </section>
    );
}

const ProcedureSection = ({ procedures }: any) => {
    return (
        <section className="space-y-3">
            <SectionTitle icon={ClipboardList}>Planned Procedures</SectionTitle>

            <div className="space-y-2 max-h-50 overflow-y-auto pr-1">
                {procedures.map((p: any) => (
                    <div
                        key={p.id}
                        className="rounded-xl  border border-l-4 border-l-brand-500 border-slate-100 bg-white p-3 flex justify-between items-center gap-4 text-sm shadow-2xs hover:border-slate-200 transition-colors"
                    >
                        <div className="min-w-0">
                            <div className="font-semibold text-slate-800 truncate">
                                {p.procedure_catalog?.name || "Unlisted Treatment"}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                                <Activity className="h-3 w-3 text-slate-300" />
                                {p.estimated_duration_minutes || 0} mins duration
                            </div>
                        </div>
                        <Badge variant="secondary" className="text-xs font-bold px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 shrink-0">
                            Rs {p.estimated_cost || 0}
                        </Badge>
                    </div>
                ))}
            </div>
        </section>
    );
}

const JourneySection = ({ current }: any) => {
    const active = STEPS.indexOf(current);

    return (
        <section className="space-y-3">
            <SectionTitle icon={Workflow}>Visit Journey</SectionTitle>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                {STEPS.map((step, i) => {
                    const done = i < active;
                    const currentStep = i === active;

                    return (
                        <div key={step} className="flex gap-3 pb-3 last:pb-0">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`
                                    h-7 w-7 rounded-full border flex items-center justify-center
                                    ${done ? "bg-emerald-50 border-emerald-300 text-emerald-700" : ""}
                                    ${currentStep ? "bg-brand-600 border-brand-600 text-white" : ""}
                                    ${!done && !currentStep && "bg-white text-slate-400"}
                                `}
                                >
                                    {done ? <Check className="h-3 w-3" /> : i + 1}
                                </div>

                                {i !== STEPS.length - 1 && (
                                    <div
                                        className={`
                                        w-px flex-1 mt-1
                                        ${done ? "bg-emerald-200" : "bg-slate-200"}
                                    `}
                                    />
                                )}
                            </div>

                            <div className="pt-1">
                                <div
                                    className={`
                                    text-sm
                                    ${currentStep ? "font-semibold text-slate-900" : "text-slate-600"}
                                `}
                                >
                                    {step.replace("_", " ")}
                                </div>

                                {currentStep && (
                                    <div className="text-xs text-slate-500 mt-1">
                                        Current workflow stage
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

const CurrentStateSection = ({
    status,
}: {
    status: keyof typeof VISIT_STATE;
}) => {
    const state = VISIT_STATE[status];

    if (!state) return null;

    return (
        <section className="space-y-3">
            <SectionTitle icon={Activity}>Current State</SectionTitle>

            <div className="rounded-xl border border-brand-100 bg-brand-50/40 p-4">
                <div className="text-sm font-semibold text-slate-900">
                    {state.title}
                </div>
                <p className="mt-1 text-sm text-slate-600">
                    {state.description}
                </p>
            </div>
        </section>
    );
}

const ActionSection = ({
    appointment,
    actions,
    onAction,
    pendingAction,
}: any) => {
    const isAnyPending = !!pendingAction;

    return (
        <section className="space-y-3">
            <SectionTitle icon={ArrowRight}>Next Action</SectionTitle>

            {actions.map((act: { action: WorkflowAction; label: string }, i: number) => {
                const isThisPending = pendingAction === act.action;

                return (
                    <Button
                        key={act.action}
                        size="lg"
                        variant={i === 0 ? "default" : "outline"}
                        className={`h-14 w-full rounded-xl justify-start px-4 ${i === 0 ? "bg-brand-600" : ""}`}
                        disabled={isAnyPending}
                        onClick={() => onAction?.(act.action, appointment)}
                    >
                        <div className="flex flex-col items-start">
                            <span className="font-semibold">
                                {isThisPending ? "Processing..." : act.label}
                            </span>
                            <span className="text-xs opacity-80">
                                {i === 0 ? "Recommended next step" : "Skip ahead"}
                            </span>
                        </div>

                        {isThisPending ? (
                            <Loader2 className="ml-auto h-4 w-4 animate-spin" />
                        ) : (
                            <ArrowRight className="ml-auto h-4 w-4" />
                        )}
                    </Button>
                );
            })}

            {appointment.status === "IN_PROGRESS" && (
                <Link href={`/appointments/${appointment.id}/encounter`}>
                    <Button variant="outline" className="w-full h-12 rounded-xl">
                        <FolderOpen className="h-4 w-4" />
                        Open Encounter Workspace
                    </Button>
                </Link>
            )}
        </section>
    );
}


const InfoTile = ({ icon: Icon, label, value }: any) => {
    return (
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wide truncate">
                <Icon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                {label}
            </div>
            <div className="mt-1 text-sm font-bold text-slate-700 block truncate">
                {value}
            </div>
        </div>
    );
}

const SectionTitle = ({ icon: Icon, children }: any) => {
    return (
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 tracking-wider">
            <Icon className="h-4 w-4 text-slate-400 shrink-0" />
            {children}
        </div>
    );
}

const StatusBadge = ({ status }: any) => {
    if (!status) return null;

    let variantClasses = "bg-slate-50 text-slate-600 border-slate-200";
    if (status === "COMPLETED") variantClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (status === "IN_PROGRESS") variantClasses = "bg-indigo-50 text-indigo-700 border-indigo-200 ring-2 ring-indigo-600/5";
    if (status === "CHECKED_IN") variantClasses = "bg-amber-50 text-amber-700 border-amber-200";
    if (status === "CONFIRMED") variantClasses = "bg-sky-50 text-sky-700 border-sky-200";

    return (
        <Badge variant="outline" className={`shadow-3xs px-3 py-1 rounded-full text-xs font-bold border shrink-0 ${variantClasses}`}>
            {status.replace("_", " ")}
        </Badge>
    );
}

const EmptyState = () => {
    return (
        <Card className="rounded-2xl border-2 border-dashed border-slate-200 bg-white max-w-md w-full">
            <CardContent className="p-12 text-center flex flex-col items-center justify-center min-h-87.5">
                <div className="h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                    <Workflow className="h-7 w-7 text-slate-400 stroke-[1.5]" />
                </div>
                <div className="text-base font-bold text-slate-800">No Patient File Active</div>
                <p className="text-sm text-slate-400 max-w-60 mt-2 mx-auto leading-relaxed">
                    Select an entry from your clinical schedule queue to initialize workflow actions and log patient notes.
                </p>
            </CardContent>
        </Card>
    );
}