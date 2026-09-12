import { apiClient } from "@/lib/api/client";

export const bookmarkService = {
  async toggle(postId: string): Promise<{ isBookmarked: boolean }> {
    const res = await apiClient.post<{ data: { isBookmarked: boolean } }>(`/api/posts/${postId}/bookmark`);
    return res.data;
  },

  async check(postIds: string[]): Promise<Record<string, boolean>> {
    if (postIds.length === 0) return {};
    const res = await apiClient.get<{ data: Record<string, boolean> }>("/api/bookmarks/check", {
      postIds: postIds.join(","),
    });
    return res.data || {};
  },
};
