"use client";

import { PaginatedList } from "@/components/shared/PaginatedList";
import TreatmentPlanCard from "./TreatmentPlanCard";

import { usePatientTreatmentPlans } from "@/hooks/patients/use-patient-clinical";

type Props = {
    patientId: string;
};

const PatientTreatmentPlan = ({ patientId }: Props) => {
  const { data, isLoading } = usePatientTreatmentPlans(patientId);
  
    return (
      <div className="py-4 max-w-3xl">
        <PaginatedList
          data={data}
          isLoading={isLoading}
          emptyTitle="No encounters to show yet"
          emptyDescription="No recorded clinical data found..."
          renderItem={(item: any, index?: number, array?: any[]) => (
            <TreatmentPlanCard
              key={item.id}
              item={item}
              isLast={index === (array?.length ?? 0) - 1}
            />
          )}
        />
      </div>
    );
}

export default PatientTreatmentPlan