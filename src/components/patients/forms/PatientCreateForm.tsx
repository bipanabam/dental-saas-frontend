"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User, Phone, Clipboard } from "lucide-react";

import {
  patientCreateFormSchema,
  type PatientCreateFormInput,
  type PatientCreateInputs,
  PatientCategoryEnum,
  BloodGroupEnum,
} from "@/lib/schemas/patient";

import { useCreatePatient } from "@/hooks/patients/use-create-patient";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
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

export default function PatientCreateForm({ onSuccess, onCancel }: Props) {
  const createPatient = useCreatePatient();

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PatientCreateFormInput, any, PatientCreateInputs>({
    resolver: zodResolver(patientCreateFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      email: undefined,
      address: "",
      allergies: "",
      gender: "OTHER",
      category: "REGULAR",
      blood_group: null,
      date_of_birth: "",
    },
  });

  async function onSubmit(values: PatientCreateInputs) {
    const clean = Object.fromEntries(
      Object.entries(values).filter(([, v]) => v !== undefined)
    );

    const response = await createPatient.mutateAsync(clean as PatientCreateInputs);
    reset();
    onSuccess();
  }

  const disabled = isSubmitting || createPatient.isPending;

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

          <Field label="Gender" error={errors.gender?.message} required>
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
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
                <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
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

        <Field label="Allergies & Medical Alerts" error={errors.allergies?.message}>
          <Textarea
            rows={2}
            placeholder="e.g., Penicillin, Latex, High Blood Pressure (Leave blank if none)"
            {...register("allergies")}
            disabled={disabled}
            className="resize-none border-amber-200 focus-visible:ring-amber-500 bg-amber-50/10 placeholder:text-slate-400"
          />
        </Field>
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
              Saving...
            </>
          ) : (
            "Register Patient"
          )}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
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