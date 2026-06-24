import { z } from "zod";

const phoneSchema = z
  .string()
  .regex(
    /^\+?[0-9\s-]+$/,
    "Phone number must contain only digits, spaces, dashes, and an optional leading +"
  )
    .transform((v) => (v === "" ? undefined : v))
  .optional()
  .refine((value) => value === undefined || value.replace(/[\s-]/g, "").length >= 10, {
    message: "Phone number must be at least 10 digits long",
  });

export const nepalPhoneSchema = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .optional()
  .refine(
    (v) => {
      if (v === undefined) return true;
      const digits = v.replace(/[\s-]/g, "");
      return digits.length >= 9 && digits.length <= 10;
    },
    { message: "Enter a valid 9-10 digit Nepal number" }
  )
  .transform((v) =>
    // Send plain digits only — backend stores without prefix
    v ? v.replace(/[\s-]/g, "") : undefined
  );

const requiredEmail = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Invalid email address");

const optionalEmail = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .optional()
  .refine(
    (v) => v === undefined || z.string().email().safeParse(v).success,
    { message: "Invalid email address" }
  );

export const RoleEnum = z.enum([
  "admin",
  "doctor",
  "receptionist",
  "accountant",
  "assistant",
  "accountant",
]);

export const userCreateFormSchema = z.object({
  email:  requiredEmail,
  username: z.string().trim().min(1, "Username is required"),

  password: z.string().min(8, "Password must be at least 8 characters"),
  phone_number: nepalPhoneSchema,
  role: RoleEnum.default("receptionist"),
});

export type UserCreateFormInput = z.input<typeof userCreateFormSchema>;
export type UserCreateInputs = z.output<typeof userCreateFormSchema>;


export const userUpdateFormSchema = z.object({
  email: optionalEmail,
  username: z.string().trim().min(1, "Username is required").optional(),
  phone_number: nepalPhoneSchema,
  role: RoleEnum.optional(),
  is_active: z.boolean().optional(),
  is_verified: z.boolean().optional(),
});

export type UserUpdateFormInput = z.input<typeof userUpdateFormSchema>;
export type UserUpdateInputs = z.output<typeof userUpdateFormSchema>;
