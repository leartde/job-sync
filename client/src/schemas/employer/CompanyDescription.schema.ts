import { z } from "zod";
const ALLOWED_FILE_TYPES =
    [".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp", ".heic", ".svg"]
export const CompanyDescriptionSchema = z.object({
    description : z.string().min(20,"Description must be at least 20 characters long")
        .max(250,"Description must be at least 450 characters long"),
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
