"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Card } from "@/components/ui/card";

type Props = {
    title: string;
    badge?: React.ReactNode;
    defaultOpen?: boolean;
    children: React.ReactNode;
};

export default function AccordionSection({ title, badge, defaultOpen = false, children }: Props) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <h3 className="text-sm font-bold text-slate-800">{title}</h3>
                    {badge}
                </div>
                <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>
            {open && <div className="border-t border-slate-100 px-6 py-5">{children}</div>}
        </Card>
    );
}