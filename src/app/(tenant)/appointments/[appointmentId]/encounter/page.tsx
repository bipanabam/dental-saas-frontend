"use client";
import { useState } from "react";

import { useParams } from "next/navigation";

import { FullPageLoader } from "@/components/base/loading-view";

import { useEncounterByAppointmentId } from "@/hooks/encounter/use-encounter";

const EncounterPage = () => {
    const { appointmentId } = useParams();
    const {
        data: encounter,
        isLoading,
        error,
    } = useEncounterByAppointmentId(appointmentId as string);

    console.log(encounter)

    if (isLoading) {
        return <FullPageLoader />;
    }

    if (!encounter) {
        return <div>Encounter data not found</div>;
    }
  return (
    <div>page</div>
  )
}

export default EncounterPage;