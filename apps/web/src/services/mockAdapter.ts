/**
 * Fully Interactive & Persistent Mock Store & Adapter for ENJ Social Media Platform
 * 
 * Provides durable client-side state via localStorage so that creating posts,
 * liking, commenting, following, editing profile, and authenticating are 100%
 * interactive, persistent across reloads, and responsive in preview.
 */

import { DEMO_CURRENT_USER, DEMO_USERS, INITIAL_DEMO_POSTS, INITIAL_DEMO_COMMENTS, INITIAL_DEMO_STORIES } from './mockData';
import type { User, Post, Comment, Profile, FollowUserItem, FeedResponse, Story, CreateStoryInput } from '../types';
import type { UpdateProfileInput } from './profile.service';

const STORAGE_KEYS = {
  USER: 'enj_active_session_user_v4',
  USERS: 'enj_directory_users_v4',
  POSTS: 'enj_feed_posts_v4',
  COMMENTS: 'enj_post_comments_v4',
  FOLLOWING: 'enj_following_user_ids_v4',
  STORIES: 'enj_active_stories_v4',
};

function loadStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (err) {
    console.warn(`[ENJ Storage] Failed to load ${key}:`, err);
    return fallback;
  }
}

function saveStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[ENJ Storage] Failed to save ${key}:`, err);
  }
}

// Stateful persistent cache
let currentUser: User | null = loadStored<User | null>(STORAGE_KEYS.USER, { ...DEMO_CURRENT_USER });
let directoryUsers: User[] = loadStored<User[]>(STORAGE_KEYS.USERS, [...DEMO_USERS]);
let posts: Post[] = loadStored<Post[]>(STORAGE_KEYS.POSTS, [...INITIAL_DEMO_POSTS]);
let commentsMap: Record<string, Comment[]> = loadStored<Record<string, Comment[]>>(STORAGE_KEYS.COMMENTS, { ...INITIAL_DEMO_COMMENTS });
let followingIds = new Set<string>(loadStored<string[]>(STORAGE_KEYS.FOLLOWING, ['usr_002', 'usr_003']));
let stories: Story[] = loadStored<Story[]>(STORAGE_KEYS.STORIES, [...INITIAL_DEMO_STORIES]);

// Helper to notify storage changes
function syncPosts() {
  saveStored(STORAGE_KEYS.POSTS, posts);
}
function syncComments() {
  saveStored(STORAGE_KEYS.COMMENTS, commentsMap);
}
function syncFollowing() {
  saveStored(STORAGE_KEYS.FOLLOWING, Array.from(followingIds));
}
function syncUsers() {
  saveStored(STORAGE_KEYS.USERS, directoryUsers);
}
function syncCurrentUser() {
  saveStored(STORAGE_KEYS.USER, currentUser);
}
function syncStories() {
  saveStored(STORAGE_KEYS.STORIES, stories);
}

export const mockAdapter = {
  // Auth
  auth: {
    async getCurrentUser(): Promise<User | null> {
      await new Promise((r) => setTimeout(r, 60));
      return currentUser;
    },

    async signIn(email: string): Promise<User> {
      await new Promise((r) => setTimeout(r, 120));
      const cleanEmail = email.trim().toLowerCase();
      const found = directoryUsers.find((u) => u.email.toLowerCase() === cleanEmail);

      if (found) {
        currentUser = { ...found };
      } else {
        // Fallback user matching email
        const username = cleanEmail.split('@')[0].replace(/[^a-z0-9_]/g, '') || 'member';
        const fallbackUser: User = {
          id: `usr_${Date.now()}`,
          email: cleanEmail,
          name: username.charAt(0).toUpperCase() + username.slice(1),
          username,
          image: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
          bio: 'ENJ community explorer.',
          createdAt: new Date().toISOString(),
        };
        directoryUsers.push(fallbackUser);
        syncUsers();
        currentUser = fallbackUser;
      }

      syncCurrentUser();
      return currentUser;
    },

    async signUp(email: string, _password: string, name: string, username: string): Promise<User> {
      await new Promise((r) => setTimeout(r, 150));
      const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '');
      const existing = directoryUsers.find((u) => u.username.toLowerCase() === cleanUsername);
      if (existing) {
        throw new Error('That username is already taken. Please choose another.');
      }

      const newUser: User = {
        id: `usr_${Date.now()}`,
        email: email.trim().toLowerCase(),
        name: name.trim() || cleanUsername,
        username: cleanUsername,
        image: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        bio: 'Just joined ENJ.',
        createdAt: new Date().toISOString(),
      };

      directoryUsers.push(newUser);
      syncUsers();

      currentUser = newUser;
      syncCurrentUser();

      return newUser;
    },

    async signOut(): Promise<void> {
      await new Promise((r) => setTimeout(r, 60));
      currentUser = null;
      syncCurrentUser();
    },

    async switchPersona(userId: string): Promise<User> {
      const found = directoryUsers.find((u) => u.id === userId);
      if (!found) throw new Error('User not found in directory');
      currentUser = { ...found };
      syncCurrentUser();
      return currentUser;
    },

    getDirectoryUsers(): User[] {
      return [...directoryUsers];
    },
  },

  // Posts
  posts: {
    async getPosts(page = 1, limit = 20): Promise<FeedResponse> {
      await new Promise((r) => setTimeout(r, 80));
      // Sort newest first
      const sorted = [...posts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return {
        posts: sorted,
        pagination: { page, limit, total: sorted.length, hasMore: false },
      };
    },

    async getPostById(id: string): Promise<Post> {
      await new Promise((r) => setTimeout(r, 60));
      const found = posts.find((p) => p.id === id);
      if (!found) throw new Error('Post not found.');
      return found;
    },

    async createPost(content: string, mediaUrl?: string | null): Promise<Post> {
      await new Promise((r) => setTimeout(r, 120));
      const author = currentUser || DEMO_CURRENT_USER;
      const newPost: Post = {
        id: `post_${Date.now()}`,
        content: content.trim(),
        authorId: author.id,
        author: {
          id: author.id,
          name: author.name,
          username: author.username,
          image: author.image,
        },
        createdAt: new Date().toISOString(),
        likesCount: 0,
        commentsCount: 0,
        isLiked: false,
        mediaUrl: mediaUrl || undefined,
      };

      posts = [newPost, ...posts];
      syncPosts();
      return newPost;
    },

    async updatePost(id: string, content: string): Promise<Post> {
      await new Promise((r) => setTimeout(r, 100));
      const index = posts.findIndex((p) => p.id === id);
      if (index === -1) throw new Error('Post not found.');

      posts[index] = {
        ...posts[index],
        content: content.trim(),
        updatedAt: new Date().toISOString(),
      };
      syncPosts();
      return posts[index];
    },

    async deletePost(id: string): Promise<void> {
      await new Promise((r) => setTimeout(r, 100));
      posts = posts.filter((p) => p.id !== id);
      delete commentsMap[id];
      syncPosts();
      syncComments();
    },
  },

  // Feed
  feed: {
    async getPersonalizedFeed(page = 1, limit = 20): Promise<FeedResponse> {
      await new Promise((r) => setTimeout(r, 90));
      // Personalized: own posts + followed users + other recent posts so feed is never bare
      const authorIds = new Set([currentUser?.id || '', ...Array.from(followingIds)]);
      const personalized = posts.filter((p) => authorIds.has(p.authorId));

      const finalPosts = personalized.length > 0 ? personalized : posts;
      const sorted = [...finalPosts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return {
        posts: sorted,
        pagination: { page, limit, total: sorted.length, hasMore: false },
      };
    },

    async getTrendingPosts(page = 1, limit = 20): Promise<FeedResponse> {
      await new Promise((r) => setTimeout(r, 90));
      const sorted = [...posts].sort((a, b) => {
        const scoreA = (a.likesCount * 2) + a.commentsCount;
        const scoreB = (b.likesCount * 2) + b.commentsCount;
        return scoreB - scoreA;
      });

      return {
        posts: sorted,
        pagination: { page, limit, total: sorted.length, hasMore: false },
      };
    },

    async getLikedPosts(page = 1, limit = 20): Promise<FeedResponse> {
      await new Promise((r) => setTimeout(r, 80));
      const liked = posts.filter((p) => Boolean(p.isLiked));
      const sorted = [...liked].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return {
        posts: sorted,
        pagination: { page, limit, total: sorted.length, hasMore: false },
      };
    },
  },

  // Comments
  comments: {
    async getComments(postId: string): Promise<Comment[]> {
      await new Promise((r) => setTimeout(r, 80));
      const list = commentsMap[postId] ? [...commentsMap[postId]] : [];
      return list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    },

    async createComment(postId: string, content: string): Promise<Comment> {
      await new Promise((r) => setTimeout(r, 120));
      const author = currentUser || DEMO_CURRENT_USER;
      const newComment: Comment = {
        id: `com_${Date.now()}`,
        postId,
        content: content.trim(),
        authorId: author.id,
        author: {
          id: author.id,
          name: author.name,
          username: author.username,
          image: author.image,
        },
        createdAt: new Date().toISOString(),
      };

      if (!commentsMap[postId]) {
        commentsMap[postId] = [];
      }
      commentsMap[postId] = [...commentsMap[postId], newComment];
      syncComments();

      // Update post comment count
      const pIdx = posts.findIndex((p) => p.id === postId);
      if (pIdx !== -1) {
        posts[pIdx] = { ...posts[pIdx], commentsCount: posts[pIdx].commentsCount + 1 };
        syncPosts();
      }

      return newComment;
    },

    async deleteComment(commentId: string): Promise<void> {
      await new Promise((r) => setTimeout(r, 100));
      for (const [pId, list] of Object.entries(commentsMap)) {
        const found = list.find((c) => c.id === commentId);
        if (found) {
          commentsMap[pId] = list.filter((c) => c.id !== commentId);
          syncComments();

          const pIdx = posts.findIndex((p) => p.id === pId);
          if (pIdx !== -1) {
            posts[pIdx] = { ...posts[pIdx], commentsCount: Math.max(0, posts[pIdx].commentsCount - 1) };
            syncPosts();
          }
          break;
        }
      }
    },
  },

  // Likes
  likes: {
    async likePost(postId: string) {
      await new Promise((r) => setTimeout(r, 60));
      const pIdx = posts.findIndex((p) => p.id === postId);
      if (pIdx !== -1) {
        posts[pIdx] = {
          ...posts[pIdx],
          isLiked: true,
          likesCount: posts[pIdx].likesCount + 1,
        };
        syncPosts();
        return { isLiked: true, likesCount: posts[pIdx].likesCount };
      }
      return { isLiked: true, likesCount: 1 };
    },

    async unlikePost(postId: string) {
      await new Promise((r) => setTimeout(r, 60));
      const pIdx = posts.findIndex((p) => p.id === postId);
      if (pIdx !== -1) {
        posts[pIdx] = {
          ...posts[pIdx],
          isLiked: false,
          likesCount: Math.max(0, posts[pIdx].likesCount - 1),
        };
        syncPosts();
        return { isLiked: false, likesCount: posts[pIdx].likesCount };
      }
      return { isLiked: false, likesCount: 0 };
    },

    async getPostLikes(postId: string) {
      const p = posts.find((item) => item.id === postId);
      return { isLiked: Boolean(p?.isLiked), likesCount: p?.likesCount || 0 };
    },
  },

  // Users & Follows
  users: {
    async getUserProfile(usernameOrId: string): Promise<Profile> {
      await new Promise((r) => setTimeout(r, 80));
      const normalized = usernameOrId.replace(/^@/, '').toLowerCase();
      let targetUser = directoryUsers.find(
        (u) => u.username.toLowerCase() === normalized || u.id === usernameOrId
      );

      if (!targetUser && currentUser && currentUser.username.toLowerCase() === normalized) {
        targetUser = currentUser;
      }

      if (!targetUser) {
        targetUser = {
          id: `usr_${normalized}`,
          username: normalized,
          name: normalized.charAt(0).toUpperCase() + normalized.slice(1),
          email: `${normalized}@example.com`,
          bio: 'Community member on ENJ.',
          createdAt: '2024-01-01T00:00:00.000Z',
        };
      }

      const userPosts = posts.filter(
        (p) =>
          p.author.username.toLowerCase() === targetUser!.username.toLowerCase() ||
          p.authorId === targetUser!.id
      );
      const isOwn = currentUser
        ? currentUser.id === targetUser.id || currentUser.username.toLowerCase() === targetUser.username.toLowerCase()
        : false;
      const isFollowing = followingIds.has(targetUser.id);

      return {
        id: targetUser.id,
        username: targetUser.username,
        name: targetUser.name,
        bio: targetUser.bio,
        image: targetUser.image,
        postCount: userPosts.length,
        followerCount: isFollowing ? 342 : 341,
        followingCount: 184,
        isFollowing,
        isOwnProfile: isOwn,
        createdAt: targetUser.createdAt,
      };
    },

    async getFollowers(userId: string): Promise<FollowUserItem[]> {
      await new Promise((r) => setTimeout(r, 80));
      return directoryUsers
        .filter((u) => u.id !== userId)
        .map((u) => ({
          id: u.id,
          username: u.username,
          name: u.name,
          image: u.image,
          bio: u.bio,
          isFollowing: followingIds.has(u.id),
        }));
    },

    async getFollowing(userId: string): Promise<FollowUserItem[]> {
      await new Promise((r) => setTimeout(r, 80));
      return directoryUsers
        .filter((u) => followingIds.has(u.id) && u.id !== userId)
        .map((u) => ({
          id: u.id,
          username: u.username,
          name: u.name,
          image: u.image,
          bio: u.bio,
          isFollowing: true,
        }));
    },

    async followUser(userId: string): Promise<{ success: boolean }> {
      await new Promise((r) => setTimeout(r, 80));
      followingIds.add(userId);
      syncFollowing();
      return { success: true };
    },

    async unfollowUser(userId: string): Promise<{ success: boolean }> {
      await new Promise((r) => setTimeout(r, 80));
      followingIds.delete(userId);
      syncFollowing();
      return { success: true };
    },
  },

  // Profile
  profile: {
    async updateProfile(input: UpdateProfileInput): Promise<User> {
      await new Promise((r) => setTimeout(r, 120));
      if (!currentUser) throw new Error('Unauthorized');
      if (input.username && input.username.toLowerCase() === 'taken') {
        throw new Error('That username is already taken.');
      }

      currentUser = {
        ...currentUser,
        ...(input.username ? { username: input.username.toLowerCase().replace(/[^a-z0-9_]/g, '') } : {}),
        ...(input.bio !== undefined ? { bio: input.bio } : {}),
        ...(input.name ? { name: input.name } : {}),
      };
      syncCurrentUser();

      // Update in directory users
      const dirIdx = directoryUsers.findIndex((u) => u.id === currentUser!.id);
      if (dirIdx !== -1) {
        directoryUsers[dirIdx] = { ...currentUser };
        syncUsers();
      }

      // Also update author in existing posts
      posts = posts.map((p) => {
        if (p.authorId === currentUser?.id) {
          return {
            ...p,
            author: {
              ...p.author,
              name: currentUser.name,
              username: currentUser.username,
            },
          };
        }
        return p;
      });
      syncPosts();

      return currentUser;
    },
  },

  // Universal Search
  search: {
    async query(rawQuery: string): Promise<{ posts: Post[]; users: User[] }> {
      await new Promise((r) => setTimeout(r, 80));
      const clean = rawQuery.trim().toLowerCase().replace(/^#/, '').replace(/^@/, '');
      if (!clean) return { posts: [], users: [] };

      const matchedPosts = posts.filter(
        (p) =>
          p.content.toLowerCase().includes(clean) ||
          p.author.name.toLowerCase().includes(clean) ||
          p.author.username.toLowerCase().includes(clean)
      );

      const matchedUsers = directoryUsers.filter(
        (u) =>
          u.username.toLowerCase().includes(clean) ||
          u.name.toLowerCase().includes(clean) ||
          (u.bio && u.bio.toLowerCase().includes(clean))
      );

      return { posts: matchedPosts, users: matchedUsers };
    },
  },

  // Stories
  stories: {
    async getStories(): Promise<Story[]> {
      await new Promise((r) => setTimeout(r, 60));
      const now = Date.now();
      const valid = stories.filter((s) => new Date(s.expiresAt).getTime() > now);
      return [...valid].sort((a, b) => {
        if (a.authorId === currentUser?.id) return -1;
        if (b.authorId === currentUser?.id) return 1;
        if (!a.isViewed && b.isViewed) return -1;
        if (a.isViewed && !b.isViewed) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    },

    async createStory(input: CreateStoryInput): Promise<Story> {
      await new Promise((r) => setTimeout(r, 100));
      const author = currentUser || DEMO_CURRENT_USER;
      const newStory: Story = {
        id: `story_${Date.now()}`,
        authorId: author.id,
        author: {
          id: author.id,
          name: author.name,
          username: author.username,
          image: author.image,
        },
        textContent: input.textContent?.trim(),
        mediaUrl: input.mediaUrl || null,
        gradient: input.gradient,
        moodEmoji: input.moodEmoji,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        isViewed: false,
      };

      stories = [newStory, ...stories];
      syncStories();
      return newStory;
    },

    async markStoryViewed(storyId: string): Promise<void> {
      const idx = stories.findIndex((s) => s.id === storyId);
      if (idx !== -1) {
        stories[idx] = { ...stories[idx], isViewed: true };
        syncStories();
      }
    },

    async deleteStory(storyId: string): Promise<void> {
      stories = stories.filter((s) => s.id !== storyId);
      syncStories();
    },
  },

  // Reset to initial demo state
  resetToDefaults(): void {
    currentUser = { ...DEMO_CURRENT_USER };
    directoryUsers = [...DEMO_USERS];
    posts = [...INITIAL_DEMO_POSTS];
    commentsMap = { ...INITIAL_DEMO_COMMENTS };
    followingIds = new Set<string>(['usr_002', 'usr_003']);
    stories = [...INITIAL_DEMO_STORIES];

    syncCurrentUser();
    syncUsers();
    syncPosts();
    syncComments();
    syncFollowing();
    syncStories();
  },
};
