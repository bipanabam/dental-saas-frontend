"use client";

import { useTenant } from "@/providers/tenant-provider";

import EncountersOverview from "@/components/encounter/list/EncountersOverview";
import DoctorEncountersOverview from "@/components/encounter/list/doctor/DoctorEncountersOverview";

export default function EncountersPage() {
    const { session } = useTenant();
    const isDoctor = session?.user?.role === "doctor";

    return (
        <div className="space-y-6">
            {isDoctor ? <DoctorEncountersOverview /> : <EncountersOverview />}
        </div>
    );
}