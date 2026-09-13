import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { FollowButton } from '../profile/FollowButton';
import { api } from '../../services/api';

interface SuggestedUser {
  id: string;
  name: string;
  username: string | null;
  image?: string | null;
  bio?: string | null;
  followerCount: number;
  isFollowing: boolean;
}

export interface SuggestedUsersRowProps {
  onProfileClick: (id: string) => void;
}

export const SuggestedUsersRow: React.FC<SuggestedUsersRowProps> = ({ onProfileClick }) => {
  const [users, setUsers] = useState<SuggestedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await api.users.getSuggestions();
        if (mounted) setUsers(res as any);
      } catch {} finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (users.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 px-1">
        Suggested Users
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {users.map((u) => (
          <div
            key={u.id}
            className="shrink-0 w-48 bg-white dark:bg-[#1a1d23] border border-slate-200/80 dark:border-[#2d333b] rounded-2xl p-4 text-center shadow-xs transition-colors"
          >
            <div onClick={() => onProfileClick(u.id)} className="cursor-pointer">
              <Avatar src={u.image} name={u.name} size="md" className="mx-auto" />
              <p className="text-sm font-bold text-slate-900 dark:text-[#f3f4f6] mt-2 truncate">{u.name}</p>
              <p className="text-[11px] text-slate-500 dark:text-zinc-500 truncate">@{u.username}</p>
              {u.bio && (
                <p className="text-[11px] text-slate-600 dark:text-zinc-400 mt-1 line-clamp-2">{u.bio}</p>
              )}
            </div>
            <div className="mt-3">
              <FollowButton userId={u.id} initialIsFollowing={u.isFollowing} size="sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
