/**
 * Notification Service for ENJ Social Media Platform.
 * 
 * Provides real-time notification data with mock/persistent storage via localStorage.
 * Notifications include: likes, comments, follows, and system messages.
 * Adaptive styling for both Default Light (White) mode and Dark mode.
 */

import { DEMO_CURRENT_USER, DEMO_USERS, INITIAL_DEMO_POSTS, INITIAL_DEMO_COMMENTS } from './mockData';
import type { User, Post, Comment } from '../types';
import type { Notification } from '../types';

const NOTIFICATION_STORAGE_KEY = 'enj_notifications_v2';

function loadNotifications(): Notification[] {
  try {
    const item = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (!item) return [];
    return JSON.parse(item) as Notification[];
  } catch (err) {
    console.warn('[ENJ Notifications] Failed to load notifications:', err);
    return [];
  }
}

function saveNotifications(notifications: Notification[]): void {
  try {
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications));
  } catch (err) {
    console.warn('[ENJ Notifications] Failed to save notifications:', err);
  }
}

let notifications: Notification[] = loadNotifications();

export const notificationService = {
  getNotifications(): Notification[] {
    return [...notifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  getUnreadCount(): number {
    return notifications.filter((n) => !n.read).length;
  },

  markAsRead(notificationId: string): void {
    const idx = notifications.findIndex((n) => n.id === notificationId);
    if (idx !== -1) {
      notifications[idx] = { ...notifications[idx], read: true };
      saveNotifications(notifications);
    }
  },

  markAllRead(): void {
    notifications = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(notifications);
  },

  /**
   * Like notification: triggered when someone likes a post
   */
  async likeNotification(postId: string, liker: User): Promise<Notification> {
    const alreadyExists = notifications.some(
      (n) => n.type === 'like' && n.post?.id === postId && n.actor?.id === liker.id
    );

    if (alreadyExists) {
      return notifications.find((n) => n.type === 'like' && n.post?.id === postId && n.actor?.id === liker.id)!;
    }

    const notification: Notification = {
      id: `notif_like_${Date.now()}`,
      type: 'like',
      title: 'New like',
      message: `${liker.username} liked your post`,
      timestamp: new Date().toISOString(),
      read: false,
      actor: {
        id: liker.id,
        username: liker.username,
        name: liker.name,
        image: liker.image,
      },
      post: {
        id: postId,
        content: '',
        authorId: liker.id,
        createdAt: new Date().toISOString(),
        likesCount: 0,
        commentsCount: 0,
        isLiked: false,
      },
    };

    notifications = [notification, ...notifications];
    saveNotifications(notifications);
    return notification;
  },

  /**
   * Comment notification: triggered when someone comments on a post
   */
  async commentNotification(postId: string, commenter: Comment['author'], postAuthor: User): Promise<Notification> {
    const alreadyExists = notifications.some(
      (n) => n.type === 'comment' && n.post?.id === postId && n.actor?.id === commenter.id
    );

    if (alreadyExists) {
      return notifications.find((n) => n.type === 'comment' && n.post?.id === postId && n.actor?.id === commenter.id)!;
    }

    const notification: Notification = {
      id: `notif_comment_${Date.now()}`,
      type: 'comment',
      title: 'New comment',
      message: `${commenter.username} commented on your post`,
      timestamp: new Date().toISOString(),
      read: false,
      actor: {
        id: commenter.id,
        username: commenter.username,
        name: commenter.name,
        image: commenter.image,
      },
      post: {
        id: postId,
        content: '',
        authorId: postAuthor.id,
        createdAt: new Date().toISOString(),
        likesCount: 0,
        commentsCount: 0,
        isLiked: false,
      },
    };

    notifications = [notification, ...notifications];
    saveNotifications(notifications);
    return notification;
  },

  /**
   * Follow notification: triggered when someone follows the user
   */
  async followNotification(follower: User, followingUser: User): Promise<Notification> {
    const alreadyExists = notifications.some(
      (n) => n.type === 'follow' && n.followStatus?.followerId === follower.id
    );

    if (alreadyExists) {
      return notifications.find((n) => n.type === 'follow' && n.followStatus?.followerId === follower.id)!;
    }

    const notification: Notification = {
      id: `notif_follow_${Date.now()}`,
      type: 'follow',
      title: 'New follower',
      message: `${follower.username} started following you`,
      timestamp: new Date().toISOString(),
      read: false,
      actor: {
        id: follower.id,
        username: follower.username,
        name: follower.name,
        image: follower.image,
      },
      followStatus: {
        isFollowing: true,
        followerId: follower.id,
      },
    };

    notifications = [notification, ...notifications];
    saveNotifications(notifications);
    return notification;
  },

  /**
   * Engagement suggestion notification: triggered for suggested interactions
   */
  async engagementSuggestion(targetUser: User, suggestedUser: User): Promise<Notification> {
    const alreadyExists = notifications.some(
      (n) => n.type === 'system' && n.actor?.id === suggestedUser.id && n.message.includes(suggestedUser.username)
    );

    if (alreadyExists) {
      return notifications.find((n) => n.type === 'system' && n.actor?.id === suggestedUser.id && n.message.includes(suggestedUser.username))!;
    }

    const notification: Notification = {
      id: `notif_engage_${Date.now()}`,
      type: 'system',
      title: 'Suggested for you',
      message: `You may know ${suggestedUser.username}`,
      timestamp: new Date().toISOString(),
      read: false,
      actor: {
        id: suggestedUser.id,
        username: suggestedUser.username,
        name: suggestedUser.name,
        image: suggestedUser.image,
      },
    };

    notifications = [notification, ...notifications];
    saveNotifications(notifications);
    return notification;
  },
};