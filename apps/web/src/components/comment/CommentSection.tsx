/**
 * Comment Section component.
 * Fetches and displays comments for a post, with composer and deletion support.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Send, AlertCircle, RefreshCw, MessageSquare } from 'lucide-react';
import { CommentItem } from './CommentItem';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Skeleton } from '../ui/Skeleton';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import type { Comment, Post } from '../../types';

export interface CommentSectionProps {
  post: Post;
  onPostUpdated?: (updatedPost: Post) => void;
  onProfileClick?: (username: string | null) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  post,
  onPostUpdated,
  onProfileClick,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.comments.list(post.id);
      setComments(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  }, [post.id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() || isSubmitting) return;

    if (!user) {
      showToast('Please sign in to comment', 'info');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await api.comments.create(post.id, newContent.trim());
      setComments((prev) => [...prev, created]);
      setNewContent('');
      showToast('Comment posted', 'success');

      // Update post comments count
      if (onPostUpdated) {
        onPostUpdated({
          ...post,
          commentsCount: post.commentsCount + 1,
        });
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to post comment', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentDeleted = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    if (onPostUpdated) {
      onPostUpdated({
        ...post,
        commentsCount: Math.max(0, post.commentsCount - 1),
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* New comment input */}
      {user ? (
        <form onSubmit={handleCreateComment} className="flex items-start gap-2.5">
          <Avatar src={user.image} name={user.name || user.username} size="sm" />
          <div className="flex-1 flex gap-2">
            <input
              id="comment-input"
              type="text"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Write a comment..."
              disabled={isSubmitting}
              className="flex-1 text-xs rounded-xl border border-slate-200 dark:border-[#2d333b] bg-slate-50 dark:bg-[#121418] px-3 py-2 text-slate-900 dark:text-[#f3f4f6] placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:bg-white dark:focus:bg-[#16181d] focus:ring-2 focus:ring-[#FF3366]/30 focus:border-[#FF3366] transition-colors"
            />
            <Button
              type="submit"
              size="sm"
              variant="primary"
              disabled={!newContent.trim() || isSubmitting}
              isLoading={isSubmitting}
            >
              <Send className="w-3 h-3" />
            </Button>
          </div>
        </form>
      ) : (
        <p className="text-xs text-zinc-400 text-center py-2 bg-[#16181d] border border-[#2d333b] rounded-xl">
          Sign in to join the discussion.
        </p>
      )}

      {/* Comment list states */}
      <div className="pt-2">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-2.5 items-start">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="w-24 h-3" />
                  <Skeleton className="w-full h-3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 flex items-center justify-between text-xs text-rose-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={fetchComments}
              className="font-medium underline hover:text-rose-200 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-6 text-zinc-500">
            <MessageSquare className="w-6 h-6 mx-auto mb-1.5 opacity-40" />
            <p className="text-xs">No comments yet. Be the first to share your thoughts.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#262a32]">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onCommentDeleted={handleCommentDeleted}
                onProfileClick={onProfileClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
