import { apiClient } from "@/lib/api/client";
import type { User } from "@/types";

interface BackendSearchUser {
  id: string;
  name: string;
  username: string | null;
  image?: string | null;
  bio?: string | null;
  followerCount?: number;
  isFollowing?: boolean;
}

export const searchService = {
  async query(q: string): Promise<{ posts: never[]; users: User[] }> {
    if (!q.trim()) return { posts: [], users: [] };
    const res = await apiClient.get<{ data: BackendSearchUser[] }>("/api/search/users", { q, limit: 20 });
    const users = (res.data || []).map((u) => ({
      id: u.id,
      name: u.name,
      username: u.username,
      email: '',
      image: u.image ?? null,
      bio: u.bio ?? null,
      createdAt: '',
    }));
    return { posts: [], users };
  },
};
