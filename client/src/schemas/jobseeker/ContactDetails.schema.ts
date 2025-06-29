import { z } from 'zod';

export const ContactDetailsSchema = z.object({
    phone: z.string()
        .min(9, "Phone number must be at least 9 digits")
        .max(15, "Phone number must be at most 15 digits")
        .regex(/^[0-9+]+$/, "Phone number can only contain numbers and '+'"),

       street: z.string().min(1, "Street address is required"),
            city: z.string().min(2, "City is required"),
            state: z.string().optional(),
            region: z.string().optional(),
            country: z.string().min(1, "Country is required"),
            zipCode: z.number()
                .int("Zip code must be an integer")
                .positive("Zip code must be a positive number")
                .min(10000, "Zip code must be 5 digits long")
                .max(99999, "Zip code must be 5 digits long")

   });
