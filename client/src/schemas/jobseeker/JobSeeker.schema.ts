import { z } from "zod";

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export const JobSeekerSchema = z.object({
  firstName: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(25, "First name cannot exceed 25 characters"),
  middleName: z.union([
    z.string()
      .min(2, "Middle name must be at least 2 characters")
      .max(25, "Middle name cannot exceed 25 characters"),
    z.null()
  ]).optional(),
  lastName: z.string()
    .min(2, "Last name must be at least 2 characters"),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Please select a valid gender" })
  }),
  phone: z.string()
    .min(9, "Phone number must be at least 9 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(/^[0-9+]+$/, "Phone number can only contain numbers and '+'"),
  resume: z.instanceof(File)
    .refine(file => file.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5MB"
    })
    .refine(file => ALLOWED_FILE_TYPES.includes(file.type), {
      message: "Only PDF and Word documents (.pdf, .doc, .docx) are allowed"
    })
    .optional()
    .or(z.literal(undefined)),
  skills: z.array(z.string().regex(/^[a-zA-Z0-9 ]+$/, "Skill must contain only letters, numbers, and spaces"))
    .max(20, "You can add a maximum of 20 skills")
});
