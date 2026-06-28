"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import { usePatientDetail } from "@/hooks/patients/use-patients";

import AppointmentPatientCard from "./AppointmentPatientCard";
import AppointmentForm from "../forms/AppointmentForm";

const AppointmentCreatePage = () => {
    const router = useRouter();
    const params = useSearchParams();
    const patientId = params.get("patientId") || "";

    const { data: patient } = usePatientDetail(patientId);

    if (!patientId) {
        return (
            <div className="text-sm text-slate-500 py-12 text-center">
                No patient selected. Please select a patient before booking an appointment.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {patient && <AppointmentPatientCard patient={patient} />}

            <AppointmentForm
                mode="create"
                patientId={patientId}
                onSuccess={(id) => router.push(`/appointments/${id}`)}
            />
        </div>
    );
};

export default AppointmentCreatePage;