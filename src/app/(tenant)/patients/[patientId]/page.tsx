"use client";
import { useState } from "react";

import { useParams } from "next/navigation";

import PatientHeader from "@/components/patients/PatientHeader";
import PatientOverview from "@/components/patients/PatientOverview";
import PatientNavigation from "@/components/patients/PatientNavigation";
import PatientActionsCard from "@/components/patients/PatientActionsCard";
import ActivityTimelineCard from "@/components/patients/ActivityTimelineCard";

import { EmptyState } from "@/components/shared/page/EmptyState";

import { usePatientDetail } from "@/hooks/patients/use-patients";

export default function PatientDetailPage() {
  const { patientId } = useParams();
  const [tab, setTab] = useState("overview");

  const { data: patient, isLoading } = usePatientDetail(patientId as string);
  console.log(patient)

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!patient) {
    return <div>Patient not found</div>;
  }

  return (
    <div className="space-y-6 max-w-400 mx-auto w-full">
      {/* Hero */}
      <PatientHeader patient={patient} />
      <PatientNavigation
        active={tab}
        onChange={setTab}
      />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left */}
        <div className="lg:col-span-3 space-y-6">
          {tab === "overview" && <PatientOverview patient={patient} />}
          {tab == null && (
            <EmptyState title="Something went wrong" description="Try refreshing.." />
          )}
        </div>
        {/* Right */}
        <aside className="lg:col-span-1 space-y-6 sticky top-20 h-fit">
          <PatientActionsCard patient={patient} />
          <ActivityTimelineCard patient={patient} />
        </aside>
      </div>

    </div>
  );
}
