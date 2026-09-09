/**
 * Stories Carousel Tray Component for ENJ.
 * 
 * Displays active stories in an interactive horizontal carousel.
 * Includes "+ Your Story" trigger and unread story indicator rings
 * styled with the brand coral-amber sunset gradient.
 */

import React from 'react';
import { Plus, Sparkles, Eye } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import type { Story } from '../../types';

export interface StoryBarProps {
  stories: Story[];
  onOpenStory: (story: Story, index: number) => void;
  onOpenCreateStory: () => void;
}

export const StoryBar: React.FC<StoryBarProps> = ({
  stories,
  onOpenStory,
  onOpenCreateStory,
}) => {
  const { user } = useAuth();

  // Find if current user has an active story
  const myStories = user ? stories.filter((s) => s.authorId === user.id) : [];
  const otherStories = stories.filter((s) => !user || s.authorId !== user.id);

  return (
    <div className="bg-white dark:bg-[#1a1d23] border border-slate-200/80 dark:border-[#2d333b] rounded-2xl p-3.5 sm:p-4 shadow-xs transition-colors">
      <div className="flex items-center gap-3.5 overflow-x-auto pb-1 scrollbar-none select-none">
        {/* "+ Your Story" button */}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div className="group relative">
            <button
              type="button"
              onClick={myStories.length > 0 ? () => onOpenStory(myStories[0], 0) : onOpenCreateStory}
              className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3366] rounded-full block"
              aria-label={myStories.length > 0 ? 'View your story' : 'Create new story'}
            >
              {/* Outer ring */}
              <div
                className={`p-0.5 rounded-full transition-transform duration-200 group-hover:scale-105 ${
                  myStories.length > 0
                    ? 'bg-gradient-to-tr from-[#FF3366] via-[#FF5E7E] to-[#FFAA00]'
                    : 'border-2 border-dashed border-slate-300 dark:border-zinc-600'
                }`}
              >
                <div className="p-0.5 bg-white dark:bg-[#1a1d23] rounded-full">
                  <Avatar
                    src={user?.image}
                    name={user?.name || 'You'}
                    size="md"
                    className="ring-0"
                  />
                </div>
              </div>
            </button>

            {/* Plus badge */}
            <button
              type="button"
              onClick={onOpenCreateStory}
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#FF3366] text-white flex items-center justify-center shadow-xs border-2 border-white dark:border-[#1a1d23] hover:bg-[#EE2055] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              aria-label="Add story"
              title="Add story"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
            </button>
          </div>

          <span className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300 max-w-[64px] truncate text-center">
            {myStories.length > 0 ? 'Your Story' : 'Add Story'}
          </span>
          {myStories.length > 0 && (myStories[0].viewCount ?? 0) > 0 && (
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 flex items-center gap-0.5">
              <Eye className="w-3 h-3" />
              {myStories[0].viewCount}
            </span>
          )}
        </div>

        {/* Community member stories */}
        {otherStories.map((story, index) => {
          const hasUnviewed = !story.isViewed;
          // Actual index in combined array
          const targetIndex = myStories.length > 0 ? index + 1 : index;

          return (
            <button
              key={story.id}
              type="button"
              onClick={() => onOpenStory(story, targetIndex)}
              className="group flex flex-col items-center gap-1.5 shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3366] rounded-full"
            >
              {/* Gradient ring for unread, subtle ring for viewed */}
              <div
                className={`p-0.5 rounded-full transition-transform duration-200 group-hover:scale-105 ${
                  hasUnviewed
                    ? 'bg-gradient-to-tr from-[#FF3366] via-[#FF5E7E] to-[#FFAA00] shadow-xs shadow-[#FF3366]/20'
                    : 'bg-slate-200 dark:bg-zinc-700'
                }`}
              >
                <div className="p-0.5 bg-white dark:bg-[#1a1d23] rounded-full relative">
                  <Avatar
                    src={story.author.image}
                    name={story.author.name}
                    size="md"
                    className="ring-0"
                  />
                  {story.moodEmoji && (
                    <span className="absolute -bottom-1 -right-1 text-xs select-none">
                      {story.moodEmoji}
                    </span>
                  )}
                </div>
              </div>

              <span className="text-[11px] font-medium text-slate-600 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-zinc-200 max-w-[64px] truncate text-center transition-colors">
                {story.author.name.split(' ')[0]}
              </span>
            </button>
          );
        })}

        {/* Quick prompt if list is short */}
        {otherStories.length === 0 && (
          <div className="flex items-center gap-2 pl-3 text-xs text-slate-400 dark:text-zinc-500 italic">
            <Sparkles className="w-3.5 h-3.5 text-[#FF3366]" />
            <span>Be the first to share a story today!</span>
          </div>
        )}
      </div>
    </div>
  );
};
