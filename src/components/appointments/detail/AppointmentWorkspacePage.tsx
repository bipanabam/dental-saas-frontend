"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionLoader } from "@/components/base/loading-view";

import { useAppointmentDetail } from "@/hooks/appointments/use-appointments";
import { useEncounterByAppointmentId } from "@/hooks/encounter/use-encounter";
import { useStartAppointment } from "@/hooks/appointments/use-appointment-workflow";

import AppointmentHeroBar from "./AppointmentHeroBar";
import AppointmentTimeline from "./AppointmentTimeline";
import PlannedProceduresSection from "./PlannedProceduresSection";
import ClinicalSnapshotSection from "./ClinicalSnapshotSection";
import AppointmentSideRail from "./AppointmentSideRail";

interface AppointmentWorkspacePageProps {
    appointmentId: string;
}

export default function AppointmentWorkspacePage({
    appointmentId,
}: AppointmentWorkspacePageProps) {
    const router = useRouter();

    // Data
    const {
        data: appointment,
        isLoading: apptLoading,
        isError,
    } = useAppointmentDetail(appointmentId);

    // Only fetch encounter once appointment is in a clinical state
    const needsEncounter =
        appointment?.status === "IN_PROGRESS" ||
        appointment?.status === "COMPLETED";

    const { data: encounter, isLoading: encounterLoading } =
        useEncounterByAppointmentId(needsEncounter ? appointmentId : undefined);

    const startMutation = useStartAppointment();

    // Derived: total planned cost (for side rail)
    const totalPlannedCost = useMemo(() => {
        return (appointment?.procedures ?? []).reduce(
            (sum, p) => sum + (p.estimated_cost ?? 0),
            0
        );
    }, [appointment?.procedures]);

    // Queue entry — present on today's appointments
    // AppointmentDetail doesn't directly include queue info; it comes from
    // TodaysAppointmentListItem. For now we pass null — wire this when you
    // add a queue lookup or extend AppointmentDetail to include queue status.
    const queueEntry = null;

    // Handlers
    const handleStart = async () => {
        await startMutation.mutateAsync(appointmentId);
        router.push(`/appointments/${appointmentId}/encounter`);
    };

    // Loading / error
    if (apptLoading) return <SectionLoader message="Loading appointment…" />;

    if (isError || !appointment) {
        return (
            <div className="text-sm text-slate-500 py-16 text-center">
                Appointment not found or could not be loaded.
            </div>
        );
    }

    const showClinicalSection =
        (appointment.status === "IN_PROGRESS" || appointment.status === "COMPLETED") &&
        !encounterLoading &&
        encounter;

    return (
        <div className="space-y-4 max-w-5xl mx-auto">

            {/* Page header */}
            <div className="flex items-center justify-between gap-4">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back
                </button>

                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400">
                        #{appointmentId.slice(0, 8).toUpperCase()}
                    </span>
                    {/* Only allow editing while still schedulable */}
                    {(appointment.status === "BOOKED" || appointment.status === "CONFIRMED") && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1.5 rounded-lg"
                            onClick={() => router.push(`/appointments/${appointmentId}/edit`)}
                        >
                            <Pencil className="h-3 w-3" />
                            Edit
                        </Button>
                    )}
                </div>
            </div>

            {/* Hero bar — always visible */}
            <AppointmentHeroBar
                appointment={appointment}
                onStart={handleStart}
            />

            {/* Timeline — always visible */}
            <AppointmentTimeline
                appointment={appointment}
                encounter={encounter ?? null}
            />

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4 items-start">

                {/* Left column: primary content */}
                <div className="space-y-4">

                    {/* Planned Procedures — always visible, primary section */}
                    <PlannedProceduresSection appointment={appointment} />

                    {/* Clinical Snapshot — only when encounter exists */}
                    {showClinicalSection && (
                        <ClinicalSnapshotSection
                            encounter={encounter!}
                            appointmentId={appointmentId}
                        />
                    )}

                    {/* Loading state for encounter */}
                    {needsEncounter && encounterLoading && (
                        <div className="bg-white border border-slate-100 rounded-2xl px-5 py-6">
                            <SectionLoader message="Loading clinical record…" />
                        </div>
                    )}
                </div>

                {/* Right rail */}
                <AppointmentSideRail
                    appointment={appointment}
                    queueEntry={queueEntry}
                    totalCost={totalPlannedCost > 0 ? totalPlannedCost : undefined}
                />
            </div>
        </div>
    );
}