import type {
  AppointmentStatusEnum,
  AppointmentSourceEnum,
  AppointmentTypeEnum,
} from "@/lib/api";

export type AppointmentFilters = {
  date_start?: string;
  date_end?: string;

  doctor_id?: string;

  status?: AppointmentStatusEnum;

  appointment_type?: AppointmentTypeEnum;

  source?: AppointmentSourceEnum;
};