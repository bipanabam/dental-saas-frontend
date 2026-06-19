"use client";

import {
    Stethoscope,
} from "lucide-react";
import { useState } from "react";

import { SectionLoader } from "@/components/base/loading-view";
import PageHeader from "@/components/shared/page/PageHeader";

import { useTaxonomy } from "@/hooks/taxonomy/use-taxonomy";

import EncounterJourneySidebar from "@/components/taxonomy/EncounterJourneySidebar";
import { getTaxonomyCounts } from "@/components/taxonomy/taxonomy-flow";
import EncounterStageExplorer from "@/components/taxonomy/EncounterStageExplorer";


export default function TaxonomyPage() {
    const { data, isLoading } = useTaxonomy();
    const [selected, setSelected] = useState("history");

    if (isLoading) {
        return <SectionLoader message="Loading clinical taxonomy..." />;
    }

    const counts = getTaxonomyCounts(data);

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            <PageHeader
                title="Clinical Registry"
                description="Reference workflow for clinical encounters and treatment planning."
                icon={Stethoscope}
            />

            <div className="grid lg:grid-cols-[320px_1fr] gap-6">
                <EncounterJourneySidebar
                    value={selected}
                    onChange={setSelected}
                    counts={counts}
                />

                <EncounterStageExplorer
                    selected={selected}
                    taxonomy={data}
                />
            </div>
        </div>
    );
}