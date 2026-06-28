"use client";

import { useParams } from "next/navigation";

import AppointmentEditPage from "@/components/appointments/edit/AppointmentEditPage";

export default function EditAppointmentPage() {
    const { appointmentId } = useParams();
    return (<AppointmentEditPage appointmentId={appointmentId as string} />);
}