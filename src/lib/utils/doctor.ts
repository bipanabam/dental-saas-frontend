import { AppSchemasCommonDoctorMini as DoctorMini } from "../api";

export function getDoctorDisplayName(doctor?: DoctorMini | null): string {
  return doctor?.full_name ?? doctor?.email.split("@")[0] ?? "Unassigned";
}