import { z } from "zod";

import { BloodGroupEnum as ApiBloodGroupEnum } from "@/lib/api";

const phoneSchema = z
  .string()
  .regex(
    /^\+?[0-9\s-]+$/,
    "Phone number must contain only digits, spaces, dashes, and an optional leading +"
  )
  .refine((value) => value.replace(/[\s-]/g, "").length >= 10, {
    message: "Phone number must be at least 10 digits long",
  });

// Outputs `undefined`, never `null`, to match generated Optional[str] fields.
const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .optional();

const optionalEmail = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .optional()
  .refine((v) => v === undefined || z.string().email().safeParse(v).success, {
    message: "Invalid email address",
  });

const BLOOD_GROUP_VALUES = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-",
] as const satisfies readonly ApiBloodGroupEnum[];
export const BloodGroupEnum = z.enum(BLOOD_GROUP_VALUES);

export const PatientCategoryEnum = z.enum([
  "REGULAR",
  "VIP",
  "INSURANCE",
  "NEW",
  "CHILD",
  "SENIOR",
]);

export const patientCreateFormSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required"),
  last_name: z.string().trim().min(1, "Last name is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),

  gender: z.enum(["MALE", "FEMALE", "OTHER"]).default("OTHER"),
  blood_group: BloodGroupEnum.nullable().optional().transform((v) => v === null ? undefined : v),

  phone: phoneSchema,
  email: optionalEmail,
  address: optionalText,

  category: PatientCategoryEnum.default("REGULAR"),

  allergies: optionalText,
});

export type PatientCreateFormInput = z.input<typeof patientCreateFormSchema>;
export type PatientCreateInputs = z.output<typeof patientCreateFormSchema>;

export const patientUpdateSchema = patientCreateFormSchema.partial().extend({
  status: z.string().optional(),

  last_visit_at: z.string().optional(),

  visit_count: z.number().int().min(0).optional(),
});

export type PatientUpdateInputs = z.infer<typeof patientUpdateSchema>;

/* Medical Record */
export const medicalRecordSchema = z.object({
  allergies: optionalText,

  systemic_conditions: optionalText,
  current_medications: optionalText,

  prior_surgeries: optionalText,

  emergency_contact_name: optionalText,

  emergency_contact_phone: phoneSchema.optional().nullable().transform((v) => v ?? undefined),
});

export type MedicalRecordInputs = z.infer<typeof medicalRecordSchema>;
