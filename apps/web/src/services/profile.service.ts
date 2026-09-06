/**
 * Profile Settings Service communicating with Express backend.
 * Endpoints:
 * - PATCH /api/profile
 */

import { apiClient } from '../lib/api/client';
import type { Profile, User } from '../types';

export interface UpdateProfileInput {
  username?: string;
  bio?: string;
  name?: string;
}

export const profileService = {
  /**
   * Update authenticated user's profile information.
   * Route: PATCH /api/profile
   */
  async updateProfile(input: UpdateProfileInput): Promise<User> {
    const res = await apiClient.patch<User | { user: User }>('/api/profile', input);
    if ('user' in res && res.user) {
      return res.user;
    }
    return res as User;
  },
};
