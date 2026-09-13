import { apiClient } from "@/lib/api/client";
import type { Story, CreateStoryInput } from "@/types";

interface BackendStory {
  id: string;
  authorId: string;
  author: { id: string; name: string; username: string; image?: string | null };
  content?: string | null;
  mediaUrl?: string | null;
  gradient: string;
  moodEmoji?: string | null;
  createdAt: string;
  expiresAt: string;
  isViewed?: boolean;
  viewCount?: number;
}

function normalizeStory(data: BackendStory): Story {
  return {
    id: data.id,
    authorId: data.authorId,
    author: data.author,
    textContent: data.content ?? undefined,
    mediaUrl: data.mediaUrl ?? null,
    gradient: data.gradient,
    moodEmoji: data.moodEmoji ?? undefined,
    createdAt: data.createdAt,
    expiresAt: data.expiresAt,
    isViewed: data.isViewed ?? false,
    viewCount: data.viewCount ?? 0,
  };
}

export const storiesService = {
  async getStories(): Promise<Story[]> {
    const res = await apiClient.get<{ data: BackendStory[] }>("/api/stories");
    const data = Array.isArray(res.data) ? res.data : [];
    return data.map(normalizeStory);
  },

  async create(input: CreateStoryInput): Promise<Story> {
    const res = await apiClient.post<{ data: BackendStory }>("/api/stories", {
      textContent: input.textContent,
      mediaUrl: input.mediaUrl,
      gradient: input.gradient,
      moodEmoji: input.moodEmoji,
    });
    return normalizeStory(res.data);
  },

  async markViewed(storyId: string): Promise<void> {
    await apiClient.post(`/api/stories/${storyId}/view`);
  },

  async delete(storyId: string): Promise<void> {
    await apiClient.delete(`/api/stories/${storyId}`);
  },

  async addReaction(storyId: string, content: string): Promise<unknown> {
    const res = await apiClient.post<{ data: unknown }>(`/api/stories/${storyId}/reactions`, { content });
    return res.data;
  },

  async getReactions(storyId: string): Promise<unknown[]> {
    const res = await apiClient.get<{ data: unknown[] }>(`/api/stories/${storyId}/reactions`);
    return Array.isArray(res.data) ? res.data : [];
  },

  async deleteReaction(storyId: string, reactionId: string): Promise<void> {
    await apiClient.delete(`/api/stories/${storyId}/reactions/${reactionId}`);
  },
};
