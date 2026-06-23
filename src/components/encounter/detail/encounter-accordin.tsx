import AccordionSection from "./accordion-section";
import VitalsSection from "./vitals-section";
import HistorySection from "./history-section";
import ExaminationSection from "./examination-section";
import FindingsSection from "./findings-section";
import DiagnosisSection from "./diagnosis-section";
import InvestigationSection from "./investigation-section";
import TreatmentPlanSection from "./treatment-plan-section";

import type { EncounterDetail } from "@/lib/api";

function CountBadge({ count }: { count: number }) {
    if (count === 0) return null;
    return (
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">
            {count}
        </span>
    );
}

export default function EncounterAccordion({ encounter }: { encounter: EncounterDetail }) {
    const hasVitals =
        encounter.bp_systolic != null ||
        encounter.pulse_rate != null ||
        encounter.temperature != null ||
        encounter.weight_kg != null ||
        encounter.spo2 != null ||
        !!encounter.chief_complaint;

    return (
        <div className="space-y-3">
            <AccordionSection title="Vitals" defaultOpen={hasVitals}>
                <VitalsSection encounter={encounter} />
            </AccordionSection>

            <AccordionSection title="History">
                <HistorySection history={encounter.medical_history!} />
            </AccordionSection>

            <AccordionSection
                title="Examination"
                badge={<CountBadge count={encounter?.examination_findings?.length!} />}
            >
                <ExaminationSection findings={encounter.examination_findings!} />
            </AccordionSection>

            <AccordionSection
                title="Findings"
                badge={<CountBadge count={encounter?.clinical_findings?.length!} />}
            >
                <FindingsSection findings={encounter?.clinical_findings!} />
            </AccordionSection>

            <AccordionSection
                title="Diagnosis"
                badge={<CountBadge count={encounter.diagnoses?.length!} />}
            >
                <DiagnosisSection diagnoses={encounter.diagnoses!} />
            </AccordionSection>

            <AccordionSection
                title="Investigations"
                badge={<CountBadge count={encounter.investigations?.length!} />}
            >
                <InvestigationSection investigations={encounter.investigations!} />
            </AccordionSection>

            <AccordionSection
                title="Treatment Plan"
                badge={<CountBadge count={encounter.treatment_plan?.items?.length ?? 0} />}
            >
                <TreatmentPlanSection plan={encounter.treatment_plan!} />
            </AccordionSection>
        </div>
    );
}