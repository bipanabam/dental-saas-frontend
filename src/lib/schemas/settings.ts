import { z } from "zod"

export const ClinicIdentitySchema = z.object({

    name: z.string()
    .min(10, "Clinical Organization name must be greater than this."),

    billing_email:
        z.string()
        .email("Invalid email address"),

})

export type PatientCreateInput = z.infer<typeof ClinicIdentitySchema>;