"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Plus,
    Clock,
    ClipboardList,
    Activity,
    Calendar,
    UserCheck,
    Tag,
    Layers,
    AlertTriangle,
    CheckCircle2,
    Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

import ProcedureCard from "./ProcedureCard";
import {
    appointmentSchema,
    type AppointmentInputs,
    type AppointmentFormInput,
    AppointmentSourceEnum,
    AppointmentTypeEnum,
} from "@/lib/schemas/appointment";

import { useDoctors } from "@/hooks/users/use-doctors";
import { useCreateAppointment } from "@/hooks/appointments/use-create-appointment";
import { useCheckAppointmentConflict } from "@/hooks/appointments/use-check-conflict";

type Props = {
    patientId: string;
    /** Pass when editing an existing appointment so it doesn't conflict with itself */
    excludeAppointmentId?: string;
};

export default function AppointmentForm({ patientId, excludeAppointmentId }: Props) {
    const router = useRouter();
    const { data: doctors, isLoading: isDoctorsLoading } = useDoctors();
    const { mutateAsync: createAppointment, isPending } = useCreateAppointment();

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<AppointmentFormInput, any, AppointmentInputs>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            patient_id: patientId,
            duration_minutes: 0,
            appointment_type: "BOOKED",
            source: "FRONT_DESK",
            procedures: [],
            chief_complaint: "",
            notes: "",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "procedures",
    });
    const procedures = watch("procedures");

    // Conflict check: watch the three scheduling fields
    const watchedDoctorId = watch("doctor_id") as string | undefined;
    const watchedDate = watch("appointment_date") as string | undefined;
    const watchedDuration = watch("duration_minutes") as number | undefined;

    const {
        data: conflictResult,
        isFetching: checkingConflict,
    } = useCheckAppointmentConflict({
        doctorId: watchedDoctorId,
        appointmentDate: watchedDate,
        durationMinutes: watchedDuration,
        excludeAppointmentId,
    });

    // Auto-calculate duration from procedures
    const { totalDuration, totalCost, procedureCount } = useMemo(() => {
        if (!procedures || procedures.length === 0) {
            return { totalDuration: 0, totalCost: 0, procedureCount: 0 };
        }
        return procedures.reduce(
            (acc, p) => {
                const dur = Number(p?.estimated_duration_minutes);
                const cost = Number(p?.estimated_cost);
                return {
                    totalDuration: acc.totalDuration + (Number.isFinite(dur) ? dur : 0),
                    totalCost: acc.totalCost + (Number.isFinite(cost) ? cost : 0),
                    procedureCount: acc.procedureCount + 1,
                };
            },
            { totalDuration: 0, totalCost: 0, procedureCount: 0 },
        );
    }, [procedures]);

    useEffect(() => {
        if (totalDuration > 0) {
            setValue("duration_minutes", totalDuration, {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    }, [totalDuration, setValue]);

    async function onSubmit(values: AppointmentInputs) {
        const cleanPayload = Object.fromEntries(
            Object.entries(values).filter(([, val]) => val !== "" && val !== undefined),
        ) as AppointmentInputs;

        try {
            const created = await createAppointment(cleanPayload);
            router.push(`/appointments/${created?.id ?? ""}`);
        } catch {
            // handled by mutation hook
        }
    }

    // Derived conflict UI state
    // Only show the availability indicator once all three fields have values.
    const hasSchedulingInputs = Boolean(
        watchedDoctorId && watchedDate && watchedDuration && watchedDuration > 0
    );

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto p-1">

            {/* SECTION I: SCHEDULING DISPATCH */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                    <Calendar className="h-4 w-4 text-brand-700" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                        Scheduling & Assignment
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Practitioner Selection */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                            <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                            Assigned Dentist <span className="text-red-500">*</span>
                        </Label>
                        <Controller
                            control={control}
                            name="doctor_id"
                            render={({ field }) => (
                                <Select
                                    value={field.value ?? undefined}
                                    onValueChange={field.onChange}
                                    disabled={isDoctorsLoading}
                                >
                                    <SelectTrigger className="border-slate-200 focus:ring-brand-500 h-10 text-sm bg-white">
                                        <SelectValue
                                            placeholder={isDoctorsLoading ? "Loading providers..." : "Select Provider"}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {doctors?.length ? (
                                            doctors.map((doctor: any) => (
                                                <SelectItem key={doctor.id} value={doctor.id}>
                                                    {doctor.username ?? doctor.email}
                                                    {doctor.specialization ? ` (${doctor.specialization})` : ""}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            !isDoctorsLoading && (
                                                <div className="px-2 py-1.5 text-xs text-slate-400">
                                                    No providers available
                                                </div>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.doctor_id?.message && (
                            <p className="text-[11px] text-red-500 font-medium mt-1">{errors.doctor_id.message}</p>
                        )}
                    </div>

                    {/* Date & Time */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">
                            Appointment Date & Time <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="datetime-local"
                            className="border-slate-200 focus-visible:ring-brand-500 h-10 text-sm bg-white"
                            {...register("appointment_date")}
                        />
                        {errors.appointment_date?.message && (
                            <p className="text-[11px] text-red-500 font-medium mt-1">{errors.appointment_date.message}</p>
                        )}
                    </div>

                    {/* Duration -> auto-filled from procedures */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            Total Duration (Mins)
                        </Label>
                        <Input
                            type="number"
                            className="border-slate-200 focus-visible:ring-brand-500 h-10 text-sm font-mono font-bold bg-slate-50 text-slate-700"
                            placeholder="0"
                            {...register("duration_minutes", { valueAsNumber: true })}
                        />
                        {errors.duration_minutes?.message && (
                            <p className="text-[11px] text-red-500 font-medium mt-1">{errors.duration_minutes.message}</p>
                        )}
                    </div>
                </div>

                {/* Conflict / availability indicator */}
                {hasSchedulingInputs && (
                    <ConflictBanner
                        isChecking={checkingConflict}
                        hasConflict={conflictResult?.has_conflict ?? false}
                        conflictingPatient={conflictResult?.conflicting_patient_name}
                        conflictingTime={conflictResult?.conflicting_time}
                        overlapMinutes={conflictResult?.overlap_minutes}
                    />
                )}

                {/* Secondary Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                            <Layers className="h-3.5 w-3.5 text-slate-400" />
                            Appointment Type
                        </Label>
                        <Controller
                            control={control}
                            name="appointment_type"
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="border-slate-200 focus:ring-brand-500 h-10 text-sm bg-white">
                                        <SelectValue placeholder="Select classification type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {AppointmentTypeEnum.options.map((opt) => (
                                            <SelectItem key={opt} value={opt} className="capitalize">
                                                {opt.toLowerCase().replace(/_/g, " ")}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.appointment_type?.message && (
                            <p className="text-[11px] text-red-500 font-medium mt-1">{errors.appointment_type.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                            <Tag className="h-3.5 w-3.5 text-slate-400" />
                            Intake Channel Source
                        </Label>
                        <Controller
                            control={control}
                            name="source"
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="border-slate-200 focus:ring-brand-500 h-10 text-sm bg-white">
                                        <SelectValue placeholder="Select discovery channel" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {AppointmentSourceEnum.options.map((opt) => (
                                            <SelectItem key={opt} value={opt} className="capitalize">
                                                {opt.toLowerCase().replace(/_/g, " ")}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.source?.message && (
                            <p className="text-[11px] text-red-500 font-medium mt-1">{errors.source.message}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* SECTION II: CLINICAL INTAKE */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                    <ClipboardList className="h-4 w-4 text-slate-400" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                        Clinical Intake Profile
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">Chief Complaint</Label>
                        <Textarea
                            placeholder="e.g., Acute localized pain in upper left jaw, tooth sensitivity to cold liquids..."
                            rows={3}
                            className="border-slate-200 text-xs font-medium resize-none placeholder:text-slate-400 focus-visible:ring-brand-500"
                            {...register("chief_complaint")}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">General Scheduling Notes</Label>
                        <Textarea
                            placeholder="e.g., Patient requires topical gel pre-injection, prefers morning sessions..."
                            rows={3}
                            className="border-slate-200 text-xs font-medium resize-none placeholder:text-slate-400 focus-visible:ring-brand-500"
                            {...register("notes")}
                        />
                    </div>
                </div>
            </div>

            {/* SECTION III: PLANNED PROCEDURES */}
            <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 px-1">
                    <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-brand-700" />
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                                Planned Procedures
                            </h3>
                            <span className="text-[11px] text-slate-400 font-medium block">
                                Link ongoing operations or diagnostic tracking cards directly.
                            </span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            append({
                                procedure_catalog_id: "",
                                tooth_numbers: [],
                                estimated_cost: null,
                                estimated_duration_minutes: 30,
                                notes: "",
                            })
                        }
                        className="border-brand-200 hover:border-brand-300 text-brand-700 hover:bg-brand-50/50 rounded-xl h-8 font-bold text-xs gap-1 px-3 transition-colors"
                    >
                        <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                        Add Procedure
                    </Button>
                </div>

                {fields.length === 0 ? (
                    <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50/40 select-none">
                        <p className="text-xs font-bold text-slate-400 italic">
                            No specific clinical procedures mapped to this appointment slot yet.
                        </p>
                        <p className="text-[10px] text-slate-400/80 font-medium mt-0.5">
                            Click "Add Procedure" above to open structural charting parameters.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {fields.map((field, index) => (
                            <ProcedureCard
                                key={field.id}
                                index={index}
                                control={control}
                                remove={remove}
                                setValue={setValue}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Treatment summary */}
            {procedureCount > 0 && (
                <div className="bg-brand-50/60 border border-brand-100 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
                            Treatment Summary
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {procedureCount} procedure{procedureCount > 1 ? "s" : ""} planned
                        </p>
                    </div>
                    <div className="flex gap-6 text-right">
                        <div>
                            <p className="text-[10px] font-bold uppercase text-slate-400">Duration</p>
                            <p className="text-sm font-black text-slate-800">{totalDuration} min</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase text-slate-400">Est. Cost</p>
                            <p className="text-sm font-black text-slate-800">
                                Rs {totalCost.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Submit */}
            <div className="flex justify-end pt-2">
                <Button
                    type="submit"
                    disabled={isSubmitting || isPending}
                    className="bg-brand-700 hover:bg-brand-800 text-white min-w-45 h-11 text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-all"
                >
                    {isSubmitting || isPending ? "Processing..." : "Create Appointment"}
                </Button>
            </div>
        </form>
    );
}

// ConflictBanner
// Extracted so the form's JSX stays readable.
// Three states: checking (spinner), conflict (amber warning), clear (green tick).
interface ConflictBannerProps {
    isChecking: boolean;
    hasConflict: boolean;
    conflictingPatient?: string | null;
    conflictingTime?: string | null;
    overlapMinutes?: number | null;
}

function ConflictBanner({
    isChecking,
    hasConflict,
    conflictingPatient,
    conflictingTime,
    overlapMinutes,
}: ConflictBannerProps) {
    if (isChecking) {
        return (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100">
                <Loader2 className="h-3.5 w-3.5 text-slate-400 animate-spin shrink-0" />
                <span className="text-[11px] text-slate-400 font-medium">
                    Checking doctor availability…
                </span>
            </div>
        );
    }

    if (hasConflict) {
        const timeStr = conflictingTime
            ? new Date(conflictingTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            })
            : null;

        return (
            <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-amber-50 border border-amber-200">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                    <p className="text-[11px] font-bold text-amber-800">
                        Scheduling conflict detected
                    </p>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                        {conflictingPatient
                            ? `${conflictingPatient} is already booked with this doctor`
                            : "This doctor already has an appointment"}
                        {timeStr && ` at ${timeStr}`}
                        {overlapMinutes != null && overlapMinutes > 0
                            ? ` — ${overlapMinutes}m overlap.`
                            : "."}
                        {" "}You can still proceed if intended.
                    </p>
                </div>
            </div>
        );
    }

    // Clear -> only show when we have a result (not on initial empty state)
    return (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span className="text-[11px] text-emerald-700 font-medium">
                Doctor is available at this time.
            </span>
        </div>
    );
}