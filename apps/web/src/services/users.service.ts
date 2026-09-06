/**
 * Users & Follow Service communicating with Express backend.
 * Endpoints:
 * - GET    /api/users/:userId
 * - GET    /api/users/:userId/followers
 * - GET    /api/users/:userId/following
 * - POST   /api/users/:userId/follow
 * - DELETE /api/users/:userId/follow
 */

import { apiClient } from '../lib/api/client';
import type { Profile, FollowUserItem } from '../types';

export const usersService = {
  /**
   * Get user profile by userId or username.
   * Route: GET /api/users/:userId
   */
  async getUserProfile(userIdOrUsername: string): Promise<Profile> {
    const res = await apiClient.get<Profile | { profile: Profile }>(`/api/users/${userIdOrUsername}`);
    if ('profile' in res && res.profile) {
      return res.profile;
    }
    return res as Profile;
  },

  /**
   * Get list of followers for a user.
   * Route: GET /api/users/:userId/followers
   */
  async getFollowers(userId: string): Promise<FollowUserItem[]> {
    const res = await apiClient.get<FollowUserItem[] | { followers: FollowUserItem[] }>(`/api/users/${userId}/followers`);
    if (Array.isArray(res)) {
      return res;
    }
    if ('followers' in res && Array.isArray(res.followers)) {
      return res.followers;
    }
    return [];
  },

  /**
   * Get list of accounts followed by a user.
   * Route: GET /api/users/:userId/following
   */
  async getFollowing(userId: string): Promise<FollowUserItem[]> {
    const res = await apiClient.get<FollowUserItem[] | { following: FollowUserItem[] }>(`/api/users/${userId}/following`);
    if (Array.isArray(res)) {
      return res;
    }
    if ('following' in res && Array.isArray(res.following)) {
      return res.following;
    }
    return [];
  },

  /**
   * Follow a user.
   * Route: POST /api/users/:userId/follow
   */
  async followUser(userId: string): Promise<{ success: boolean }> {
    return await apiClient.post<{ success: boolean }>(`/api/users/${userId}/follow`);
  },

  /**
   * Unfollow a user.
   * Route: DELETE /api/users/:userId/follow
   */
  async unfollowUser(userId: string): Promise<{ success: boolean }> {
    return await apiClient.delete<{ success: boolean }>(`/api/users/${userId}/follow`);
  },
};
