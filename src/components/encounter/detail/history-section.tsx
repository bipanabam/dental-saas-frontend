import { AlertCircle, Check, Minus } from "lucide-react";
import { EmptyRow } from "./badges";
import type { MedicalHistoryOut } from "@/lib/api";

const BOOLEAN_LABELS: { key: keyof MedicalHistoryOut; label: string }[] = [
    { key: "is_diabetic", label: "Diabetic" },
    { key: "has_hypertension", label: "Hypertension" },
    { key: "has_heart_condition", label: "Heart Condition" },
    { key: "has_medication_allergy", label: "Medication Allergy" },
    { key: "is_on_blood_thinners", label: "Blood Thinners" },
    { key: "has_hepatitis_tb", label: "Hepatitis / TB" },
    { key: "is_pregnant", label: "Pregnancy" },
    { key: "smokes_or_drinks", label: "Smokes / Drinks" },
];

export default function HistorySection({ history }: { history: MedicalHistoryOut | null }) {
    if (!history) return <EmptyRow label="No medical history recorded." />;

    // Grouping into explicitly confirmed vs explicitly denied/negative conditions
    const confirmedRisks = BOOLEAN_LABELS.filter(({ key }) => history[key] === true);
    const deniedConditions = BOOLEAN_LABELS.filter(({ key }) => history[key] === false);
    const unrecordedConditions = BOOLEAN_LABELS.filter(({ key }) => history[key] === null);

    const notes = history.items ?? [];

    return (
        <div className="space-y-5 text-xs">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Left Column: Positive Findings (Risks) */}
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-rose-600 mb-2">
                        Confirmed Risk Flags / Comorbidities
                    </p>
                    {confirmedRisks.length > 0 ? (
                        <div className="space-y-1.5">
                            {confirmedRisks.map(({ label }) => (
                                <div key={label} className="flex items-center gap-2 text-rose-900 font-semibold bg-rose-50/50 px-2 py-1 rounded border border-rose-100">
                                    <AlertCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                                    <span>{label}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-400 italic pl-2">None declared.</p>
                    )}
                </div>

                {/* Right Column: Negative Findings (Denies) */}
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-2">
                        Explicitly Denied / Normal
                    </p>
                    {deniedConditions.length > 0 ? (
                        <div className="grid grid-cols-1 gap-1 pl-1">
                            {deniedConditions.map(({ label }) => (
                                <div key={label} className="flex items-center gap-2 text-slate-600 py-0.5">
                                    <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                    <span>Patient denies {label.toLowerCase()}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-400 italic pl-2">None declared.</p>
                    )}
                </div>
            </div>

            {/* Optional: Unrecorded conditions if you want to be completely thorough */}
            {unrecordedConditions.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">
                        Not Evaluated / Unspecified
                    </p>
                    <p className="text-slate-400 pl-1">
                        {unrecordedConditions.map(c => c.label).join(", ")}
                    </p>
                </div>
            )}

            {/* Additional Clinical Text Notes */}
            {notes.length > 0 && (
                <div className="pt-3 border-t border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1.5">
                        Additional History Details / Notes
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                        {notes.map((item, i) => (
                            <li key={i}>{typeof item === "string" ? item : JSON.stringify(item)}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}