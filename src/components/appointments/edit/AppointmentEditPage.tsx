"use client";

import { useRouter } from "next/navigation";

import { useAppointmentDetail } from "@/hooks/appointments/use-appointments";
import { usePatientDetail } from "@/hooks/patients/use-patients";
import { SectionLoader } from "@/components/base/loading-view";

import AppointmentPatientCard from "@/components/appointments/new/AppointmentPatientCard";
import AppointmentForm from "@/components/appointments/forms/AppointmentForm";

interface AppointmentEditPageProps {
    appointmentId: string;
}

export default function AppointmentEditPage({ appointmentId }: AppointmentEditPageProps) {
    const router = useRouter();
    const { data: appointment, isLoading, isError } = useAppointmentDetail(appointmentId);
    const { data: patient } = usePatientDetail(appointment?.patient_id ?? "");

    if (isLoading) return <SectionLoader message="Loading appointment..." />;

    if (isError || !appointment) {
        return (
            <div className="text-sm text-slate-500 py-12 text-center">
                Couldn't load this appointment. It may have been deleted.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {patient && <AppointmentPatientCard patient={patient} />}

            <AppointmentForm
                mode="edit"
                patientId={appointment.patient_id}
                appointmentId={appointment.id}
                initialValues={appointment}
                onSuccess={(id) => router.push(`/appointments/${id}`)}
            />
        </div>
    );
}