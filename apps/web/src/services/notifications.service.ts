import { apiClient } from "@/lib/api/client";

interface BackendNotification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  actor?: { id: string; name: string; username: string | null; image?: string | null };
  post?: { id: string; content: string };
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'system';
  message: string;
  read: boolean;
  createdAt: string;
  actor?: { id: string; name: string; username: string | null; image?: string | null };
  post?: { id: string; content: string };
}

function normalizeNotification(n: BackendNotification): NotificationItem {
  return {
    id: n.id,
    type: n.type as NotificationItem['type'],
    message: n.message,
    read: n.read,
    createdAt: n.createdAt,
    actor: n.actor,
    post: n.post,
  };
}

export const notificationsService = {
  async list(page = 1, limit = 20): Promise<{ items: NotificationItem[]; total: number }> {
    const res = await apiClient.get<{ data: BackendNotification[]; pagination: { total: number } }>(
      "/api/notifications",
      { page, limit },
    );
    return {
      items: (res.data || []).map(normalizeNotification),
      total: res.pagination?.total ?? 0,
    };
  },

  async markRead(id: string): Promise<void> {
    await apiClient.patch(`/api/notifications/${id}/read`);
  },

  async markAllRead(): Promise<void> {
    await apiClient.post("/api/notifications/read-all");
  },

  async unreadCount(): Promise<number> {
    const res = await apiClient.get<{ data: { count: number } }>("/api/notifications/unread-count");
    return res.data?.count ?? 0;
  },
};
