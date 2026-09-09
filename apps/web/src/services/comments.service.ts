import { apiClient } from "@/lib/api/client";
import type { Comment } from "@/types";

interface BackendComment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  createdAt: string;
  updatedAt?: string;
  author: { id: string; name: string; username?: string; image?: string | null };
}

function normalizeComment(data: BackendComment): Comment {
  return {
    id: data.id,
    content: data.content,
    postId: data.postId,
    authorId: data.authorId,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    author: {
      id: data.author.id,
      name: data.author.name,
      username: data.author.username ?? null,
      image: data.author.image,
    },
  };
}

export const commentsService = {
  async list(postId: string): Promise<Comment[]> {
    const res = await apiClient.get<{ data: BackendComment[] }>(
      `/api/posts/${postId}/comments`,
      { page: 1, limit: 50 },
    );
    const data = res.data;
    if (Array.isArray(data)) return data.map(normalizeComment);
    return [];
  },

  async create(
    postId: string,
    contentOrObj: string | { content: string },
  ): Promise<Comment> {
    const content =
      typeof contentOrObj === "string" ? contentOrObj : contentOrObj.content;
    const res = await apiClient.post<{ data: BackendComment }>(
      `/api/posts/${postId}/comments`,
      { content },
    );
    return normalizeComment(res.data);
  },

  async delete(commentId: string): Promise<void> {
    await apiClient.delete(`/api/comments/${commentId}`);
  },

  async remove(commentId: string): Promise<void> {
    return this.delete(commentId);
  },
};
