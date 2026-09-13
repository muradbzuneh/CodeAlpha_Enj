/**
 * Reels Page for ENJ.
 * Route: /reels
 * Shows posts with media in a TikTok-style vertical scroll.
 * Falls back to all posts if no media posts exist.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Share2, RefreshCw, AlertCircle } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { VideoPlayer } from '../../components/post/VideoPlayer';
import { ShareDialog } from '../../components/post/ShareDialog';
import { useAuth } from '../../context/AuthContext';
import { resolveMediaUrl } from '../../lib/resolveMediaUrl';
import { api } from '../../services/api';
import type { Post } from '../../types';

export interface ReelsPageProps {
  onProfileClick: (username: string | null) => void;
  onCommentClick?: (post: Post) => void;
}

export const ReelsPage: React.FC<ReelsPageProps> = ({ onProfileClick, onCommentClick }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.feed.getPersonalized(1, 50);
      // Show all posts, prioritizing those with media
      const allPosts = res.posts || [];
      const withMedia = allPosts.filter((p) => p.mediaUrl);
      const withoutMedia = allPosts.filter((p) => !p.mediaUrl);
      setPosts([...withMedia, ...withoutMedia]);
    } catch (err: any) {
      setError(err?.message || 'Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const currentPost = posts[currentIndex];

  const handleNext = () => {
    if (currentIndex < posts.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(posts.length - 1);
    }
  };

  const handleLike = async () => {
    if (!currentPost || !user) return;
    setLikeAnimating(true);

    const wasLiked = currentPost.isLiked;
    const prevCount = currentPost.likesCount;

    // Optimistic update
    setPosts((prev) =>
      prev.map((p, i) => {
        if (i !== currentIndex) return p;
        return {
          ...p,
          isLiked: !wasLiked,
          likesCount: wasLiked ? prevCount - 1 : prevCount + 1,
        };
      })
    );

    try {
      if (wasLiked) {
        await api.likes.unlike(currentPost.id);
      } else {
        await api.likes.like(currentPost.id);
      }
    } catch {
      // Rollback
      setPosts((prev) =>
        prev.map((p, i) => {
          if (i !== currentIndex) return p;
          return { ...p, isLiked: wasLiked, likesCount: prevCount };
        })
      );
    } finally {
      setTimeout(() => setLikeAnimating(false), 300);
    }
  };

  const handleShare = () => {
    setIsShareOpen(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto py-2">
        <div className="flex items-center justify-between px-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF3366]" />
            <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-[#f3f4f6]">Reels</h1>
          </div>
        </div>
        <div className="aspect-[9/16] w-full max-h-[75vh] rounded-3xl bg-slate-100 dark:bg-[#1a1d23] flex items-center justify-center">
          <RefreshCw className="w-6 h-6 text-slate-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || posts.length === 0) {
    return (
      <div className="max-w-md mx-auto py-2">
        <div className="flex items-center justify-between px-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF3366]" />
            <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-[#f3f4f6]">Reels</h1>
          </div>
        </div>
        <div className="aspect-[9/16] w-full max-h-[75vh] rounded-3xl bg-white dark:bg-[#1a1d23] border border-slate-200/80 dark:border-[#2d333b] flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="w-8 h-8 text-slate-400 mb-3" />
          <p className="text-sm font-medium text-slate-900 dark:text-[#f3f4f6]">No posts to show</p>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Create a post with an image to see it here</p>
          <button onClick={fetchPosts} className="mt-4 text-xs text-[#FF3366] font-medium hover:underline cursor-pointer">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-2">
      {/* Top Header */}
      <div className="flex items-center justify-between px-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#FF3366]" />
          <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-[#f3f4f6]">Reels</h1>
        </div>
        <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
          {currentIndex + 1} of {posts.length}
        </span>
      </div>

      {/* Main Reel Viewer */}
      <div className="relative aspect-[9/16] w-full max-h-[75vh] sm:max-h-[80vh] rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-200/80 dark:border-[#2d333b] select-none">
        {/* Post Image / Content */}
        {currentPost.mediaUrl ? (
          /\.(mp4|webm|ogg|mov|avi|mkv|quicktime)$/i.test(currentPost.mediaUrl) || currentPost.mediaUrl.includes('video') ? (
            <VideoPlayer src={resolveMediaUrl(currentPost.mediaUrl)} className="w-full h-full" autoPlay muted />
          ) : (
            <img
              src={resolveMediaUrl(currentPost.mediaUrl)}
              alt={currentPost.content}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          )
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#FF3366] via-[#FF6B6B] to-[#FFAA00] flex items-center justify-center p-8">
            <p className="text-white text-lg font-bold text-center leading-relaxed">
              {currentPost.content}
            </p>
          </div>
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

        {/* Right side action buttons */}
        <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
          {/* Like */}
          <button
            type="button"
            onClick={handleLike}
            className="flex flex-col items-center gap-1 cursor-pointer"
          >
            <div className={`w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center transition-transform ${likeAnimating ? 'scale-125' : ''}`}>
              <Heart
                className={`w-5 h-5 transition-colors ${currentPost.isLiked ? 'fill-[#FF3366] text-[#FF3366]' : 'text-white'}`}
              />
            </div>
            <span className="text-[11px] text-white font-medium">{currentPost.likesCount}</span>
          </button>

          {/* Comment */}
          <button
            type="button"
            onClick={() => onCommentClick?.(currentPost)}
            className="flex flex-col items-center gap-1 cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-[11px] text-white font-medium">{currentPost.commentsCount}</span>
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            className="flex flex-col items-center gap-1 cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-[11px] text-white font-medium">Share</span>
          </button>
        </div>

        {/* Bottom info overlay */}
        <div className="absolute left-4 right-16 bottom-6 z-10">
          {/* Creator info */}
          <div
            onClick={() => onProfileClick(currentPost.author.username || currentPost.author.id)}
            className="flex items-center gap-2.5 mb-3 cursor-pointer"
          >
            <Avatar
              src={currentPost.author.image}
              name={currentPost.author.name || currentPost.author.username || '?'}
              size="sm"
              className="w-9 h-9 border-2 border-white"
            />
            <div>
              <p className="text-sm font-bold text-white drop-shadow-lg">
                {currentPost.author.name || 'Unknown'}
              </p>
              <p className="text-[11px] text-white/70">
                @{currentPost.author.username || 'user'}
              </p>
            </div>
          </div>

          {/* Caption */}
          <p className="text-sm text-white/90 leading-relaxed drop-shadow-lg line-clamp-3">
            {currentPost.content}
          </p>
        </div>

        {/* Navigation arrows */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute top-1/2 left-2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors cursor-pointer opacity-0 hover:opacity-100"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="absolute top-1/2 right-14 bottom-24 translate-y-0 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors cursor-pointer opacity-0 hover:opacity-100"
        >
          ↓
        </button>

        {/* Scroll hint */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 opacity-50">
          <div className="w-0.5 h-0.5 rounded-full bg-white" />
          <div className="w-0.5 h-0.5 rounded-full bg-white" />
          <div className="w-0.5 h-0.5 rounded-full bg-white" />
        </div>
      </div>

      <ShareDialog
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        postUrl={window.location.origin + `/?post=${currentPost?.id}`}
        postContent={currentPost?.content || ''}
      />
    </div>
  );
};
