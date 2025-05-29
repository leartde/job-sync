import { z } from "zod";

export const CompanyDetailsSchema = z.object({
  name: z.string().min(3,"Company name must be at least 3 characters long")
      .max(30,"Company name must be at most 30 characters long"),
    email: z.string().email("Invalid email address"),
    industry: z.string().min(1,"Industry is required"),
   website:z.string().optional()
})
