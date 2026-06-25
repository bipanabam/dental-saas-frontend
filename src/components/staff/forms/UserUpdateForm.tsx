"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User, Phone, Shield, ToggleLeft } from "lucide-react";

import {
    userUpdateFormSchema,
    type UserUpdateFormInput,
    type UserUpdateInputs,
    RoleEnum,
} from "@/lib/schemas/user";

import { useUpdateUser } from "@/hooks/users/use-staffs-mutations";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select";

import { NepalPhoneInput } from "@/components/shared/form/NepalPhoneInput";

type ExistingUser = {
    id: string;
    email: string;
    username: string;
    phone_number?: string | null;
    role?: string | null;
    is_active: boolean;
    is_verified: boolean;
};

type Props = {
    user: ExistingUser;
    onSuccess: () => void;
    onCancel: () => void;
};

const ROLES = RoleEnum.options.map((r) => ({
    value: r,
    label: r.charAt(0) + r.slice(1).toLowerCase(),
}));

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5 w-full">
            <Label className="text-xs font-semibold text-slate-700">{label}</Label>
            {children}
            {error && (
                <p className="text-[11px] font-medium text-red-500 mt-1 animate-in fade-in-50">
                    {error}
                </p>
            )}
        </div>
    );
}

export default function UserUpdateForm({ user, onSuccess, onCancel }: Props) {
    const updateUser = useUpdateUser();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<UserUpdateFormInput, any, UserUpdateInputs>({
        resolver: zodResolver(userUpdateFormSchema),
        defaultValues: {
            email: user.email ?? "",
            username: user.username ?? "",
            phone_number: user.phone_number ?? "",
            role: (user.role as any) ?? "RECEPTIONIST",
            is_active: user.is_active,
            is_verified: user.is_verified,
        },
    });

    const disabled = isSubmitting || updateUser.isPending;

    const onSubmit = async (values: UserUpdateInputs) => {
        await updateUser.mutateAsync({ userId: user.id, payload: values });
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-1">

            {/* Identity */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Account Identity
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Username" error={errors.username?.message}>
                        <Input {...register("username")} disabled={disabled} />
                    </Field>
                    <Field label="Email Address" error={errors.email?.message}>
                        <Input type="email" {...register("email")} disabled={disabled} />
                    </Field>
                </div>
            </div>

            {/* Contact */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Contact
                    </h3>
                </div>

                <Field label="Phone Number" error={errors.phone_number?.message}>
                    <NepalPhoneInput
                    {...register("phone_number")}
                    disabled={disabled}
                    />
                </Field>
            </div>

            {/* Role */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Shield className="h-4 w-4 text-slate-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Role & Access
                    </h3>
                </div>

                <Field label="Role" error={errors.role?.message}>
                    <Controller
                        control={control}
                        name="role"
                        render={({ field }) => (
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={disabled}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {ROLES.map((r) => (
                                        <SelectItem key={r.value} value={r.value}>
                                            {r.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </Field>
            </div>

            {/* Account flags */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <ToggleLeft className="h-4 w-4 text-slate-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Account Status
                    </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Controller
                        control={control}
                        name="is_active"
                        render={({ field }) => (
                            <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 cursor-pointer">
                                <div>
                                    <p className="text-sm font-semibold text-slate-700">Active</p>
                                    <p className="text-xs text-slate-400">Can log in</p>
                                </div>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={disabled}
                                />
                            </label>
                        )}
                    />

                    <Controller
                        control={control}
                        name="is_verified"
                        render={({ field }) => (
                            <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 cursor-pointer">
                                <div>
                                    <p className="text-sm font-semibold text-slate-700">Verified</p>
                                    <p className="text-xs text-slate-400">Email confirmed</p>
                                </div>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={disabled}
                                />
                            </label>
                        )}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-100">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
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
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Save Changes"
                    )}
                </Button>
            </div>
        </form>
    );
}