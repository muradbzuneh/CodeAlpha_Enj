/**
 * Comments Service communicating with Express backend.
 * Endpoints:
 * - GET /api/posts/:postId/comments
 * - POST /api/posts/:postId/comments
 * - DELETE /api/comments/:id
 */

import { apiClient } from '../lib/api/client';
import type { Comment, CommentsResponse } from '../types';

export const commentsService = {
  /**
   * Fetch comments for a specific post.
   * Route: GET /api/posts/:postId/comments
   */
  async getComments(postId: string): Promise<Comment[]> {
    const res = await apiClient.get<Comment[] | CommentsResponse>(`/api/posts/${postId}/comments`);
    if (Array.isArray(res)) {
      return res;
    }
    if ('comments' in res) {
      return res.comments;
    }
    return [];
  },

  /**
   * Create a new comment on a post.
   * Route: POST /api/posts/:postId/comments
   */
  async createComment(postId: string, content: string): Promise<Comment> {
    const res = await apiClient.post<Comment | { comment: Comment }>(`/api/posts/${postId}/comments`, { content });
    if ('comment' in res && res.comment) {
      return res.comment;
    }
    return res as Comment;
  },

  /**
   * Delete own comment.
   * Route: DELETE /api/comments/:id
   */
  async deleteComment(commentId: string): Promise<void> {
    await apiClient.delete<void>(`/api/comments/${commentId}`);
  },
};
