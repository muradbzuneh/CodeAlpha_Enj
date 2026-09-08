import type { Post, User } from "@/types";

export const SEARCH_ENABLED = false;

export const searchService = {
  async query(_query: string): Promise<{ posts: Post[]; users: User[] }> {
    return { posts: [], users: [] };
  },
};
