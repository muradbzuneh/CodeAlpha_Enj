/**
 * Modal to display a full post with its discussion and comments.
 */

import React from 'react';
import { Modal } from '../ui/Modal';
import { PostCard } from './PostCard';
import { CommentSection } from '../comment/CommentSection';
import type { Post } from '../../types';

export interface PostDetailModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onPostUpdated: (updatedPost: Post) => void;
  onPostDeleted: (postId: string) => void;
  onProfileClick: (username: string) => void;
  onEditClick: (post: Post) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  isOpen,
  onClose,
  onPostUpdated,
  onPostDeleted,
  onProfileClick,
  onEditClick,
}) => {
  if (!post) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Discussion" maxWidth="lg">
      <div className="space-y-5">
        <PostCard
          post={post}
          onPostUpdated={onPostUpdated}
          onPostDeleted={(id) => {
            onPostDeleted(id);
            onClose();
          }}
          onProfileClick={(username) => {
            onProfileClick(username);
            onClose();
          }}
          onEditClick={onEditClick}
        />

        <div className="pt-2 border-t border-slate-100 dark:border-[#262a32]">
          <h4 className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
            Comments
          </h4>
          <CommentSection
            post={post}
            onPostUpdated={onPostUpdated}
            onProfileClick={(username) => {
              onProfileClick(username);
              onClose();
            }}
          />
        </div>
      </div>
    </Modal>
  );
};
