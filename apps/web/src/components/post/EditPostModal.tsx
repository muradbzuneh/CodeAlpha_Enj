/**
 * Modal to edit an existing post owned by the current user.
 * Endpoint: PATCH /api/posts/:id
 */

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import type { Post } from '../../types';

export interface EditPostModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onPostUpdated: (updatedPost: Post) => void;
}

export const EditPostModal: React.FC<EditPostModalProps> = ({
  post,
  isOpen,
  onClose,
  onPostUpdated,
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (post) {
      setContent(post.content);
      setError(null);
    }
  }, [post]);

  if (!post) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const updated = await api.posts.update(post.id, content.trim());
      showToast('Post updated successfully', 'success');
      onPostUpdated(updated);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to update post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Post">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          id="edit-post-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={280}
          currentLength={content.length}
          error={error || undefined}
          rows={4}
        />

        <div className="flex justify-end gap-2.5 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!content.trim() || content.trim() === post.content || isSubmitting}
            isLoading={isSubmitting}
          >
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
