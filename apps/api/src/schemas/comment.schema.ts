import { z } from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment cannot exceed 1000 characters"),
});

export const commentIdSchema = z.object({
  id: z.string().min(1, "Comment id is required"),
});

export const postIdSchema = z.object({
  postId: z.string().min(1, "Post id is required"),
});

export const commentQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});