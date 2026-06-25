"use client";
import { useState } from "react";

import { useParams } from "next/navigation";

import PatientHeader from "@/components/patients/PatientHeader";
import PatientNavigation from "@/components/patients/PatientNavigation";
import PatientActionsCard from "@/components/patients/PatientActionsCard";
import ActivityTimelineCard from "@/components/patients/ActivityTimelineCard";
import NextActionsCard from "@/components/patients/NextActionsCard";

import PatientOverview from "@/components/patients/overview/PatientOverview";
import PatientMedicalHistory from "@/components/patients/medical-history/PatientMedicalHistory";
import PatientAppointment from "@/components/patients/appointments/PatientAppointment";
import PatientClientEncounter from "@/components/patients/encounters/PatientClientEncounter";
import PatientTreatmentPlan from "@/components/patients/treatment-plans/PatientTreatmentPlan";
import PatientProcedures from "@/components/patients/procedures/PatientProcedures";

import { EmptyState } from "@/components/shared/page/EmptyState";
import { FullPageLoader } from "@/components/base/loading-view";

import { usePatientDetail, usePatientSummary } from "@/hooks/patients/use-patients";

export default function PatientDetailPage() {
  const { patientId } = useParams();
  const [tab, setTab] = useState("overview");

  const { data: patient, isLoading } =
    usePatientDetail(patientId as string);

  const { data: summary } =
    usePatientSummary(patientId as string);

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!patient) {
    return <div>Patient not found</div>;
  }

  return (
    <div className="space-y-6 max-w-400 mx-auto w-full">
      {/* Hero */}
      <PatientHeader
        patient={patient}
        summary={summary}
      />
      <PatientNavigation
        active={tab}
        onChange={setTab}
      />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left */}
        <div className="lg:col-span-3 space-y-6">
          {tab === "overview" && 
          <PatientOverview
            patient={patient}
            summary={summary}
          />}
          {tab === "medical-history" && (
            <PatientMedicalHistory patientId={patientId as string} />
          )}
          {tab === "appointments" &&
            <PatientAppointment patientId={patientId as string} />}
          {tab === "encounters" &&
            <PatientClientEncounter patientId={patientId as string}
            />}
          {tab === "treatment-plans" &&
            <PatientTreatmentPlan patientId={patientId as string}
            />}
          {tab === "procedures" &&
            <PatientProcedures patientId={patientId as string}
            />}
          {tab == null && (
            <EmptyState title="Something went wrong" description="Try refreshing.." />
          )}
        </div>
        {/* Right */}
        <aside className="lg:col-span-1 space-y-6 sticky top-20 h-fit">
          {summary?.next_actions?.length && (
            <NextActionsCard
             key={patient.id}
              patientId={patient.id}
              actions={summary.next_actions}
            />
          )}

          <PatientActionsCard
            patient={patient}
          />
          <ActivityTimelineCard
            patient={patient}
            summary={summary}
          />

        </aside>
      </div>

    </div>
  );
}
