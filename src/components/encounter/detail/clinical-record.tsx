"use client";

import { Badge } from "@/components/ui/badge";
import { Stethoscope, Heart, Activity, FileText, ClipboardList, ShieldAlert } from "lucide-react";

import VitalsSection from "./vitals-section";
import HistorySection from "./history-section";
import ExaminationSection from "./examination-section";
import FindingsSection from "./findings-section";
import DiagnosisSection from "./diagnosis-section";
import InvestigationSection from "./investigation-section";
import TreatmentPlanSection from "./treatment-plan-section";

import type { EncounterDetail } from "@/lib/api";

interface ChartRowProps {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
    badge?: string | number;
}

function ChartSection({ title, icon: Icon, children, badge }: ChartRowProps) {
    return (
        <div className="group">
            <div className="bg-slate-50/70 px-6 py-2.5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        {title}
                    </span>
                </div>
                {badge !== undefined && (
                    <Badge variant="secondary" className="px-1.5 py-0 text-[10px] bg-slate-200/50 font-medium text-slate-600 shadow-none border-none">
                        {badge}
                    </Badge>
                )}
            </div>
            <div className="px-6 py-5 text-slate-700">
                {children}
            </div>
        </div>
    );
}

export default function ClinicalRecord({ encounter }: { encounter: EncounterDetail }) {
    const diagnosesCount = encounter.diagnoses?.length ?? 0;
    const findingsCount = encounter.clinical_findings?.length ?? 0;
    const investigationsCount = encounter.investigations?.length ?? 0;

    return (
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-100">

            {/* Section 1: Objective Clinical Vitals */}
            <ChartSection title="Patient Vitals" icon={Activity}>
                <VitalsSection encounter={encounter} />
            </ChartSection>

            {/* Section 2: Clinical Risk Background */}
            <ChartSection title="Risk Factors & Medical Background" icon={ShieldAlert}>
                <HistorySection history={encounter.medical_history!} />
            </ChartSection>

            {/* Section 3: Physical System Evaluations */}
            <ChartSection title="Physical & General Evaluation" icon={Stethoscope}>
                <ExaminationSection findings={encounter.examination_findings!} />
            </ChartSection>

            {/* Section 4: Documented Localized / Dental Findings */}
            <ChartSection
                title="Documented Clinical Findings"
                icon={Heart}
                badge={findingsCount}
            >
                <FindingsSection findings={encounter.clinical_findings!} />
            </ChartSection>

            {/* Section 5: Assessment & Diagnostic Codes */}
            <ChartSection
                title="Assessment & Diagnostic Codes"
                icon={FileText}
                badge={diagnosesCount}
            >
                <DiagnosisSection diagnoses={encounter.diagnoses!} />
            </ChartSection>

            {/* Section 6: Lab Orders & Structural Investigations */}
            <ChartSection
                title="Ordered Diagnostic Labs & Investigations"
                icon={ClipboardList}
                badge={investigationsCount}
            >
                <InvestigationSection investigations={encounter.investigations!} />
            </ChartSection>

            {/* Section 7: Final Planned Care Interventions */}
            <ChartSection title="Intervention & Proposed Treatment Plan" icon={ClipboardList}>
                <TreatmentPlanSection plan={encounter.treatment_plan!} />
            </ChartSection>

        </section>
    );
}