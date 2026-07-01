"use client";

import { ShieldAlert, Pill } from "lucide-react";

type Props = {
    criticalAlerts: string[];
    isLoading?: boolean;
};

const ALLERGY_PREFIX = "Allergy: ";

export default function ClinicalAlertBanner({ criticalAlerts, isLoading }: Props) {
    if (isLoading) return null;
    if (criticalAlerts.length === 0) return null;

    return (
        <div className="flex items-center gap-2.5 flex-wrap px-3.5 py-2 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-center gap-1.5 text-red-700 shrink-0">
                <ShieldAlert className="h-3.5 w-3.5 stroke-[2.5]" />
                <span className="text-[10px] font-black uppercase tracking-wider">Clinical Alert</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
                {criticalAlerts.map((alert) => {
                    const isAllergy = alert.startsWith(ALLERGY_PREFIX);
                    const label = isAllergy ? alert.slice(ALLERGY_PREFIX.length) : alert;

                    return (
                        <span
                            key={alert}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-800 border border-red-200"
                        >
                            {isAllergy && <Pill className="h-2.5 w-2.5" />}
                            {label}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}