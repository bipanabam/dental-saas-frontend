"use client";

import { forwardRef } from "react";
import { Input } from "@/components/ui/input";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    error?: string;
};

export const NepalPhoneInput = forwardRef<HTMLInputElement, Props>(
    ({ error, className, ...props }, ref) => {
        return (
            <div className="flex rounded-lg border border-input overflow-hidden focus-within:ring-1 focus-within:ring-ring">
                <span className="flex items-center px-3 bg-slate-50 border-r border-input text-sm font-semibold text-slate-500 select-none shrink-0">
                    🇳🇵 +977
                </span>
                <Input
                    ref={ref}
                    type="tel"
                    inputMode="numeric"
                    placeholder="98XXXXXXXX"
                    className="border-0 shadow-none focus-visible:ring-0 rounded-none"
                    {...props}
                />
            </div>
        );
    }
);

NepalPhoneInput.displayName = "NepalPhoneInput";