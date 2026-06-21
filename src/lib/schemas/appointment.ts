import { z } from "zod";

import {
  AppointmentTypeEnum as ApiAppointmentTypeEnum,
  AppointmentSourceEnum as ApiAppointmentSourceEnum,
} from "@/lib/api";

const APPOINTMENT_TYPE_VALUES = [
  "BOOKED", "WALK_IN", "FOLLOW_UP", "RESCHEDULED",
] as const satisfies readonly ApiAppointmentTypeEnum[];
export const AppointmentTypeEnum = z.enum(APPOINTMENT_TYPE_VALUES);

const APPOINTMENT_SOURCE_VALUES = [
   "WALK_IN", "ONLINE", "PHONE", "WHATSAPP", "INSTAGRAM", "FRONT_DESK"
] as const satisfies readonly ApiAppointmentSourceEnum[];
export const AppointmentSourceEnum = z.enum(APPOINTMENT_SOURCE_VALUES);

export const procedureSchema = z.object({
  procedure_catalog_id:
    z.string()
      .uuid("Select procedure"),

  tooth_numbers:
    z.array(
      z.number()
    )
      .nullable()
      .optional(),

  estimated_cost:
    z.coerce
      .number()
      .min(0)
      .nullable()
      .optional(),

  estimated_duration_minutes:
    z.coerce
      .number()
      .min(5)
      .max(480)
      .nullable()
      .optional(),

  notes:
    z.string()
      .max(1000)
      .nullable()
      .optional(),
});

export const appointmentSchema =
  z.object({

    patient_id:
      z.string().uuid(),

    doctor_id:
      z.string()
        .uuid()
        .nullable()
        .optional(),

    appointment_type: AppointmentTypeEnum
        .default("BOOKED"),

    appointment_date:
      z.string()
        .min(1),

    duration_minutes:
      z.coerce
        .number()
        .min(5)
        .max(480)
        .default(30),

    chief_complaint:
      z.string()
        .max(1000)
        .nullable()
        .optional(),

    notes:
      z.string()
        .max(3000)
        .nullable()
        .optional(),

    source: AppointmentSourceEnum
        .default("FRONT_DESK"),

    procedures:
      z.array(
        procedureSchema
      )
      .default([]),
  });

export type AppointmentFormInput =
  z.input<
    typeof appointmentSchema
  >;

export type AppointmentInputs =
  z.output<
    typeof appointmentSchema
  >;