import { apiClient } from "@/lib/api/client";

interface BackendPost {
  id: string;
  _count?: { likes: number };
}

export const likesService = {
  async like(postId: string): Promise<{ likesCount: number; isLiked: boolean }> {
    await apiClient.post(`/api/posts/${postId}/like`);
    const res = await apiClient.get<{ data: BackendPost }>(`/api/posts/${postId}`);
    return {
      likesCount: res.data?._count?.likes ?? 0,
      isLiked: true,
    };
  },

  async unlike(postId: string): Promise<{ likesCount: number; isLiked: boolean }> {
    await apiClient.delete(`/api/posts/${postId}/like`);
    const res = await apiClient.get<{ data: BackendPost }>(`/api/posts/${postId}`);
    return {
      likesCount: res.data?._count?.likes ?? 0,
      isLiked: false,
    };
  },

  async list(postId: string): Promise<unknown[]> {
    const res = await apiClient.get<{ data: unknown[] }>(`/api/posts/${postId}/likes`);
    return Array.isArray(res.data) ? res.data : [];
  },
};
