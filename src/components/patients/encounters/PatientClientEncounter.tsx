"use client";

import { PaginatedList } from "@/components/shared/PaginatedList";
import ClinicalEncounterCard from "./ClinicalEncounterCard";

import { usePatientEncounters } from "@/hooks/patients/use-patient-clinical";

type Props = {
  patientId: string;
};

const PatientClientEncounter = ({ patientId }: Props) => {
  const { data, isLoading } = usePatientEncounters(patientId);

  return (
    <div className="py-4 max-w-3xl">
      <PaginatedList
        data={data}
        isLoading={isLoading}
        emptyTitle="No encounters to show yet"
        emptyDescription="No recorded clinical data found..."
        renderItem={(item, index, array) => (
          <ClinicalEncounterCard
            key={item.id}
            item={item}
            isLast={index === array.length - 1}
          />
        )}
      />
    </div>
  );
};

export default PatientClientEncounter;
