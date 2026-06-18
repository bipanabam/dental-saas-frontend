export type Permission =
  | "*"
  | "patients.read"
  | "patients.update"
  | "patients.create"
  | "patients.delete"
  | "appointments.create"
  | "appointments.read"
  | "appointments.update"
  | "appointments.checkin"
  | "appointments.complete"
  | "treatments.create"
  | "treatments.read"
  | "treatments.update"
  | "prescriptions.create"
  | "prescriptions.read"
  | "reports.read"
  | "reports.export"
  | "invoices.create"
  | "invoices.read"
  | "payments.create"
  | "payments.read"
  | "inventory.read"
  | "inventory.update";

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  superadmin: ["*"],

  admin: [
    "patients.read",
    "patients.update",
    "patients.create",
    "patients.delete",
    "appointments.create",
    "appointments.read",
    "appointments.update",
    "appointments.checkin",
    "treatments.create",
    "treatments.read",
    "treatments.update",
    "prescriptions.create",
    "prescriptions.read",
    "reports.read",
  ],

  doctor: [
    "patients.read",
    "patients.update",
    "appointments.read",
    "appointments.update",
    "appointments.complete",
    "treatments.create",
    "treatments.read",
    "treatments.update",
    "prescriptions.create",
    "prescriptions.read",
    "reports.read",
  ],

  receptionist: [
    "patients.create",
    "patients.read",
    "patients.update",
    "appointments.create",
    "appointments.read",
    "appointments.update",
    "appointments.checkin",
    "invoices.create",
    "invoices.read",
    "payments.create",
    "payments.read",
  ],

  assistant: [
    "patients.read",
    "appointments.read",
    "treatments.read",
    "inventory.read",
    "inventory.update",
  ],

  accountant: [
    "invoices.read",
    "payments.read",
    "reports.read",
    "reports.export",
  ],
};


export type Role = keyof typeof ROLE_PERMISSIONS;

export const getPermissionsFromRole = (role: Role): Permission[] => {
  return ROLE_PERMISSIONS[role] ?? [];
};