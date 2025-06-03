import { z } from "zod";

export const JobSchema = z.object({
  title : z.string().min(5, "Job title must be at least 5 characters long")
    .max(40, "Job title must be at most 40 characters long"),
  description : z.string().min(20, "Job description must be at least 20 characters long")
    .max(4000, "Job description must be at most 4000 characters long"),
  hourlyPay: z.number().min(2,"Minimum hourly pay is $2").max(200, "Maximum hourly pay is $200"),
})
