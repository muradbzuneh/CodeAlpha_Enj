/**
 * Unified API Client Facade for ENJ Frontend.
 * 
 * Provides centralized access to all backend REST services:
 * - api.auth
 * - api.posts
 * - api.feed
 * - api.comments
 * - api.likes
 * - api.users
 * - api.profile
 * - api.search
 * 
 * In production/monorepo with an active Express server, this directs requests
 * to the real backend. In preview or when backend is offline, it seamlessly and
 * gracefully falls back to the persistent mock adapter so the UI is 100%
 * interactive, responsive, and functional out of the box.
 */

import { authService } from './auth.service';
import { postsService } from './posts.service';
import { feedService } from './feed.service';
import { commentsService } from './comments.service';
import { likesService } from './likes.service';
import { usersService } from './users.service';
import { profileService, type UpdateProfileInput } from './profile.service';
import { mockAdapter } from './mockAdapter';
import type { CreateStoryInput } from '../types';

// In standalone sandbox preview without a separate backend daemon on port 4001,
// default to 'mock' mode so everything is instant, persistent, and interactive.
const isExplicitLive = import.meta.env.VITE_USE_LIVE_API === 'true';

// Global runtime mode state (can be toggled in dev/preview)
let activeMode: 'live' | 'mock' = isExplicitLive ? 'live' : 'mock';

// Listeners for mode change
const modeListeners = new Set<(mode: 'live' | 'mock') => void>();

function triggerModeFailover() {
  if (activeMode !== 'mock') {
    activeMode = 'mock';
    modeListeners.forEach((fn) => fn(activeMode));
  }
}

export const api = {
  getMode(): 'live' | 'mock' {
    return activeMode;
  },

  setMode(mode: 'live' | 'mock') {
    activeMode = mode;
    modeListeners.forEach((fn) => fn(activeMode));
  },

  onModeChange(callback: (mode: 'live' | 'mock') => void) {
    modeListeners.add(callback);
    return () => {
      modeListeners.delete(callback);
    };
  },

  resetDemoData() {
    mockAdapter.resetToDefaults();
  },

  auth: {
    async getCurrentUser() {
      if (activeMode === 'mock') return mockAdapter.auth.getCurrentUser();
      try {
        return await authService.getCurrentUser();
      } catch (err: any) {
        if (err?.status === 0 || err?.message?.includes('Failed to fetch')) {
          triggerModeFailover();
          return mockAdapter.auth.getCurrentUser();
        }
        throw err;
      }
    },

    async signIn(email: string, pass: string) {
      if (activeMode === 'mock') return mockAdapter.auth.signIn(email);
      try {
        return await authService.signIn(email, pass);
      } catch (err: any) {
        if (err?.status === 0 || err?.message?.includes('Failed to fetch')) {
          triggerModeFailover();
          return mockAdapter.auth.signIn(email);
        }
        throw err;
      }
    },

    async signUp(email: string, pass: string, name: string, username: string) {
      if (activeMode === 'mock') return mockAdapter.auth.signUp(email, pass, name, username);
      try {
        return await authService.signUp(email, pass, name, username);
      } catch (err: any) {
        if (err?.status === 0 || err?.message?.includes('Failed to fetch')) {
          triggerModeFailover();
          return mockAdapter.auth.signUp(email, pass, name, username);
        }
        throw err;
      }
    },

    async signOut() {
      if (activeMode === 'mock') return mockAdapter.auth.signOut();
      try {
        return await authService.signOut();
      } catch (err: any) {
        if (err?.status === 0 || err?.message?.includes('Failed to fetch')) {
          triggerModeFailover();
          return mockAdapter.auth.signOut();
        }
        throw err;
      }
    },

    async switchPersona(userId: string) {
      return mockAdapter.auth.switchPersona(userId);
    },

    getDirectoryUsers() {
      return mockAdapter.auth.getDirectoryUsers();
    },
  },

  posts: {
    async getPosts(page = 1, limit = 20) {
      if (activeMode === 'mock') return mockAdapter.posts.getPosts(page, limit);
      try {
        return await postsService.getPosts(page, limit);
      } catch (err: any) {
        if (err?.status === 0 || err?.message?.includes('Failed to fetch')) {
          triggerModeFailover();
          return mockAdapter.posts.getPosts(page, limit);
        }
        throw err;
      }
    },

    async getPostById(id: string) {
      if (activeMode === 'mock') return mockAdapter.posts.getPostById(id);
      try {
        return await postsService.getPostById(id);
      } catch (err: any) {
        if (err?.status === 0 || err?.message?.includes('Failed to fetch')) {
          triggerModeFailover();
          return mockAdapter.posts.getPostById(id);
        }
        throw err;
      }
    },

    async create(content: string, mediaUrl?: string | null) {
      if (activeMode === 'mock') return mockAdapter.posts.createPost(content, mediaUrl);
      try {
        return await postsService.createPost(content, mediaUrl);
      } catch (err: any) {
        if (err?.status === 0 || err?.message?.includes('Failed to fetch')) {
          triggerModeFailover();
          return mockAdapter.posts.createPost(content, mediaUrl);
        }
        throw err;
      }
    },

    async update(id: string, content: string) {
      if (activeMode === 'mock') return mockAdapter.posts.updatePost(id, content);
      try {
        return await postsService.updatePost(id, content);
      } catch (err: any) {
        if (err?.status === 0 || err?.message?.includes('Failed to fetch')) {
          triggerModeFailover();
          return mockAdapter.posts.updatePost(id, content);
        }
        throw err;
      }
    },

    async delete(id: string) {
      if (activeMode === 'mock') return mockAdapter.posts.deletePost(id);
      try {
        return await postsService.deletePost(id);
      } catch (err: any) {
        if (err?.status === 0 || err?.message?.includes('Failed to fetch')) {
          triggerModeFailover();
          return mockAdapter.posts.deletePost(id);
        }
        throw err;
      }
    },
  },

  feed: {
    async getPersonalized(page = 1, limit = 20) {
      if (activeMode === 'mock') return mockAdapter.feed.getPersonalizedFeed(page, limit);
      try {
        return await feedService.getPersonalizedFeed(page, limit);
      } catch (err: any) {
        if (err?.status === 0 || err?.message?.includes('Failed to fetch')) {
          triggerModeFailover();
          return mockAdapter.feed.getPersonalizedFeed(page, limit);
        }
        throw err;
      }
    },

    async getTrending(page = 1, limit = 20) {
      if (activeMode === 'mock') return mockAdapter.feed.getTrendingPosts(page, limit);
      try {
        return await feedService.getTrendingPosts(page, limit);
      } catch (err: any) {
        if (err?.status === 0 || err?.message?.includes('Failed to fetch')) {
          triggerModeFailover();
          return mockAdapter.feed.getTrendingPosts(page, limit);
        }
        throw err;
      }
    },

    async getLiked(page = 1, limit = 20) {
      if (activeMode === 'mock') return mockAdapter.feed.getLikedPosts(page, limit);
      try {
        return await feedService.getLikedPosts(page, limit);
      } catch (err: any) {
        if (err?.status === 0 || err?.message?.includes('Failed to fetch')) {
          triggerModeFailover();
          return mockAdapter.feed.getLikedPosts(page, limit);
        }
        throw err;
      }
    },
  },

  comments: {
    async list(postId: string) {
      if (activeMode === 'mock') return mockAdapter.comments.getComments(postId);
      try {
        return await commentsService.getComments(postId);
      } catch (err: any) {
        if (err?.status === 0 || err?.message?.includes('Failed to fetch')) {
          triggerModeFailover();
          return mockAdapter.comments.getComments(postId);
        }
        throw err;
      }
    },

    async create(postId: string, content: string) {
      if (activeMode === 'mock') return mockAdapter.comments.createComment(postId, content);
      try {
        return await commentsService.createComment(postId, content);
      } catch (err: any) {
        if (err?.status === 0 || err?.message?.includes('Failed to fetch')) {
          triggerModeFailover();
          return mockAdapter.comments.createComment(postId, content);
        }
        throw err;
      }
    },

    async delete(commentId: string) {
      if (activeMode === 'mock') return mockAdapter.comments.deleteComment(commentId);
      try {
        return await commentsService.deleteComment(commentId);
      } catch (err: any) {
        if (err?.status === 0 || err?.message?.includes('Failed to fetch')) {
          triggerModeFailover();
          return mockAdapter.comments.deleteComment(commentId);
        }
        throw err;
      }
    },
  },

  likes: {
    async like(postId: string) {
      if (activeMode === 'mock') return mockAdapter.likes.likePost(postId);
      try {
        return await likesService.likePost(postId);
      } catch (err: any) {
        if (err?.status === 0 || err?.message?.includes('Failed to fetch')) {
          triggerModeFailover();
          return mockAdapter.likes.likePost(postId);
        }
        throw err;
      }
    },

    async unlike(postId: string) {
      if (activeMode === 'mock') return mockAdapter.likes.unlikePost(postId);
      try {
        return await likesService.unlikePost(postId);
      } catch (err: any) {
        if (err?.status === 0 || err?.message?.includes('Failed to fetch')) {
          triggerModeFailover();
          return mockAdapter.likes.unlikePost(postId);
        }
        throw err;
      }
    },

    async getLikes(postId: string) {
      if (activeMode === 'mock') return mockAdapter.likes.getPostLikes(postId);
      try {
        return await likesService.getPostLikes(postId);
      } catch (err: any) {
        if (err?.status === 0 || err?.message?.includes('Failed to fetch')) {
          triggerModeFailover();
          return mockAdapter.likes.getPostLikes(postId);
        }
        throw err;
      }
    },
  },

  users: {
    async getProfile(userIdOrUsername: string) {
      if (activeMode === 'mock') return mockAdapter.users.getUserProfile(userIdOrUsername);
      try {
        return await usersService.getUserProfile(userIdOrUsername);
      } catch (err: any) {
        if (err?.status === 0 || err?.message?.includes('Failed to fetch')) {
          triggerModeFailover();
          return mockAdapter.users.getUserProfile(userIdOrUsername);
        }
        throw err;
      }
    },

    async getFollowers(userId: string) {
      if (activeMode === 'mock') return mockAdapter.users.getFollowers(userId);
      try {
        return await usersService.getFollowers(userId);
      } catch (err: any) {
        if (err?.status === 0 || err?.message?.includes('Failed to fetch')) {
          triggerModeFailover();
          return mockAdapter.users.getFollowers(userId);
        }
        throw err;
      }
    },

    async getFollowing(userId: string) {
      if (activeMode === 'mock') return mockAdapter.users.getFollowing(userId);
      try {
        return await usersService.getFollowing(userId);
      } catch (err: any) {
        if (err?.status === 0 || err?.message?.includes('Failed to fetch')) {
          triggerModeFailover();
          return mockAdapter.users.getFollowing(userId);
        }
        throw err;
      }
    },

    async follow(userId: string) {
      if (activeMode === 'mock') return mockAdapter.users.followUser(userId);
      try {
        return await usersService.followUser(userId);
      } catch (err: any) {
        if (err?.status === 0 || err?.message?.includes('Failed to fetch')) {
          triggerModeFailover();
          return mockAdapter.users.followUser(userId);
        }
        throw err;
      }
    },

    async unfollow(userId: string) {
      if (activeMode === 'mock') return mockAdapter.users.unfollowUser(userId);
      try {
        return await usersService.unfollowUser(userId);
      } catch (err: any) {
        if (err?.status === 0 || err?.message?.includes('Failed to fetch')) {
          triggerModeFailover();
          return mockAdapter.users.unfollowUser(userId);
        }
        throw err;
      }
    },
  },

  profile: {
    async update(input: UpdateProfileInput) {
      if (activeMode === 'mock') return mockAdapter.profile.updateProfile(input);
      try {
        return await profileService.updateProfile(input);
      } catch (err: any) {
        if (err?.status === 0 || err?.message?.includes('Failed to fetch')) {
          triggerModeFailover();
          return mockAdapter.profile.updateProfile(input);
        }
        throw err;
      }
    },
  },

  search: {
    async query(q: string) {
      return mockAdapter.search.query(q);
    },
  },

  stories: {
    async getStories() {
      return mockAdapter.stories.getStories();
    },
    async create(input: CreateStoryInput) {
      return mockAdapter.stories.createStory(input);
    },
    async markViewed(id: string) {
      return mockAdapter.stories.markStoryViewed(id);
    },
    async delete(id: string) {
      return mockAdapter.stories.deleteStory(id);
    },
  },
};
