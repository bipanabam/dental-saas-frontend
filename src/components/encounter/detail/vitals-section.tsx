import { EmptyRow } from "./badges";

import type { EncounterOut } from "@/lib/api";

type VitalDef = { label: string; value: string; unit?: string };

function buildVitals(encounter: EncounterOut): VitalDef[] {
    const vitals: VitalDef[] = [];

    if (encounter.bp_systolic != null && encounter.bp_diastolic != null) {
        vitals.push({ label: "BP", value: `${encounter.bp_systolic}/${encounter.bp_diastolic}`, unit: "mmHg" });
    }
    if (encounter.pulse_rate != null) {
        vitals.push({ label: "Pulse", value: `${encounter.pulse_rate}`, unit: "bpm" });
    }
    if (encounter.temperature != null) {
        vitals.push({ label: "Temp", value: `${encounter.temperature}`, unit: "°C" });
    }
    if (encounter.weight_kg != null) {
        vitals.push({ label: "Weight", value: `${encounter.weight_kg}`, unit: "kg" });
    }
    if (encounter.spo2 != null) {
        vitals.push({ label: "SpO₂", value: `${encounter.spo2}`, unit: "%" });
    }

    return vitals;
}

export default function VitalsSection({ encounter }: { encounter: EncounterOut }) {
    const vitals = buildVitals(encounter);

    if (vitals.length === 0) {
        return <EmptyRow label="No vitals recorded for this encounter." />;
    }

    return (
        <dl className="grid grid-cols-2 gap-y-2 sm:grid-cols-3 md:grid-cols-5">
            {vitals.map((v) => (
                <div key={v.label} className="flex items-baseline justify-between gap-2 sm:block">
                    <dt className="text-xs text-slate-400">{v.label}</dt>
                    <dd className="text-sm font-semibold text-slate-800">
                        {v.value}
                        {v.unit && <span className="ml-1 text-[11px] font-normal text-slate-400">{v.unit}</span>}
                    </dd>
                </div>
            ))}
        </dl>
    );
}