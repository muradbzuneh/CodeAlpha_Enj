import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(50, "Name must contain at most 50 characters"),

  image: z
    .url("Image must be a valid URL")
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;