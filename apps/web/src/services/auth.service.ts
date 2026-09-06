/**
 * Authentication service communicating with Better Auth endpoints on Express backend.
 * Uses HTTP cookies automatically via credentials: 'include'.
 */

import { apiClient } from '../lib/api/client';
import type { User, SessionResponse } from '../types';

export const authService = {
  /**
   * Fetch currently authenticated user via session cookie.
   * Route: GET /api/me
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<User | { user: User }>('/api/me');
      if (!response) return null;
      if ('user' in response && response.user) {
        return response.user;
      }
      return response as User;
    } catch (err: any) {
      if (err?.status === 401) {
        return null;
      }
      throw err;
    }
  },

  /**
   * Sign in using email and password via Better Auth.
   * Route: POST /api/auth/sign-in/email
   */
  async signIn(email: string, password: string): Promise<User> {
    const response = await apiClient.post<{ user: User }>('/api/auth/sign-in/email', {
      email,
      password,
    });
    return response.user;
  },

  /**
   * Sign up using email, password, name, and username via Better Auth.
   * Route: POST /api/auth/sign-up/email
   */
  async signUp(email: string, password: string, name: string, username: string): Promise<User> {
    const response = await apiClient.post<{ user: User }>('/api/auth/sign-up/email', {
      email,
      password,
      name,
      username,
    });
    return response.user;
  },

  /**
   * Sign out and clear Better Auth session cookie.
   * Route: POST /api/auth/sign-out
   */
  async signOut(): Promise<void> {
    await apiClient.post<void>('/api/auth/sign-out');
  },
};
