/**
 * Liked Posts Page for ENJ.
 * Route: /liked
 * Fetches posts liked by current user via GET /api/posts/liked.
 * Adaptive styling for both Default Light (White) mode and Dark mode.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Heart, RefreshCw, AlertCircle, LogIn } from 'lucide-react';
import { PostCard } from '../../components/post/PostCard';
import { PostSkeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import type { Post } from '../../types';

export interface LikedPageProps {
  onProfileClick: (username: string) => void;
  onCommentClick: (post: Post) => void;
  onEditClick: (post: Post) => void;
  onNavigate: (path: string) => void;
}

export const LikedPage: React.FC<LikedPageProps> = ({
  onProfileClick,
  onCommentClick,
  onEditClick,
  onNavigate,
}) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLikedPosts = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.feed.getLiked(1, 30);
      setPosts(res.posts);
    } catch (err: any) {
      setError(err?.message || 'Failed to load liked posts.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLikedPosts();
  }, [fetchLikedPosts]);

  const handlePostUpdated = (updated: Post) => {
    if (!updated.isLiked) {
      setPosts((prev) => prev.filter((p) => p.id !== updated.id));
    } else {
      setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    }
  };

  const handlePostDeleted = (deletedId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== deletedId));
  };

  if (!user) {
    return (
      <div className="bg-white dark:bg-[#1a1d23] border border-slate-200/80 dark:border-[#2d333b] rounded-2xl p-10 text-center shadow-xs space-y-4 transition-colors">
        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-[#FF3366] flex items-center justify-center mx-auto">
          <Heart className="w-6 h-6 fill-current" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-[#f3f4f6]">
            Sign in to view your liked posts
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
            Your saved and liked posts are synced to your account.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => onNavigate('/login')}
          className="mx-auto"
        >
          <LogIn className="w-4 h-4 mr-1.5" />
          <span>Sign In</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-[#FF3366] flex items-center justify-center">
            <Heart className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-[#f3f4f6]">
              Liked Posts
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-500">
              Conversations you’ve appreciated
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={fetchLikedPosts}
          disabled={isLoading}
          className="gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ) : error ? (
          <div className="bg-white dark:bg-[#1a1d23] border border-rose-200 dark:border-rose-900/40 rounded-2xl p-6 text-center shadow-xs transition-colors">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#f3f4f6]">
              Error loading liked posts
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLikedPosts}
              className="mt-4"
            >
              Try again
            </Button>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white dark:bg-[#1a1d23] border border-slate-200/80 dark:border-[#2d333b] rounded-2xl p-12 text-center shadow-xs space-y-3 transition-colors">
            <Heart className="w-8 h-8 text-slate-400 dark:text-zinc-600 mx-auto stroke-1" />
            <h3 className="text-base font-bold text-slate-900 dark:text-[#f3f4f6]">
              You haven't liked any posts yet.
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
              Tap the heart icon on posts in your feed or explore page to keep track of conversations that resonate with you.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('/')}
              className="mt-2"
            >
              Browse Feed
            </Button>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPostUpdated={handlePostUpdated}
              onPostDeleted={handlePostDeleted}
              onProfileClick={onProfileClick}
              onCommentClick={onCommentClick}
              onEditClick={onEditClick}
            />
          ))
        )}
      </div>
    </div>
  );
};
