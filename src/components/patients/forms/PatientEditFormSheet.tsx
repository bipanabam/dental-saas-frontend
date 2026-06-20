"use client";

import React, { useState, useEffect } from "react";
import { Plus, UserPlus } from "lucide-react";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User, Phone, Clipboard, Pencil } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import {
    patientCreateFormSchema,
    type PatientUpdateInputs,
    PatientCategoryEnum,
    BloodGroupEnum,
} from "@/lib/schemas/patient";

import { useUpdatePatient } from "@/hooks/patients/use-update-patient";
import type { PatientUpdate } from "@/lib/api";


export default function PatientEditFormSheet({
    patient,
    open,
    onOpenChange,
}: any) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Pencil className="h-5 w-5 text-brand-700" />
                        Edit Profile
                    </DialogTitle>
                </DialogHeader>

                {patient && (
                    <PatientEditForm
                        patient={patient}
                        onSuccess={() => onOpenChange(false)}
                        onCancel={() => onOpenChange(false)}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}


type Props = {
    patient: any,
    onSuccess: () => void;
    onCancel: () => void;
};

const BLOOD_GROUPS = BloodGroupEnum.options.map((v) => ({
    value: v,
    label: v,
}));

const PATIENT_CATEGORIES = PatientCategoryEnum.options.map((v) => ({
    value: v,
    label: v
        .toLowerCase()
        .replace("_", " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
}));

const PatientEditForm = ({ onSuccess, onCancel, patient }: Props) => {
    const updatePatient = useUpdatePatient(patient.id);
    console.log(patient.gender);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PatientUpdate>({
        values: patient
            ? {
                first_name: patient.first_name ?? "",
                last_name: patient.last_name ?? "",
                phone: patient.phone ?? "",
                email: patient.email ?? "",
                address: patient.address ?? "",
                gender: patient.gender ?? "OTHER",
                category: patient.category ?? "REGULAR",
                blood_group: patient.blood_group ?? null,
                date_of_birth:
                    patient.date_of_birth?.split("T")[0] ?? "",
            }
            : undefined,
    });

    async function onSubmit(values: PatientUpdate) {
        const clean = Object.fromEntries(
            Object.entries(values)
                .map(([k, v]) => [
                    k,
                    v === "" ? undefined : v,
                ])
                .filter(([, v]) => v !== undefined)
        );

        await updatePatient.mutateAsync(clean);
        onSuccess();
    }

    const disabled = isSubmitting || updatePatient.isPending;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto p-1">

            {/* SECTION 1: CORE IDENTITY */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Demographics & Identity
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="First Name" error={errors.first_name?.message} required>
                        <Input {...register("first_name")} disabled={disabled} placeholder="e.g. John" />
                    </Field>

                    <Field label="Last Name" error={errors.last_name?.message} required>
                        <Input {...register("last_name")} disabled={disabled} placeholder="e.g. Doe" />
                    </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Date of Birth" error={errors.date_of_birth?.message} required>
                        <Input type="date" {...register("date_of_birth")} disabled={disabled} className="block w-full" />
                    </Field>

                    <Field
                        label="Gender"
                        error={errors.gender?.message}
                        required
                    >
                        <Controller
                            control={control}
                            name="gender"
                            render={({ field }) => (
                                <Select
                                    value={field.value ?? "OTHER"}
                                    onValueChange={field.onChange}
                                    disabled={disabled}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="MALE">Male</SelectItem>
                                        <SelectItem value="FEMALE">Female</SelectItem>
                                        <SelectItem value="OTHER">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </Field>
                </div>
            </div>

            {/* SECTION 2: CONTACT & TRIAGE LOCATION */}
            <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Contact & Location
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Phone Number" error={errors.phone?.message} required>
                        <Input placeholder="+977..." {...register("phone")} disabled={disabled} />
                    </Field>

                    <Field label="Email Address" error={errors.email?.message}>
                        <Input type="email" placeholder="name@example.com (Optional)" {...register("email")} disabled={disabled} />
                    </Field>
                </div>

                <Field label="Residential Address" error={errors.address?.message}>
                    <Textarea rows={2} placeholder="Street address, city, ward number..." {...register("address")} disabled={disabled} className="resize-none" />
                </Field>
            </div>

            {/* SECTION 3: CLINICAL RECORD DATA */}
            <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Clipboard className="h-4 w-4 text-slate-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Clinical Metadata
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Blood Group">
                        <Controller
                            control={control}
                            name="blood_group"
                            render={({ field }) => (
                                <Select
                                    value={field.value || "none"}
                                    disabled={disabled}
                                    onValueChange={(v) =>
                                        field.onChange(
                                            v === "none"
                                                ? null
                                                : v
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Optional Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Not Specified</SelectItem>
                                        {BLOOD_GROUPS.map((bg) => (
                                            <SelectItem key={bg.value} value={bg.value}>
                                                {bg.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </Field>

                    <Field label="Patient Category" error={errors.category?.message} required>
                        <Controller
                            control={control}
                            name="category"
                            render={({ field }) => (
                                <Select 
                                    value={field.value ?? "none"}
                                    onValueChange={(v) =>
                                        field.onChange(
                                            v === "none"
                                                ? null
                                                : v
                                        )
                                    }
                                    disabled={disabled}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PATIENT_CATEGORIES.map((item) => (
                                            <SelectItem key={item.value} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </Field>
                </div>
            </div>

            {/* ACTION BLOCK */}
            <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={disabled} className="text-slate-500 hover:text-slate-800">
                    Cancel
                </Button>

                <Button type="submit" disabled={disabled} className="min-w-30">
                    {disabled ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        "Update"
                    )}
                </Button>
            </div>
        </form>
    );
}

const Field = ({
    label,
    error,
    required,
    children,
}: {
    label: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
}) => {
    return (
        <div className="space-y-1.5 w-full">
            <Label className="text-xs font-semibold text-slate-700 flex items-center gap-0.5">
                {label}
                {required && <span className="text-red-500 font-bold">*</span>}
            </Label>

            {children}

            {error ? (
                <p className="text-[11px] font-medium text-red-500 mt-1 animate-in fade-in-50 duration-150">
                    {error}
                </p>
            ) : null}
        </div>
    );
}