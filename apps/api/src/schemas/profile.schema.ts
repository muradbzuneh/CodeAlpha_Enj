import { z } from "zod";

export const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must contain at least 3 characters")
  .max(30, "Username must contain at most 30 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores",
  );

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name must contain at least 1 character")
    .max(50, "Name must contain at most 50 characters")
    .optional(),
  username: usernameSchema.optional(),
  bio: z
    .string()
    .trim()
    .max(200, "Bio must contain at most 200 characters")
    .optional()
    .nullable(),
  image: z.string().optional(),
  bannerUrl: z.string().optional(),
});

export const usernameCheckSchema = z.object({
  username: usernameSchema,
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UsernameCheckInput = z.infer<typeof usernameCheckSchema>;
