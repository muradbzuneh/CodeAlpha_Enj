/**
 * Feed Service communicating with Express backend.
 * Endpoints:
 * - GET /api/feed
 * - GET /api/posts/liked
 * - GET /api/posts/trending
 */

import { apiClient } from '../lib/api/client';
import type { Post, FeedResponse } from '../types';

export const feedService = {
  /**
   * Fetch personalized feed (followed users + own posts).
   * Route: GET /api/feed
   */
  async getPersonalizedFeed(page: number = 1, limit: number = 20): Promise<FeedResponse> {
    const res = await apiClient.get<FeedResponse | Post[]>('/api/feed', { page, limit });
    if (Array.isArray(res)) {
      return { posts: res, pagination: { page, limit, hasMore: false } };
    }
    return res;
  },

  /**
   * Fetch trending / explore posts.
   * Route: GET /api/posts/trending
   */
  async getTrendingPosts(page: number = 1, limit: number = 20): Promise<FeedResponse> {
    const res = await apiClient.get<FeedResponse | Post[]>('/api/posts/trending', { page, limit });
    if (Array.isArray(res)) {
      return { posts: res, pagination: { page, limit, hasMore: false } };
    }
    return res;
  },

  /**
   * Fetch posts liked by authenticated user.
   * Route: GET /api/posts/liked
   */
  async getLikedPosts(page: number = 1, limit: number = 20): Promise<FeedResponse> {
    const res = await apiClient.get<FeedResponse | Post[]>('/api/posts/liked', { page, limit });
    if (Array.isArray(res)) {
      return { posts: res, pagination: { page, limit, hasMore: false } };
    }
    return res;
  },
};
