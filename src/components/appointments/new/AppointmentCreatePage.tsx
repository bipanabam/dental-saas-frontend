"use client";

import {
    useSearchParams,
} from "next/navigation";

import {
    usePatientDetail,
} from "@/hooks/patients/use-patients";

import AppointmentPatientCard from "./AppointmentPatientCard";
import AppointmentForm from "../forms/AppointmentForm";

const AppointmentCreatePage = () => {
    const params = useSearchParams();

    const patientId = params.get("patientId") || "";

    if (!patientId) {
        return(
            <div>
                Cannot fetch the given patient's detail.
            </div>
        )
    }

    const {
        data: patient,
    } = usePatientDetail(
        patientId ?? ""
    );

    return (
        <div className="space-y-6">

            {patient && (
                <AppointmentPatientCard
                    patient={patient}
                />
            )}

            <AppointmentForm
                patientId={patientId}
            />

        </div>
    );
}

export default AppointmentCreatePage;