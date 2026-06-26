"use client";

import { UserRole } from "@/lib/auth/types";

import AdminDashboard from "./role/AdminDashboard";
import DoctorDashboard from "./role/DoctorDashboard";
import ReceptionDashboard from "./role/ReceptionDashboard";


export default function RoleDashboardRouter({
    role,
}: {
    role?: UserRole;
}) {
    const dashboards = {
        admin: AdminDashboard,
        doctor: DoctorDashboard,
        receptionist: ReceptionDashboard,
        // accountant: AccountantDashboard,
        // assistant: AssistantDashboard,
    };

    const Component =
        dashboards[role ?? "receptionist"];

    return <Component />;
}