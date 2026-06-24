"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User, Phone, Shield, KeyRound } from "lucide-react";

import {
  userCreateFormSchema,
  type UserCreateFormInput,
  type UserCreateInputs,
  RoleEnum,
} from "@/lib/schemas/user";

import { useCreateUser } from "@/hooks/users/use-staffs-mutations";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";

import { NepalPhoneInput } from "@/components/shared/form/NepalPhoneInput";

type Props = {
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
      {error && (
        <p className="text-[11px] font-medium text-red-500 mt-1 animate-in fade-in-50">
          {error}
        </p>
      )}
    </div>
  );
}

export default function UserCreateForm({ onSuccess, onCancel }: Props) {
  const createUser = useCreateUser();

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserCreateFormInput, any, UserCreateInputs>({
    resolver: zodResolver(userCreateFormSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      phone_number: "",
      role: "receptionist",
    },
  });

  const disabled = isSubmitting || createUser.isPending;

  const onSubmit = async (values: UserCreateInputs) => {
    await createUser.mutateAsync(values);
    reset();
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
          <Field label="Username" error={errors.username?.message} required>
            <Input
              {...register("username")}
              disabled={disabled}
              placeholder="e.g. dr.sharma"
            />
          </Field>

          <Field label="Email Address" error={errors.email?.message} required>
            <Input
              type="email"
              {...register("email")}
              disabled={disabled}
              placeholder="user@clinic.com"
            />
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

      {/* Access */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <Shield className="h-4 w-4 text-slate-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Role & Access
          </h3>
        </div>

        <Field label="Role" error={errors.role?.message} required>
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
                  <SelectValue placeholder="Select role" />
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

      {/* Password */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <KeyRound className="h-4 w-4 text-slate-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Initial Password
          </h3>
        </div>

        <Field label="Password" error={errors.password?.message} required>
          <Input
            type="password"
            {...register("password")}
            disabled={disabled}
            placeholder="Minimum 8 characters"
          />
        </Field>

        <p className="text-xs text-slate-400">
          The user can change this after their first login.
        </p>
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
        <Button type="submit" disabled={disabled} className="min-w-32 bg-brand-700">
          {disabled ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create User"
          )}
        </Button>
      </div>
    </form>
  );
}