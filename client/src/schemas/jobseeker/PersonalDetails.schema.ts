import { z } from "zod";

export const personalDetailsSchema = z.object({
    firstName: z.string()
        .min(2, "First name must be at least 2 characters")
        .max(25, "First name cannot exceed 25 characters"),
    middleName: z.union([
        z.string()
            .min(2, "Middle name must be at least 2 characters")
            .max(25, "Middle name cannot exceed 25 characters"),
        z.null()
    ]).optional().transform(val => val === undefined ? null : val),
    lastName: z.string()
        .min(2, "Last name must be at least 2 characters"),
    gender: z.enum(["male", "female"], {
        errorMap: () => ({ message: "Please select a valid gender" })
    }),
    // phone: z.string()
    //     .min(9, "Phone number must be at least 9 digits")
    //     .max(15, "Phone number cannot exceed 15 digits")
    //     .regex(/^\+?[0-9]+$/, "Phone number must be a valid phone number"),
});