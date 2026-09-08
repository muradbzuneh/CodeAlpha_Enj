/**
 * Right Sidebar Component for desktop layout.
 * Shows suggested profiles to follow, persona switcher for multi-user testing,
 * trending topics, and state status.
 * Adaptive styling for both Default Light (White) mode and Dark mode.
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Radio, Server, Users, ArrowUpRight, RotateCcw } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { FollowButton } from '../profile/FollowButton';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import type { User } from '../../types';

export interface RightSidebarProps {
  onProfileClick: (username: string | null) => void;
  onTopicClick?: (topic: string) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  onProfileClick,
  onTopicClick,
}) => {
  const { user, switchPersona } = useAuth();
  const { showToast } = useToast();
  const [directory, setDirectory] = useState<User[]>([]);
  const [apiMode, setApiMode] = useState<'live' | 'mock'>(api.getMode());
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    // Load directory members
    const allUsers = api.auth.getDirectoryUsers();
    setDirectory(allUsers);

    const unsub = api.onModeChange((mode) => setApiMode(mode));
    return unsub;
  }, []);

  const handleResetData = () => {
    setIsResetting(true);
    try {
      api.resetDemoData();
      showToast('Demo posts, stories, and comments reset to defaults', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } finally {
      setIsResetting(false);
    }
  };

  const trendingTopics = [
    { tag: 'GoldenHour', count: '4.8k stories' },
    { tag: 'MorningCoffee', count: '3.2k posts' },
    { tag: 'Ceramics', count: '1.9k posts' },
    { tag: 'SoundDesign', count: '1.4k posts' },
    { tag: 'ENJStories', count: '2.5k stories' },
  ];

  // Suggestions exclude current user
  const suggestions = directory.filter((u) => u.id !== user?.id).slice(0, 3);

  return (
    <aside className="w-80 shrink-0 sticky top-20 flex flex-col gap-4 h-[calc(100vh-6rem)] pb-4 hidden lg:flex overflow-y-auto pr-1">
      {/* Community Profiles Switcher for interactive testing */}
      <div className="bg-white dark:bg-[#1a1d23] border border-slate-200/80 dark:border-[#2d333b] rounded-2xl p-4 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#FF3366]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Community Profiles
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">Quick switch</span>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-zinc-400 mb-3">
          Experience the feed and publish stories as different members:
        </p>

        <div className="space-y-1.5">
          {directory.slice(0, 4).map((p) => {
            const isSelected = user?.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  switchPersona(p.id);
                  showToast(`Switched persona to ${p.name}`, 'info');
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-50 dark:bg-rose-950/40 border border-[#FF3366]/40 text-slate-900 dark:text-[#f3f4f6]'
                    : 'bg-slate-50 dark:bg-[#121418] border border-slate-200/80 dark:border-[#2d333b] hover:border-slate-300 dark:hover:border-zinc-600 text-slate-700 dark:text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar src={p.image} name={p.name} size="xs" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate leading-tight">{p.name}</p>
                    <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate leading-tight">@{p.username}</p>
                  </div>
                </div>

                {isSelected && (
                  <span className="text-[10px] bg-rose-100 dark:bg-rose-950/60 text-[#FF3366] font-semibold px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Suggested Follows */}
      {suggestions.length > 0 && (
        <div className="bg-white dark:bg-[#1a1d23] border border-slate-200/80 dark:border-[#2d333b] rounded-2xl p-4 shadow-xs transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#FFAA00]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Who to follow
            </h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-[#262a32]">
            {suggestions.map((item) => (
              <div
                key={item.id}
                className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
              >
                <div
                  onClick={() => onProfileClick(item.username)}
                  className="flex items-center gap-2.5 min-w-0 cursor-pointer group flex-1"
                >
                  <Avatar src={item.image} name={item.name} size="sm" />
                  <div className="min-w-0 truncate">
                    <p className="text-xs font-semibold text-slate-900 dark:text-[#f3f4f6] group-hover:underline truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 truncate">@{item.username}</p>
                  </div>
                </div>

                <FollowButton
                  userId={item.id}
                  size="sm"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending Topics */}
      <div className="bg-white dark:bg-[#1a1d23] border border-slate-200/80 dark:border-[#2d333b] rounded-2xl p-4 shadow-xs transition-colors">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-[#FF3366]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Trending on ENJ
          </h3>
        </div>

        <div className="space-y-1.5">
          {trendingTopics.map((topic) => (
            <div
              key={topic.tag}
              onClick={() => onTopicClick?.(topic.tag)}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#22272e] transition-colors cursor-pointer group"
            >
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-[#f3f4f6] group-hover:text-[#FF3366] transition-colors">
                  #{topic.tag}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-zinc-500">{topic.count}</p>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF3366] transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* Persistence & Reset Card */}
      <div className="bg-white dark:bg-[#1a1d23] border border-slate-200/80 dark:border-[#2d333b] rounded-2xl p-3.5 shadow-xs transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-[#FF3366]" />
            <span className="text-xs font-bold text-slate-900 dark:text-[#f3f4f6]">Status</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
            <Radio className="w-2.5 h-2.5 animate-pulse" />
            LIVE & PERSISTENT
          </span>
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-[#262a32] flex items-center justify-between">
          <span className="text-[11px] text-slate-400 dark:text-zinc-500">Reset demo data:</span>
          <button
            type="button"
            onClick={handleResetData}
            disabled={isResetting}
            className="text-[11px] font-medium text-slate-500 hover:text-[#FF3366] dark:text-zinc-400 dark:hover:text-[#FF3366] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset posts & stories</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
