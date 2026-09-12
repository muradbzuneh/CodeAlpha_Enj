import { apiClient } from "@/lib/api/client";
import type { User, Post } from "@/types";

interface BackendSearchUser {
  id: string;
  name: string;
  username: string | null;
  image?: string | null;
  bio?: string | null;
  followerCount?: number;
  isFollowing?: boolean;
}

interface BackendPost {
  id: string;
  content: string;
  mediaUrl?: string | null;
  authorId: string;
  createdAt: string;
  author: { id: string; name: string; username: string | null; image?: string | null };
  _count?: { comments: number; likes: number };
  isLiked?: boolean;
}

function normalizePost(data: BackendPost): Post {
  return {
    id: data.id,
    content: data.content,
    mediaUrl: data.mediaUrl ?? null,
    authorId: data.authorId,
    createdAt: data.createdAt,
    updatedAt: data.createdAt,
    author: data.author,
    likesCount: data._count?.likes ?? 0,
    commentsCount: data._count?.comments ?? 0,
    isLiked: data.isLiked ?? false,
  };
}

export const searchService = {
  async query(q: string): Promise<{ posts: Post[]; users: User[] }> {
    if (!q.trim()) return { posts: [], users: [] };

    const isHashtag = q.startsWith("#");
    const posts: Post[] = [];
    const users: User[] = [];

    if (isHashtag) {
      const res = await apiClient.get<{ data: BackendPost[] }>("/api/search/hashtag", { q, limit: 30 });
      posts.push(...(res.data || []).map(normalizePost));
    } else {
      const res = await apiClient.get<{ data: BackendSearchUser[] }>("/api/search/users", { q, limit: 20 });
      users.push(
        ...(res.data || []).map((u) => ({
          id: u.id,
          name: u.name,
          username: u.username,
          email: "",
          image: u.image ?? null,
          bio: u.bio ?? null,
          createdAt: "",
        }))
      );
    }

    return { posts, users };
  },
};
