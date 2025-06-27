import { z } from "zod";
const ALLOWED_FILE_TYPES =
  [".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp", ".heic", ".svg"]
export const EmployerSchema = z.object({
  name: z.string().min(3,"Company name must be at least 3 characters long")
    .max(30,"Company name must be at most 30 characters long"),
  email: z.string().email("Invalid email address"),
  industry: z.string().min(1,"Industry is required"),
  website:z.string().optional(),
  phone: z.string()
    .min(9, "Phone number must be at least 9 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(/^[0-9+]+$/, "Phone number can only contain numbers and '+'"),
  description : z.string().min(20,"Description must be at least 20 characters long")
    .max(250,"Description must be at most 450 characters long"),
  photo: z.instanceof(File)
    .refine(file => file.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5MB"
    })
    .refine(file => ALLOWED_FILE_TYPES.includes(file.type), {
      message: "Only images are allowed to be uploaded"
    })
    .optional()
    .or(z.literal(undefined))
})
