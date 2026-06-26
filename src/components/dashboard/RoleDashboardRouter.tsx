"use client";

import type { ComponentType } from "react";

import type { UserRole } from "@/lib/auth/types";

import AdminDashboard from "./role/AdminDashboard";
import DoctorDashboard from "./role/DoctorDashboard";
import ReceptionDashboard from "./role/ReceptionDashboard";

// temporary placeholders
function AccountantDashboard() {
    return <div>Accountant dashboard coming soon</div>;
}

function AssistantDashboard() {
    return <div>Assistant dashboard coming soon</div>;
}

const dashboards: Record<UserRole, ComponentType> = {
    admin: AdminDashboard,
    doctor: DoctorDashboard,
    receptionist: ReceptionDashboard,
    accountant: AccountantDashboard,
    assistant: AssistantDashboard,
};

type Props = {
    role?: UserRole;
};

export default function RoleDashboardRouter({
    role = "receptionist",
}: Props) {
    const Component = dashboards[role];

    return <Component />;
}