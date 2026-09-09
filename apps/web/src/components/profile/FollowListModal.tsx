/**
 * Modal to display followers or following list for a user.
 * Endpoints: GET /api/users/:userId/followers or GET /api/users/:userId/following
 */

import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Avatar } from '../ui/Avatar';
import { FollowButton } from './FollowButton';
import { Skeleton } from '../ui/Skeleton';
import { api } from '../../services/api';
import type { FollowUserItem } from '../../types';

export interface FollowListModalProps {
  userId: string;
  type: 'followers' | 'following';
  isOpen: boolean;
  onClose: () => void;
  onUserClick: (userId: string) => void;
}

export const FollowListModal: React.FC<FollowListModalProps> = ({
  userId,
  type,
  isOpen,
  onClose,
  onUserClick,
}) => {
  const [users, setUsers] = useState<FollowUserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !userId) return;

    let mounted = true;
    setIsLoading(true);
    setError(null);

    const fetchList = async () => {
      try {
        const data =
          type === 'followers'
            ? await api.users.getFollowers(userId)
            : await api.users.getFollowing(userId);
        if (mounted) {
          setUsers(data);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err?.message || `Failed to load ${type}`);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchList();

    return () => {
      mounted = false;
    };
  }, [isOpen, userId, type]);

  const title = type === 'followers' ? 'Followers' : 'Following';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="max-h-96 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="space-y-4 py-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="w-24 h-3.5" />
                    <Skeleton className="w-16 h-3" />
                  </div>
                </div>
                <Skeleton className="w-16 h-7 rounded-xl" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-xs text-rose-400 text-center py-4">{error}</p>
        ) : users.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-6">
            {type === 'followers' ? 'No followers yet.' : 'Not following anyone yet.'}
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-[#262a32]">
            {users.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-[#22272e] -mx-2 px-2 rounded-xl transition-colors"
                onClick={() => {
                  onUserClick(item.id);
                  onClose();
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar src={item.image} name={item.name} size="sm" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-[#f3f4f6] truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-500 truncate">@{item.username}</p>
                  </div>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <FollowButton
                    userId={item.id}
                    initialIsFollowing={item.isFollowing}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
