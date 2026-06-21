"use client";

import React, { useCallback, memo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export type ToothNumber =
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26
    | 27
    | 28
    | 31
    | 32
    | 33
    | 34
    | 35
    | 36
    | 37
    | 38
    | 41
    | 42
    | 43
    | 44
    | 45
    | 46
    | 47
    | 48;

type ToothState = "default" | "selected" | "planned" | "active" | "completed";

type Props = {
    value?: ToothNumber[];
    onChange(v: ToothNumber[]): void;
    mode?: "single" | "multiple";
    disabled?: ToothNumber[];
    highlights?: {
        planned?: ToothNumber[];
        active?: ToothNumber[];
        completed?: ToothNumber[];
    };
};

const ARCH = {
    upper: {
        right: [18, 17, 16, 15, 14, 13, 12, 11],
        left: [21, 22, 23, 24, 25, 26, 27, 28],
    },
    lower: {
        right: [48, 47, 46, 45, 44, 43, 42, 41],
        left: [31, 32, 33, 34, 35, 36, 37, 38],
    },
} as const;

export default function ToothSelector({
    value = [],
    onChange,
    mode = "multiple",
    disabled = [],
    highlights,
}: Props) {
    const toggle = useCallback(
        (tooth: ToothNumber) => {
            if (disabled.includes(tooth)) return;

            if (mode === "single") {
                onChange(value.includes(tooth) ? [] : [tooth]);
                return;
            }

            onChange(
                value.includes(tooth)
                    ? value.filter((v) => v !== tooth)
                    : [...value, tooth],
            );
        },
        [value, mode, disabled, onChange],
    );

    const getState = (t: ToothNumber): ToothState => {
        if (value.includes(t)) return "selected";
        if (highlights?.completed?.includes(t)) return "completed";
        if (highlights?.active?.includes(t)) return "active";
        if (highlights?.planned?.includes(t)) return "planned";
        return "default";
    };

    return (
        <div className="space-y-3 w-full max-w-3xl mx-auto">
            {/* LEGEND */}
            <div className="flex flex-wrap gap-3 text-[11px] text-slate-500">
                <Legend color="brand" label="Selected" />
                <Legend color="emerald" label="Completed" />
                <Legend color="amber" label="Active" />
                <Legend color="blue" label="Planned" />
            </div>

            {/* ARCH */}
            <div className="relative border rounded-xl bg-slate-50 p-4">
                <div className="absolute left-1/2 top-0 bottom-0 border-l border-dashed" />
                <div className="absolute left-0 right-0 top-1/2 border-t border-dashed" />

                <div className="space-y-6">
                    <ArchRow
                        label="Upper Arch"
                        left={ARCH.upper.right}
                        right={ARCH.upper.left}
                        getState={getState}
                        toggle={toggle}
                        disabled={disabled}
                    />

                    <ArchRow
                        label="Lower Arch"
                        left={ARCH.lower.right}
                        right={ARCH.lower.left}
                        getState={getState}
                        toggle={toggle}
                        disabled={disabled}
                    />
                </div>
            </div>

            {/* SELECTED */}
            <div className="flex flex-wrap gap-1.5">
                {value.length !== 0 &&
                    value
                        .slice()
                        .sort((a, b) => a - b)
                        .map((t) => (
                            <Badge
                                key={t}
                                onClick={() => toggle(t)}
                                className="cursor-pointer"
                            >
                                {t}
                                <X className="h-3 w-3 ml-1" />
                            </Badge>
                        ))}
            </div>
            <div className="text-[10px] text-slate-400">
                {value?.length
                    ? `${value.length} tooth/teeth selected`
                    : "No teeth selected"}
            </div>
        </div>
    );
}

/* ARCH ROW */
function ArchRow({ label, left, right, getState, toggle, disabled }: any) {
    return (
        <div>
            <div className="text-[10px] text-center font-bold uppercase text-slate-400 mb-2">
                {label}
            </div>

            <div className="flex gap-8">
                <div className="flex-1 flex justify-end gap-1.5">
                    {left.map((t: ToothNumber) => (
                        <ToothNode
                            key={t}
                            code={t}
                            state={getState(t)}
                            disabled={disabled.includes(t)}
                            onClick={() => toggle(t)}
                        />
                    ))}
                </div>

                <div className="flex-1 flex gap-1.5">
                    {right.map((t: ToothNumber) => (
                        <ToothNode
                            key={t}
                            code={t}
                            state={getState(t)}
                            onClick={() => toggle(t)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

/* NODE */
const ToothNode = memo(function ToothNode({
    code,
    state,
    disabled,
    onClick,
}: {
    code: ToothNumber;
    state: ToothState;
    disabled?: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={state === "selected"}
            aria-label={`Tooth ${code}${state !== "default" ? `, ${state}` : ""}`}
            disabled={disabled}
            className={cn(
                "relative h-14 w-10 rounded-lg border flex flex-col items-center justify-between py-1.5 transition-all",

                // base
                "bg-white border-slate-200 hover:bg-slate-50",

                // states (clinical priority)
                state === "planned" && "border-blue-400 bg-blue-50/40",
                state === "active" && "border-amber-400 bg-amber-50/50",
                state === "completed" && "border-emerald-400 bg-emerald-50/40",
                state === "selected" && "border-brand-600 ring-2 ring-brand-500/20",

                // disabled
                "disabled:opacity-40 disabled:cursor-not-allowed",
            )}
        >
            {/* clinical status bar */}
            <div
                className={cn(
                    "absolute top-0 left-0 right-0 h-1 rounded-t-lg",
                    state === "planned" && "bg-blue-400",
                    state === "active" && "bg-amber-400",
                    state === "completed" && "bg-emerald-500",
                    state === "selected" && "bg-brand-600",
                )}
            />

            {/* tooth icon */}
            <div className="text-lg leading-none mt-1">🦷</div>
            {/* FDI code */}
            <span className="text-[10px] font-mono font-bold text-slate-600">
                {code}
            </span>
        </button>
    );
});

/* LEGEND */
function Legend({ label, color }: any) {
    const map: any = {
        brand: "bg-brand-600",
        emerald: "bg-emerald-500",
        amber: "bg-amber-500",
        blue: "bg-blue-500",
    };

    return (
        <div className="flex items-center gap-1.5">
            <div className={cn("h-2.5 w-2.5 rounded-sm", map[color])} />
            {label}
        </div>
    );
}
