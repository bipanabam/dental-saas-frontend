"use client";

import { useForm, Controller } from "react-hook-form";
import { Loader2, User, Stethoscope } from "lucide-react";

import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select";

import { useUpdateUserProfile } from "@/hooks/users/use-staffs-mutations";
import type { GenderEnum } from "@/lib/api";

type ProfileData = {
    id?: string;
    bio?: string | null;
    gender?: GenderEnum | null;
    date_of_birth?: string | null;
    address?: string | null;
    specialization?: string | null;
    nmc_reg_no?: string | null;
    qualification?: string | null;
    experience_years?: number | null;
    consultation_fee?: number | null;
};

type Props = {
    userId: string;
    username: string;
    role: string;
    profile?: ProfileData | null;
    open: boolean;
    onOpenChange: (v: boolean) => void;
};

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">{label}</Label>
            {children}
        </div>
    );
}

export default function EditProfileDialog({
    userId,
    username,
    role,
    profile,
    open,
    onOpenChange,
}: Props) {
    const update = useUpdateUserProfile(userId);
    const isDoctor = role.toLowerCase() === "doctor";

    const { register, control, handleSubmit, formState: { isDirty, isSubmitting } } =
        useForm({
            defaultValues: {
                bio: profile?.bio ?? "",
                gender: profile?.gender ?? "",
                date_of_birth: profile?.date_of_birth
                    ? new Date(profile.date_of_birth).toISOString().split("T")[0]
                    : "",
                address: profile?.address ?? "",
                specialization: profile?.specialization ?? "",
                nmc_reg_no: profile?.nmc_reg_no ?? "",
                qualification: profile?.qualification ?? "",
                experience_years: profile?.experience_years ?? "",
                consultation_fee: profile?.consultation_fee ?? "",
            },
        });

    const disabled = isSubmitting || update.isPending;

    const onSubmit = async (values: any) => {
        await update.mutateAsync({
            bio: values.bio || null,
            gender: values.gender || null,
            date_of_birth: values.date_of_birth
                ? new Date(values.date_of_birth).toISOString()
                : null,
            address: values.address || null,
            specialization: isDoctor ? values.specialization || null : null,
            nmc_reg_no: isDoctor ? values.nmc_reg_no || null : null,
            qualification: isDoctor ? values.qualification || null : null,
            experience_years: isDoctor && values.experience_years
                ? Number(values.experience_years)
                : null,
            consultation_fee: isDoctor && values.consultation_fee
                ? Number(values.consultation_fee)
                : null,
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-brand-700" />
                        Edit Profile
                    </DialogTitle>
                    <DialogDescription>
                        Update profile information for{" "}
                        <span className="font-semibold text-slate-700">{username}</span>.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-1">

                    {/* Universal */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                            <User className="h-4 w-4 text-slate-400" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Personal Info
                            </h3>
                        </div>

                        <Field label="Bio">
                            <Textarea
                                {...register("bio")}
                                disabled={disabled}
                                placeholder="Short bio..."
                                rows={2}
                                className="bg-white resize-none"
                            />
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Gender">
                                <Controller
                                    control={control}
                                    name="gender"
                                    render={({ field }) => (
                                        <Select
                                            value={field.value || ""}
                                            onValueChange={field.onChange}
                                            disabled={disabled}
                                        >
                                            <SelectTrigger className="bg-white">
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

                            <Field label="Date of Birth">
                                <Input
                                    type="date"
                                    {...register("date_of_birth")}
                                    disabled={disabled}
                                    className="bg-white"
                                />
                            </Field>
                        </div>

                        <Field label="Address">
                            <Textarea
                                {...register("address")}
                                disabled={disabled}
                                placeholder="Residential address..."
                                rows={2}
                                className="bg-white resize-none"
                            />
                        </Field>
                    </div>

                    {/* Doctor-specific */}
                    {isDoctor && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-brand-100 pb-2">
                                <Stethoscope className="h-4 w-4 text-brand-500" />
                                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-600">
                                    Clinical Info
                                </h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Specialization">
                                    <Input
                                        {...register("specialization")}
                                        disabled={disabled}
                                        placeholder="e.g. Orthodontics"
                                        className="bg-white"
                                    />
                                </Field>

                                <Field label="NMC Reg. No.">
                                    <Input
                                        {...register("nmc_reg_no")}
                                        disabled={disabled}
                                        placeholder="12345"
                                        className="bg-white"
                                    />
                                </Field>

                                <Field label="Qualification">
                                    <Input
                                        {...register("qualification")}
                                        disabled={disabled}
                                        placeholder="BDS, MDS..."
                                        className="bg-white"
                                    />
                                </Field>

                                <Field label="Experience (years)">
                                    <Input
                                        type="number"
                                        {...register("experience_years")}
                                        disabled={disabled}
                                        placeholder="5"
                                        className="bg-white"
                                    />
                                </Field>

                                <Field label="Consultation Fee (Rs)">
                                    <Input
                                        type="number"
                                        {...register("consultation_fee")}
                                        disabled={disabled}
                                        placeholder="500"
                                        className="bg-white"
                                    />
                                </Field>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            disabled={disabled}
                            className="text-slate-500"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={disabled || !isDirty}
                            className="min-w-32 bg-brand-700"
                        >
                            {disabled ? (
                                <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving...</>
                            ) : (
                                "Save Profile"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}