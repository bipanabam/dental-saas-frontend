import {
    ShieldAlert,
    ClipboardCheck,
    Search,
    Stethoscope,
    Microscope,
} from "lucide-react";

export const encounterStages = [
    {
        id: "history",
        dataKey: "medical_history",
        title: "Medical History",
        role: "Capture",
        icon: ShieldAlert,
        description:
            "Collect systemic disease, allergies, medications and risk factors.",
        feedsInto:
            "Risk factors influence examination and treatment safety.",
        kind: "severity",
    },

    {
        id: "exam",
        dataKey: "examination",
        title: "Examination",
        role: "Capture",
        icon: ClipboardCheck,
        description:
            "Perform structured clinical examination.",
        feedsInto:
            "Observations become Findings.",
        kind: "field",
    },

    {
        id: "finding",
        dataKey: "findings",
        title: "Findings",
        role: "Capture",
        icon: Search,
        description:
            "Observed problems and abnormalities.",
        feedsInto:
            "Findings narrow diagnosis.",
        kind: "grouped",
    },

    {
        id: "diagnosis",
        dataKey: "diagnoses",
        title: "Diagnosis",
        role: "Decide",
        icon: Stethoscope,
        description:
            "Determine clinical conclusion.",
        feedsInto:
            "Treatment planning and billing.",
        kind: "grouped",
        primary: true,
    },

    {
        id: "investigation",
        dataKey: "investigations",
        title: "Investigation",
        role: "Optional",
        icon: Microscope,
        description:
            "Optional confirmation.",
        feedsInto:
            "Used when diagnosis requires validation.",
        kind: "grouped",
    },
];

export function count(value: unknown) {
    if (!value) return 0;
    if (Array.isArray(value)) return value.length;

    if (typeof value === "object") {
        return Object.values(value).reduce(
            (acc, v) =>
                acc +
                (Array.isArray(v)
                    ? v.length
                    : typeof v === "object"
                        ? Object.keys(v).length
                        : 0),
            0
        );
    }

    return 0;
}

export function getTaxonomyCounts(
    data: unknown
): Record<string, number> {
    if (!data || typeof data !== "object") {
        return {};
    }

    const taxonomy = data as Record<string, unknown>;

    return encounterStages.reduce<Record<string, number>>(
        (acc, stage) => {
            acc[stage.id] = count(
                taxonomy[stage.dataKey]
            );

            return acc;
        },
        {}
    );
}