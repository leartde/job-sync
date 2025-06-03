import { z } from "zod";

export const AddressSchema = z.object({
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
})
