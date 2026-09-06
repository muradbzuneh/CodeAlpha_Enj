/**
 * Posts Service communicating with Express backend.
 * Endpoints:
 * - POST   /api/posts
 * - GET    /api/posts
 * - GET    /api/posts/:id
 * - PATCH  /api/posts/:id
 * - DELETE /api/posts/:id
 */

import { apiClient } from '../lib/api/client';
import type { Post, FeedResponse } from '../types';

export const postsService = {
  /**
   * Fetch paginated posts list.
   * Route: GET /api/posts
   */
  async getPosts(page: number = 1, limit: number = 20): Promise<FeedResponse> {
    const res = await apiClient.get<FeedResponse | Post[]>('/api/posts', { page, limit });
    if (Array.isArray(res)) {
      return { posts: res, pagination: { page, limit, hasMore: false } };
    }
    return res;
  },

  /**
   * Fetch single post by ID.
   * Route: GET /api/posts/:id
   */
  async getPostById(id: string): Promise<Post> {
    const res = await apiClient.get<Post | { post: Post }>(`/api/posts/${id}`);
    if ('post' in res && res.post) {
      return res.post;
    }
    return res as Post;
  },

  /**
   * Create a new post.
   * Route: POST /api/posts
   */
  async createPost(content: string, mediaUrl?: string | null): Promise<Post> {
    const res = await apiClient.post<Post | { post: Post }>('/api/posts', { content, mediaUrl });
    if ('post' in res && res.post) {
      return res.post;
    }
    return res as Post;
  },

  /**
   * Update post owned by current user.
   * Route: PATCH /api/posts/:id
   */
  async updatePost(id: string, content: string): Promise<Post> {
    const res = await apiClient.patch<Post | { post: Post }>(`/api/posts/${id}`, { content });
    if ('post' in res && res.post) {
      return res.post;
    }
    return res as Post;
  },

  /**
   * Delete post owned by current user.
   * Route: DELETE /api/posts/:id
   */
  async deletePost(id: string): Promise<void> {
    await apiClient.delete<void>(`/api/posts/${id}`);
  },
};
