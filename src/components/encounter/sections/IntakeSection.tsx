"use client";

import { useState, useEffect } from "react";
import { HeartPulse, Thermometer, Activity, Weight, Wind, MessageSquare } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { useUpdateEncounter } from "@/hooks/encounter/use-encounter-workflow";

import type { EncounterDetail } from "@/lib/api";

type Props = {
    encounter: EncounterDetail;
    appointmentId: string;
};

type FormState = {
    chief_complaint: string;
    bp_systolic: string;
    bp_diastolic: string;
    pulse_rate: string;
    temperature: string;
    weight_kg: string;
    spo2: string;
};

function toFormState(e: EncounterDetail): FormState {
    return {
        chief_complaint: e.chief_complaint ?? "",
        bp_systolic: e.bp_systolic?.toString() ?? "",
        bp_diastolic: e.bp_diastolic?.toString() ?? "",
        pulse_rate: e.pulse_rate?.toString() ?? "",
        temperature: e.temperature?.toString() ?? "",
        weight_kg: e.weight_kg?.toString() ?? "",
        spo2: e.spo2?.toString() ?? "",
    };
}

export default function IntakeSection({ encounter, appointmentId }: Props) {
    const [form, setForm] = useState<FormState>(() => toFormState(encounter));
    const updateEncounter = useUpdateEncounter(appointmentId);

    // Re-sync local form if the underlying encounter changes from elsewhere
    useEffect(() => {
        if (!updateEncounter.isPending) {
            setForm(toFormState(encounter));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [encounter.updated_at]);

    const isDirty =
        JSON.stringify(form) !== JSON.stringify(toFormState(encounter));

    const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value }));

    const handleSave = async () => {
        await updateEncounter.mutateAsync({
            encounterId: encounter.id,
            payload: {
                chief_complaint: form.chief_complaint || undefined,
                bp_systolic: form.bp_systolic ? Number(form.bp_systolic) : undefined,
                bp_diastolic: form.bp_diastolic ? Number(form.bp_diastolic) : undefined,
                pulse_rate: form.pulse_rate ? Number(form.pulse_rate) : undefined,
                temperature: form.temperature ? Number(form.temperature) : undefined,
                weight_kg: form.weight_kg ? Number(form.weight_kg) : undefined,
                spo2: form.spo2 ? Number(form.spo2) : undefined,
            },
        });
    };

    return (
        <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-800">Intake</h3>
                    {isDirty && (
                        <span className="text-xs font-semibold text-amber-600">Unsaved changes</span>
                    )}
                </div>

                {/* Chief complaint */}
                <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                        Chief Complaint
                    </Label>
                    <Textarea
                        value={form.chief_complaint}
                        onChange={set("chief_complaint")}
                        placeholder="Patient's reported concern..."
                        className="bg-white"
                    />
                </div>

                {/* Vitals grid */}
                <div className="space-y-3">

                    <Label className="text-xs font-bold text-slate-600">
                        Vitals
                    </Label>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <VitalField
                            icon={HeartPulse}
                            label="Blood Pressure"
                        >
                            <div className="grid grid-cols-[1fr_auto_1fr] gap-2">
                                <Input
                                    type="number"
                                    value={form.bp_systolic}
                                    onChange={set("bp_systolic")}
                                    placeholder="120"
                                />

                                <div className="flex items-center text-slate-400">
                                    /
                                </div>

                                <Input
                                    type="number"
                                    value={form.bp_diastolic}
                                    onChange={set("bp_diastolic")}
                                    placeholder="80"
                                />
                            </div>
                        </VitalField>

                        <VitalInput
                            icon={Activity}
                            label="Pulse"
                            suffix="bpm"
                            value={form.pulse_rate}
                            onChange={set("pulse_rate")}
                        />

                        <VitalInput
                            icon={Thermometer}
                            label="Temperature"
                            suffix="°F"
                            value={form.temperature}
                            onChange={set("temperature")}
                        />

                        <VitalInput
                            icon={Weight}
                            label="Weight"
                            suffix="kg"
                            value={form.weight_kg}
                            onChange={set("weight_kg")}
                        />

                        <VitalInput
                            icon={Wind}
                            label="SpO₂"
                            suffix="%"
                            value={form.spo2}
                            onChange={set("spo2")}
                        />

                    </div>

                </div>

                <div className="flex justify-end">
                    <Button
                        onClick={handleSave}
                        disabled={!isDirty || updateEncounter.isPending}
                        className="rounded-xl bg-brand-600"
                    >
                        {updateEncounter.isPending ? "Saving..." : "Save Intake"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

const VitalField = ({
    icon: Icon,
    label,
    children,
}: any) => {
    return (
        <div className="space-y-2">

            <Label className="flex items-center gap-2 text-xs text-slate-500">
                <Icon className="h-3.5 w-3.5" />
                {label}
            </Label>
            {children}

        </div>
    );
}

const VitalInput = ({
    icon,
    label,
    suffix,
    value,
    onChange,
}: any) => {
    const Icon = icon;

    return (
        <VitalField
            icon={Icon}
            label={label}
        >
            <div className="relative">

                <Input
                    value={value}
                    onChange={onChange}
                    type="number"
                    className="pr-12"
                />

                <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"
                >
                    {suffix}
                </span>

            </div>
        </VitalField>
    );
}