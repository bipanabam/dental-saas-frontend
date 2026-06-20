"use client";

import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";

import {
    ShieldAlert,
    ClipboardCheck,
    Search,
    Stethoscope,
    Microscope,
    ArrowDown,
} from "lucide-react";

import { useTaxonomy } from "@/hooks/taxonomy/use-taxonomy";

import { SeverityGroups, FieldGroups, GroupedChips, SeverityItem, FieldItem } from "./EncounterStagesView";


const tabs = [
    {
        id: "history",
        dataKey: "medical_history",
        kind: "severity" as const,
        title: "Medical History",
        role: "Capture",
        icon: ShieldAlert,
        color: "text-rose-600",
        bg: "bg-rose-50",
        border: "border-rose-100",
        description:
            "Collect systemic disease, allergies, medications and risk factors.",
        feedsInto: "Flags risk factors that shape examination and treatment safety.",
    },
    {
        id: "exam",
        dataKey: "examination",
        kind: "field" as const,
        title: "Examination",
        role: "Capture",
        icon: ClipboardCheck,
        color: "text-sky-600",
        bg: "bg-sky-50",
        border: "border-sky-100",
        description:
            "Perform extraoral, intraoral and specialty examination.",
        feedsInto: "Raw clinical observations become candidate Findings.",
    },
    {
        id: "finding",
        dataKey: "findings",
        kind: "grouped-chip" as const,
        title: "Findings",
        role: "Capture",
        icon: Search,
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-100",
        description:
            "Document observed problems and complaints.",
        feedsInto: "Each finding is mapped toward one or more possible diagnoses.",
    },
    {
        id: "diagnosis",
        dataKey: "diagnoses",
        kind: "grouped-chip" as const,
        title: "Diagnosis",
        role: "Decide",
        icon: Stethoscope,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-300",
        primary: true,
        description:
            "Determine the clinical diagnosis.",
        feedsInto: "Diagnosis directly drives the treatment plan and billing codes.",
    },
    {
        id: "investigation",
        dataKey: "investigations",
        kind: "grouped-chip" as const,
        title: "Investigation",
        role: "Optional",
        icon: Microscope,
        color: "text-violet-600",
        bg: "bg-violet-50",
        border: "border-violet-100",
        description:
            "Optional imaging and laboratory confirmation.",
        feedsInto: "Used only when diagnosis needs confirmation before treatment.",
    },
];

function countAll(value: unknown): number {
    if (!value || typeof value !== "object") return 0;
    return Object.values(value).reduce(
        (acc, v) => acc + (Array.isArray(v) ? v.length : 0),
        0
    );
}

export default function EncounterFlowTabs() {
    const { data, isLoading } = useTaxonomy();

    return (
        <Tabs defaultValue="history" className="space-y-6">
            <div className="space-y-2">
                <h3 className="font-black">Encounter Reference Guide</h3>
                <p className="text-xs text-muted-foreground">
                    Select a stage to see what's captured, and what it feeds into next.
                </p>

                <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-slate-100">
                    {tabs.map((tab) => (
                        <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            className="flex flex-col gap-2 py-3"
                        >
                            <tab.icon className="h-4 w-4" />
                            <span className="text-[10px] font-bold">{tab.title}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>

            {tabs.map((tab) => {
                const Icon = tab.icon;
                const raw = data?.[tab.dataKey as keyof typeof data] as
                    | Record<string, unknown>
                    | undefined;
                const itemCount = countAll(raw);

                return (
                    <TabsContent key={tab.id} value={tab.id} className="mt-0">
                        <div
                            className={`rounded-2xl border p-6 ${tab.bg} ${tab.border} ${tab.primary ? "ring-2 ring-emerald-200" : ""
                                }`}
                        >
                            <div className="grid md:grid-cols-3 gap-6">
                                {/* Left: identity + grouped taxonomy data */}
                                <div className="md:col-span-2 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-xl p-2 bg-white">
                                                <Icon className={`h-5 w-5 ${tab.color}`} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] uppercase font-black tracking-wide text-muted-foreground">
                                                    {tab.role}
                                                </div>
                                                <h3 className="font-black text-lg leading-tight">
                                                    {tab.title}
                                                </h3>
                                            </div>
                                        </div>

                                        <span className="text-xs font-bold text-slate-500 bg-white rounded-full px-3 py-1 shrink-0">
                                            {isLoading ? "…" : `${itemCount} items`}
                                        </span>
                                    </div>

                                     <p className="text-sm text-muted-foreground leading-relaxed">
                                         {tab.description}
                                     </p>

                                   {/* Severity legend, only on medical history */}                                     {tab.kind === "severity" && (
                                        <div className="flex items-center gap-4 text-[11px] text-slate-500">
                                            <span className="flex items-center gap-1.5">
                                                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Critical
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Warning
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" /> Info
                                            </span>
                                        </div>
                                    )}

                                    <div className="max-h-72 overflow-y-auto pr-1">
                                        {isLoading ? (
                                            <p className="text-sm text-slate-400">Loading…</p>
                                        ) : !raw || itemCount === 0 ? (
                                            <p className="text-sm text-slate-400">
                                                No taxonomy items found for this stage.
                                            </p>
                                        ) : tab.kind === "severity" ? (
                                            <SeverityGroups data={raw as Record<string, SeverityItem[]>} />
                                        ) : tab.kind === "field" ? (
                                            <FieldGroups data={raw as Record<string, FieldItem[]>} />
                                        ) : (
                                            <GroupedChips data={raw as Record<string, string[]>} />
                                        )}
                                    </div>
                                </div>

                                {/* Right: what it feeds into */}
                                <div className="rounded-xl bg-white border p-4 flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-xs font-black uppercase text-slate-500 mb-2">
                                            Feeds into
                                        </h4>
                                        <p className="text-sm text-slate-700">
                                            {tab.feedsInto}
                                        </p>
                                    </div>
                                    <ArrowDown className="h-4 w-4 text-slate-400 mt-4" />
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                );
            })}
        </Tabs>
    );
}