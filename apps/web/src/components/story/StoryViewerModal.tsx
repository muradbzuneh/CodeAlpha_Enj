import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Send, Trash2 } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import type { Story } from '../../types';

export interface StoryViewerModalProps {
  isOpen: boolean;
  stories: Story[];
  initialIndex?: number;
  onClose: () => void;
  onStoryDeleted?: (storyId: string) => void;
}

const STORY_DURATION_MS = 5000;
const REACTION_EMOJIS = ['❤️', '🔥', '👏', '😂', '😮', '💯'];
const SWIPE_THRESHOLD = 50;

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  isOpen,
  stories,
  initialIndex = 0,
  onClose,
  onStoryDeleted,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string; x: number }[]>([]);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentStory = stories[currentIndex];

  const goToNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (isOpen && currentStory) {
      api.stories.markViewed(currentStory.id).catch(() => {});
    }
  }, [isOpen, currentStory?.id]);

  useEffect(() => {
    if (!isOpen || isPaused || !currentStory) return;

    const interval = 50;
    const step = (interval / STORY_DURATION_MS) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((curr) => curr + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isOpen, isPaused, currentIndex, stories.length, onClose, currentStory]);

  if (!isOpen || !currentStory) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }

    setIsPaused(false);
  };

  const handleReact = (emoji: string) => {
    const id = Date.now();
    const x = Math.random() * 60 + 20;
    setFloatingEmojis((prev) => [...prev, { id, emoji, x }]);
    showToast(`Reacted ${emoji}`, 'info');
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== id));
    }, 1500);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    showToast(`Reply sent to @${currentStory.author.username}`, 'success');
    setReplyText('');
  };

  const handleDeleteStory = async () => {
    try {
      await api.stories.delete(currentStory.id);
      showToast('Story deleted', 'info');
      onStoryDeleted?.(currentStory.id);
      if (stories.length <= 1) {
        onClose();
      } else {
        goToNext();
      }
    } catch (err: any) {
      showToast('Failed to delete story', 'error');
    }
  };

  const isOwnStory = user?.id === currentStory.authorId;

  const timeDiffHours = Math.max(
    1,
    Math.round((Date.now() - new Date(currentStory.createdAt).getTime()) / (1000 * 60 * 60))
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center sm:p-6 bg-black/95 sm:bg-black/90 sm:backdrop-blur-md select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Floating Reaction Emojis */}
      <div className="absolute inset-0 pointer-events-none z-[60] overflow-hidden">
        {floatingEmojis.map((item) => (
          <div
            key={item.id}
            style={{ left: `${item.x}%`, bottom: '20%' }}
            className="absolute text-5xl animate-bounce"
          >
            {item.emoji}
          </div>
        ))}
      </div>

      {/* Main Container — full screen on mobile, card on desktop */}
      <div
        ref={containerRef}
        className="relative w-full h-full sm:w-full sm:max-w-sm sm:h-[85vh] sm:max-h-[700px] sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
      >
        {/* Background gradient or image */}
        <div className={`absolute inset-0 bg-gradient-to-br ${currentStory.gradient} -z-10`} />

        {currentStory.mediaUrl && (
          <img
            src={currentStory.mediaUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover -z-[5]"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none -z-[3]" />

        {/* Top Segmented Progress Bar */}
        <div className="relative z-20 p-3 pt-3 flex items-center gap-1">
          {stories.map((s, idx) => {
            let widthPercent = 0;
            if (idx < currentIndex) widthPercent = 100;
            else if (idx === currentIndex) widthPercent = progress;

            return (
              <div
                key={s.id}
                className="flex-1 h-[2px] bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-75 ease-linear"
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Author Header */}
        <div className="relative z-20 px-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar src={currentStory.author.image} name={currentStory.author.name} size="sm" />
            <div className="min-w-0">
              <span className="text-[13px] font-bold truncate leading-tight block">
                {currentStory.author.name}
              </span>
              <span className="text-[10px] text-white/60 leading-tight">
                {timeDiffHours}h ago
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {isOwnStory && (
              <button
                type="button"
                onClick={handleDeleteStory}
                className="p-2 rounded-full hover:bg-white/20 text-rose-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Delete your story"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Content & Tap Zones */}
        <div className="relative z-20 flex-1 flex items-center justify-center px-12 text-center text-white">
          {/* Tap navigation hotzones */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer"
            onClick={goToPrev}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer"
            onClick={goToNext}
          />

          {/* Story Content */}
          <div className="relative z-10 max-w-[260px] pointer-events-none">
            {currentStory.moodEmoji && (
              <div className="text-5xl mb-4 drop-shadow-lg">{currentStory.moodEmoji}</div>
            )}
            {currentStory.textContent && (
              <p
                className={`font-bold drop-shadow-lg ${
                  currentStory.textContent.length < 60
                    ? 'text-2xl sm:text-3xl leading-tight'
                    : 'text-base sm:text-lg leading-relaxed'
                }`}
              >
                {currentStory.textContent}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Reaction & Reply Bar */}
        <div className="relative z-20 p-4 pt-2 bg-gradient-to-t from-black/80 via-black/30 to-transparent space-y-3">
          {/* Reaction Quick Bar */}
          <div className="flex items-center justify-center gap-3">
            {REACTION_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleReact(emoji)}
                className="text-2xl hover:scale-125 active:scale-90 transition-transform cursor-pointer p-1"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Text Reply Input */}
          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Reply to ${currentStory.author.name.split(' ')[0]}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
              className="flex-1 text-sm rounded-full border border-white/30 bg-white/10 px-4 py-2.5 text-white placeholder:text-white/50 focus:outline-none focus:border-white/60 backdrop-blur-sm"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:bg-white/90 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Desktop Navigation Arrows */}
        {currentIndex > 0 && (
          <button
            type="button"
            onClick={goToPrev}
            className="hidden sm:flex absolute -left-14 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white items-center justify-center cursor-pointer transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {currentIndex < stories.length - 1 && (
          <button
            type="button"
            onClick={goToNext}
            className="hidden sm:flex absolute -right-14 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white items-center justify-center cursor-pointer transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
