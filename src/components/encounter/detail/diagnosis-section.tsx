import { EmptyRow, ToothChips } from "./badges";

import type { DiagnosisOut } from "@/lib/api";

function DiagnosisRow({ diagnosis, pinned }: { diagnosis: DiagnosisOut; pinned?: boolean }) {
    return (
        <div
            className={`space-y-1.5 py-3 first:pt-0 last:pb-0 ${pinned ? "border-l-2 border-brand-600 pl-3 -ml-3" : ""
                }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className={`text-[11px] font-semibold uppercase ${pinned ? "text-brand-600" : "text-slate-400"}`}>
                        {pinned ? "Primary" : "Secondary"}
                    </p>
                    <p className="text-sm font-bold text-slate-800">{diagnosis.diagnosis_name}</p>
                </div>
                {diagnosis.icd10_code && (
                    <span className="text-[11px] font-mono text-slate-400">ICD-10 {diagnosis.icd10_code}</span>
                )}
            </div>

            {diagnosis.tooth_numbers && diagnosis.tooth_numbers.length > 0 && (
                <ToothChips teeth={diagnosis.tooth_numbers} />
            )}

            {diagnosis.notes && <p className="text-sm text-slate-500">{diagnosis.notes}</p>}
        </div>
    );
}

export default function DiagnosisSection({ diagnoses }: { diagnoses: DiagnosisOut[] }) {
    if (diagnoses.length === 0) {
        return <EmptyRow label="No diagnoses recorded for this encounter." />;
    }

    const primary = diagnoses.filter((d) => d.is_primary);
    const secondary = diagnoses.filter((d) => !d.is_primary);

    return (
        <div className="divide-y divide-slate-50">
            {primary.map((d) => (
                <DiagnosisRow key={d.id} diagnosis={d} pinned />
            ))}
            {secondary.map((d) => (
                <DiagnosisRow key={d.id} diagnosis={d} />
            ))}
        </div>
    );
}