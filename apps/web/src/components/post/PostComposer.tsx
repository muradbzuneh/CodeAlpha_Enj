/**
 * Post Composer component for ENJ.
 * Allows authenticated users to author and publish posts with text,
 * attached photos (file upload, drag-and-drop, or preset images), and quick emojis.
 * Adaptive styling for both Default White (Light) mode and Dark mode.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, Smile, X, UploadCloud, Hash } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import type { Post } from '../../types';

export interface PostComposerProps {
  onPostCreated?: (newPost: Post) => void;
  placeholder?: string;
  initialContent?: string;
}

const MAX_CHAR_LIMIT = 280;

const QUICK_EMOJIS = ['✨', '☕', '📸', '🌿', '💡', '🔥', '❤️', '🎨'];
const QUICK_TAGS = ['GoldenHour', 'MorningCoffee', 'Ceramics', 'SoundDesign', 'LifeUpdate'];

const PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop&q=80',
];

export const PostComposer: React.FC<PostComposerProps> = ({
  onPostCreated,
  placeholder = "What's on your mind today?",
  initialContent = '',
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [content, setContent] = useState(initialContent);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="bg-white dark:bg-[#1a1d23] border border-slate-200/80 dark:border-[#2d333b] rounded-2xl p-5 text-center shadow-xs transition-colors">
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          Sign in to share your thoughts, publish stories, and join the ENJ community.
        </p>
      </div>
    );
  }

  const charCount = content.length;
  const isOverLimit = charCount > MAX_CHAR_LIMIT;
  const isEmpty = content.trim().length === 0 && !mediaUrl;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPEG, PNG, WebP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be under 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      setMediaUrl(dataUrl);
      setShowMediaPicker(false);
      showToast('Photo attached', 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please drop an image file', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      setMediaUrl(dataUrl);
      setShowMediaPicker(false);
      showToast('Photo attached', 'info');
    };
    reader.readAsDataURL(file);
  };

  const insertEmoji = (emoji: string) => {
    setContent((prev) => (prev ? `${prev} ${emoji}` : emoji));
  };

  const insertTag = (tag: string) => {
    setContent((prev) => (prev ? `${prev} #${tag}` : `#${tag}`));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmpty || isOverLimit || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const createdPost = await api.posts.create(content.trim(), mediaUrl);
      setContent('');
      setMediaUrl(null);
      setShowEmojiPicker(false);
      setShowMediaPicker(false);
      showToast('Post published successfully', 'success');
      onPostCreated?.(createdPost);
    } catch (err: any) {
      const msg = err?.message || 'Failed to publish post. Please try again.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingFile(true);
      }}
      onDragLeave={() => setIsDraggingFile(false)}
      onDrop={handleDrop}
      className={`bg-white dark:bg-[#1a1d23] border ${
        isDraggingFile
          ? 'border-[#FF3366] ring-2 ring-[#FF3366]/20'
          : 'border-slate-200/80 dark:border-[#2d333b]'
      } rounded-2xl p-4 sm:p-5 shadow-xs transition-all relative`}
    >
      {isDraggingFile && (
        <div className="absolute inset-0 bg-white/95 dark:bg-[#1a1d23]/95 rounded-2xl z-20 flex flex-col items-center justify-center pointer-events-none text-[#FF3366]">
          <UploadCloud className="w-10 h-10 animate-bounce mb-1" />
          <p className="text-xs font-bold">Drop photo to attach to post</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex gap-3.5">
          <Avatar src={user.image} name={user.name || user.username} size="md" />

          <div className="flex-1 min-w-0">
            <textarea
              id="post-composer-textarea"
              rows={3}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (error) setError(null);
              }}
              placeholder={placeholder}
              className="w-full text-sm text-slate-900 dark:text-[#f3f4f6] placeholder:text-slate-400 dark:placeholder:text-zinc-500 bg-transparent border-none outline-none resize-none leading-relaxed p-0 focus:ring-0"
              disabled={isSubmitting}
            />

            {/* Attached media preview */}
            {mediaUrl && (
              <div className="relative mt-2 rounded-xl overflow-hidden border border-slate-200/80 dark:border-[#2d333b] max-h-64 bg-slate-100 dark:bg-black/30 group">
                <img
                  src={mediaUrl}
                  alt="Attached preview"
                  className="w-full h-auto object-cover max-h-64"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => setMediaUrl(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-colors cursor-pointer"
                  title="Remove photo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Quick emoji drawer */}
            {showEmojiPicker && (
              <div className="mt-2.5 p-2 bg-slate-50 dark:bg-[#22272e] rounded-xl border border-slate-200/80 dark:border-[#2d333b] flex flex-wrap items-center gap-1.5">
                {QUICK_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => insertEmoji(emoji)}
                    className="p-1.5 hover:bg-white dark:hover:bg-[#1a1d23] rounded-lg text-base transition-transform active:scale-125 cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {/* Photo preset / attachment drawer */}
            {showMediaPicker && (
              <div className="mt-2.5 p-3 bg-slate-50 dark:bg-[#22272e] rounded-xl border border-slate-200/80 dark:border-[#2d333b] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    Attach a photo
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-[#FF3366] font-bold hover:underline cursor-pointer"
                  >
                    Upload from device
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {PHOTO_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setMediaUrl(preset);
                        setShowMediaPicker(false);
                      }}
                      className="aspect-video rounded-lg overflow-hidden border border-slate-200/80 dark:border-[#383f4a] hover:opacity-90 hover:scale-[1.02] transition-transform cursor-pointer"
                    >
                      <img
                        src={preset}
                        alt="Preset preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick topic tags */}
            <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 shrink-0 flex items-center gap-0.5">
                <Hash className="w-2.5 h-2.5" /> Tags:
              </span>
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => insertTag(tag)}
                  className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 hover:bg-slate-200/80 dark:bg-[#22272e] dark:hover:bg-[#2d333b] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-[#f3f4f6] transition-colors whitespace-nowrap cursor-pointer"
                >
                  #{tag}
                </button>
              ))}
            </div>

            {error && <p className="text-xs text-rose-500 font-medium mt-2">{error}</p>}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-[#262a32] flex items-center justify-between">
              {/* Creator tools buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowMediaPicker((prev) => !prev);
                    setShowEmojiPicker(false);
                  }}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    showMediaPicker || mediaUrl
                      ? 'text-[#FF3366] bg-rose-50 dark:bg-rose-950/30'
                      : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#22272e]'
                  }`}
                  title="Attach image"
                  aria-label="Attach photo"
                >
                  <Image className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowEmojiPicker((prev) => !prev);
                    setShowMediaPicker(false);
                  }}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    showEmojiPicker
                      ? 'text-[#FFAA00] bg-amber-50 dark:bg-amber-950/30'
                      : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#22272e]'
                  }`}
                  title="Insert emoji"
                  aria-label="Insert emoji"
                >
                  <Smile className="w-4 h-4" />
                </button>
              </div>

              {/* Character limit and submit */}
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs ${
                    isOverLimit
                      ? 'text-rose-500 font-bold'
                      : charCount > MAX_CHAR_LIMIT - 30
                      ? 'text-amber-500 font-medium'
                      : 'text-slate-400 dark:text-zinc-500'
                  }`}
                >
                  {charCount} / {MAX_CHAR_LIMIT}
                </span>

                <Button
                  id="submit-post-btn"
                  type="submit"
                  size="sm"
                  variant="primary"
                  disabled={isEmpty || isOverLimit || isSubmitting}
                  isLoading={isSubmitting}
                  className="gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
