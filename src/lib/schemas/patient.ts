import { z } from "zod"

export const PatientCreateSchema = z.object({

  username:
    z.string()
    .email("Invalid email address"),

  password:
    z.string()
    .min(8,"Password must be at least 8 characters"),

})

export type PatientCreateInput = z.infer<typeof PatientCreateSchema>;