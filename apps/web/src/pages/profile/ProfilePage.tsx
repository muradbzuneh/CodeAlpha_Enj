/**
 * User Profile Page for ENJ.
 * Route: /profile/:username
 * Displays user identity, stats, posts, follow/unfollow actions, and followers list modal.
 * Interactive tabs: "Posts", "Liked", and "Stories".
 * Adaptive styling for both Default White (Light) mode and Dark mode.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertCircle, ArrowLeft, Heart, MessageSquare, Flame } from 'lucide-react';
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { FollowListModal } from '../../components/profile/FollowListModal';
import { PostCard } from '../../components/post/PostCard';
import { StoryViewerModal } from '../../components/story/StoryViewerModal';
import { ProfileSkeleton, PostSkeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';
import type { Profile, Post, Story } from '../../types';

export interface ProfilePageProps {
  username: string;
  onNavigate: (path: string) => void;
  onCommentClick: (post: Post) => void;
  onEditClick: (post: Post) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  username,
  onNavigate,
  onCommentClick,
  onEditClick,
}) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [userStories, setUserStories] = useState<Story[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'liked' | 'stories'>('posts');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Story viewer modal
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

  // Modal for followers/following
  const [followModalType, setFollowModalType] = useState<'followers' | 'following' | null>(null);

  const cleanUsername = username.replace(/^@/, '');

  const fetchProfileData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const p = await api.users.getProfile(cleanUsername);
      setProfile(p);

      // Fetch posts & stories concurrently
      const [feedRes, allStories] = await Promise.all([
        api.posts.getPosts(1, 50),
        api.stories.getStories(),
      ]);

      const authored = feedRes.posts.filter(
        (post) =>
          post.author.username.toLowerCase() === cleanUsername.toLowerCase() ||
          post.authorId === p.id
      );
      setUserPosts(authored);

      const liked = feedRes.posts.filter((post) => post.isLiked);
      setLikedPosts(liked);

      const stories = allStories.filter(
        (s) =>
          s.authorId === p.id ||
          s.author.username.toLowerCase() === cleanUsername.toLowerCase()
      );
      setUserStories(stories);
    } catch (err: any) {
      setError(err?.message || 'Failed to load user profile.');
    } finally {
      setIsLoading(false);
    }
  }, [cleanUsername]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleFollowChange = (isFollowing: boolean) => {
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            isFollowing,
            followerCount: isFollowing ? prev.followerCount + 1 : Math.max(0, prev.followerCount - 1),
          }
        : null
    );
  };

  const handlePostUpdated = (updated: Post) => {
    setUserPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setLikedPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handlePostDeleted = (deletedId: string) => {
    setUserPosts((prev) => prev.filter((p) => p.id !== deletedId));
    setLikedPosts((prev) => prev.filter((p) => p.id !== deletedId));
    setProfile((prev) => (prev ? { ...prev, postCount: Math.max(0, prev.postCount - 1) } : null));
  };

  const handleOpenStory = (index: number) => {
    setSelectedStoryIndex(index);
    setIsViewerOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* Back button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#22272e] text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-[#f3f4f6] transition-colors cursor-pointer"
          aria-label="Back to feed"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-[#f3f4f6] leading-tight">
            {profile ? profile.name || profile.username : cleanUsername}
          </h2>
          {profile && (
            <p className="text-xs text-slate-500 dark:text-zinc-500">{profile.postCount} posts</p>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <ProfileSkeleton />
          <PostSkeleton />
        </div>
      ) : error ? (
        <div className="bg-white dark:bg-[#1a1d23] border border-rose-200 dark:border-rose-900/40 rounded-2xl p-8 text-center shadow-xs transition-colors">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900 dark:text-[#f3f4f6]">Profile not found</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProfileData}
            className="mt-4 gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </Button>
        </div>
      ) : profile ? (
        <>
          <ProfileHeader
            profile={profile}
            onEditProfileClick={() => onNavigate('/settings/profile')}
            onFollowersClick={() => setFollowModalType('followers')}
            onFollowingClick={() => setFollowModalType('following')}
            onFollowChange={handleFollowChange}
          />

          {/* Profile Navigation Tabs */}
          <div className="flex border-b border-slate-200/80 dark:border-[#2d333b] px-2 gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('posts')}
              className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'posts'
                  ? 'text-[#FF3366]'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Posts</span>
              <span className="text-[11px] opacity-70">({userPosts.length})</span>
              {activeTab === 'posts' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF3366] rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('stories')}
              className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'stories'
                  ? 'text-[#FF3366]'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Stories</span>
              <span className="text-[11px] opacity-70">({userStories.length})</span>
              {activeTab === 'stories' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF3366] rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('liked')}
              className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'liked'
                  ? 'text-[#FF3366]'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Liked</span>
              <span className="text-[11px] opacity-70">({likedPosts.length})</span>
              {activeTab === 'liked' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF3366] rounded-full" />
              )}
            </button>
          </div>

          {/* Posts Tab Content */}
          {activeTab === 'posts' && (
            <div className="space-y-4 pt-1">
              {userPosts.length === 0 ? (
                <div className="bg-white dark:bg-[#1a1d23] border border-slate-200/80 dark:border-[#2d333b] rounded-2xl p-8 text-center text-slate-500 dark:text-zinc-400 shadow-xs transition-colors">
                  <p className="text-xs">@{profile.username} hasn't published any posts yet.</p>
                </div>
              ) : (
                userPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onPostUpdated={handlePostUpdated}
                    onPostDeleted={handlePostDeleted}
                    onProfileClick={(u) => {
                      if (u) onNavigate(`/profile/${u}`);
                      else onNavigate('/settings/profile');
                    }}
                    onCommentClick={onCommentClick}
                    onEditClick={onEditClick}
                  />
                ))
              )}
            </div>
          )}

          {/* Stories Tab Content */}
          {activeTab === 'stories' && (
            <div className="pt-1">
              {userStories.length === 0 ? (
                <div className="bg-white dark:bg-[#1a1d23] border border-slate-200/80 dark:border-[#2d333b] rounded-2xl p-8 text-center text-slate-500 dark:text-zinc-400 shadow-xs transition-colors">
                  <p className="text-xs">No active 24-hour stories from @{profile.username}.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {userStories.map((story, idx) => (
                    <div
                      key={story.id}
                      onClick={() => handleOpenStory(idx)}
                      className={`relative aspect-[9/16] rounded-2xl overflow-hidden bg-gradient-to-br ${story.gradient} p-3.5 flex flex-col justify-between cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md group`}
                    >
                      {story.mediaUrl && (
                        <img
                          src={story.mediaUrl}
                          alt="Story visual"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                      <div className="relative z-10 flex justify-between items-center">
                        <span className="text-lg drop-shadow">{story.moodEmoji || '✨'}</span>
                        <span className="text-[10px] text-white/80 font-medium px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-xs">
                          Active
                        </span>
                      </div>

                      {story.textContent && (
                        <div className="relative z-10 bg-black/40 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                          <p className="text-white text-xs font-medium line-clamp-3 leading-snug">
                            {story.textContent}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Liked Posts Tab Content */}
          {activeTab === 'liked' && (
            <div className="space-y-4 pt-1">
              {likedPosts.length === 0 ? (
                <div className="bg-white dark:bg-[#1a1d23] border border-slate-200/80 dark:border-[#2d333b] rounded-2xl p-8 text-center text-slate-500 dark:text-zinc-400 shadow-xs transition-colors">
                  <p className="text-xs">No liked posts to show yet.</p>
                </div>
              ) : (
                likedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onPostUpdated={handlePostUpdated}
                    onPostDeleted={handlePostDeleted}
                    onProfileClick={(u) => {
                      if (u) onNavigate(`/profile/${u}`);
                      else onNavigate('/settings/profile');
                    }}
                    onCommentClick={onCommentClick}
                    onEditClick={onEditClick}
                  />
                ))
              )}
            </div>
          )}

          {/* Followers / Following Modal */}
          {followModalType && (
            <FollowListModal
              isOpen={Boolean(followModalType)}
              type={followModalType}
              userId={profile.id}
              onClose={() => setFollowModalType(null)}
              onUserClick={(u) => {
                if (u) onNavigate(`/profile/${u}`);
                else onNavigate('/settings/profile');
              }}
            />
          )}

          {/* Story Viewer Modal */}
          <StoryViewerModal
            isOpen={isViewerOpen}
            stories={userStories}
            initialIndex={selectedStoryIndex}
            onClose={() => setIsViewerOpen(false)}
            onStoryDeleted={(id) => setUserStories((prev) => prev.filter((s) => s.id !== id))}
          />
        </>
      ) : null}
    </div>
  );
};
