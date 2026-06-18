"use client";

import { PaginatedList } from "@/components/shared/PaginatedList";
import MedicalHistoryCard from "./MedicalHistoryCard";

import { usePatientMedicalHistory } from "@/hooks/patients/use-patient-clinical";


type Props = {
    patientId: string;
};

const PatientMedicalHistory = ({ patientId }: Props)  => {
    const { data, isLoading } = usePatientMedicalHistory(patientId);

    return (
        <div className="py-4 max-w-3xl">
            <PaginatedList
                data={data}
                isLoading={isLoading}
                emptyTitle="No medical history"
                emptyDescription="No recorded conditions or allergies found"
                renderItem={(item: any, index?: number, array?: any[]) => (
                    <MedicalHistoryCard
                        key={item.encounter_id}
                        item={item}
                        isLast={index === (array?.length ?? 0) - 1}
                    />
                )}
            />
        </div>
    );
}

export default PatientMedicalHistory;