import { z } from "zod";

export const createPostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Post cannot be empty")
    .max(2000, "Post cannot exceed 2000 characters"),
});

export const updatePostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Post cannot be empty")
    .max(2000, "Post cannot exceed 2000 characters"),
});

export const postIdSchema = z.object({
  id: z.string().min(1, "Post id is required"),
});

export const feedQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
