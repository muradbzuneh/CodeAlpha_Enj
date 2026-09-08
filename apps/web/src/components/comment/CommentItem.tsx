/**
 * Individual Comment Item component.
 * Supports deleting own comment and navigating to author profile.
 */

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { formatTimeAgo } from '../../lib/utils/date';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import type { Comment } from '../../types';

export interface CommentItemProps {
  comment: Comment;
  onCommentDeleted?: (commentId: string) => void;
  onProfileClick?: (username: string | null) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onCommentDeleted,
  onProfileClick,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwnComment = Boolean(user && user.id && comment.authorId && user.id === comment.authorId);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.comments.delete(comment.id);
      showToast('Comment deleted', 'success');
      onCommentDeleted?.(comment.id);
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete comment', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      id={`comment-${comment.id}`}
      className={`flex items-start gap-3 py-3 border-b border-slate-100 dark:border-[#262a32] last:border-b-0 ${
        isDeleting ? 'opacity-40 pointer-events-none' : ''
      }`}
    >
      <div
        onClick={() => onProfileClick?.(comment.author.username)}
        className="cursor-pointer"
      >
        <Avatar src={comment.author.image} name={comment.author.name || comment.author.username || '?'} size="sm" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div
            onClick={() => onProfileClick?.(comment.author.username)}
            className="flex items-center gap-1.5 cursor-pointer group"
          >
            <span className="text-xs font-bold text-slate-900 dark:text-[#f3f4f6] group-hover:text-[#FF3366] dark:group-hover:text-[#FF5E7E] transition-colors">
              {comment.author.name || comment.author.username || 'Unknown'}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-zinc-500">@{comment.author.username || comment.author.name?.toLowerCase().replace(/\s+/g, '')}</span>
            <span className="text-[11px] text-slate-400 dark:text-zinc-500">·</span>
            <time className="text-[11px] text-slate-500 dark:text-zinc-500">{formatTimeAgo(comment.createdAt)}</time>
          </div>

          {isOwnComment && (
            <button
              type="button"
              onClick={handleDelete}
              className="text-slate-400 hover:text-rose-500 dark:text-zinc-500 dark:hover:text-rose-400 p-1 rounded-lg transition-colors cursor-pointer"
              title="Delete comment"
              aria-label="Delete comment"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <p className="text-xs text-slate-700 dark:text-zinc-300 mt-1 leading-relaxed whitespace-pre-wrap break-words">
          {comment.content}
        </p>
      </div>
    </div>
  );
};
