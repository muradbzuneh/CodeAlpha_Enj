/**
 * Likes Service communicating with Express backend.
 * Endpoints:
 * - GET    /api/posts/:postId/likes
 * - POST   /api/posts/:postId/like
 * - DELETE /api/posts/:postId/like
 */

import { apiClient } from '../lib/api/client';

export interface LikeResponse {
  likesCount: number;
  isLiked: boolean;
}

export const likesService = {
  /**
   * Like a post.
   * Route: POST /api/posts/:postId/like
   */
  async likePost(postId: string): Promise<LikeResponse> {
    return await apiClient.post<LikeResponse>(`/api/posts/${postId}/like`);
  },

  /**
   * Unlike a post.
   * Route: DELETE /api/posts/:postId/like
   */
  async unlikePost(postId: string): Promise<LikeResponse> {
    return await apiClient.delete<LikeResponse>(`/api/posts/${postId}/like`);
  },

  /**
   * Get post likes count and liked state.
   * Route: GET /api/posts/:postId/likes
   */
  async getPostLikes(postId: string): Promise<LikeResponse> {
    return await apiClient.get<LikeResponse>(`/api/posts/${postId}/likes`);
  },
};
