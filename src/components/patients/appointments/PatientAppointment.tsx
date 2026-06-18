"use client";

import { usePatientAppointments } from "@/hooks/patients/use-patient-clinical";

import AppointmentItemCard from "./AppointmentItemCard";
import { PaginatedList } from "@/components/shared/PaginatedList";

type Props = {
  patientId: string;
};

const PatientAppointment = ({ patientId }: Props) => {
  const { error, data, isLoading } = usePatientAppointments(patientId);

  return (
    <div className="py-4 max-w-3xl">
      <PaginatedList
        data={data}
        isLoading={isLoading}
        emptyTitle="No scheduled visits"
        emptyDescription="This patient has no registered or past bookings."
        renderItem={(item, index, array) => (
          <AppointmentItemCard
            key={item.id}
            item={item}
            isLast={index === array.length - 1}
          />
        )}
      />
    </div>
  );
}

export default PatientAppointment