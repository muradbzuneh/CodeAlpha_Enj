/**
 * Reels Page for ENJ.
 * Route: /reels
 * Displays full-height vertical video reels with creator info,
 * likes, comments, music track details, and smooth navigation.
 * Adaptive styling for both Default White (Light) mode and Dark mode.
 */

import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Music, Play, Pause, ChevronUp, ChevronDown, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export interface ReelItem {
  id: string;
  creator: {
    name: string;
    username: string;
    image: string;
    isFollowing?: boolean;
  };
  videoUrl: string;
  posterUrl: string;
  caption: string;
  musicTrack: string;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  tags: string[];
}

const SAMPLE_REELS: ReelItem[] = [
  {
    id: 'reel-1',
    creator: {
      name: 'Sofia Lin',
      username: 'sofialin',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isFollowing: false,
    },
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-coffee-cup-with-latte-art-and-coffee-beans-43183-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    caption: 'Dialing in the morning espresso roast. The natural crema on this Ethiopian bean is unbelievable ✨☕',
    musicTrack: 'Tokyo Tea House — Chill Lofi Beats',
    likesCount: 1420,
    commentsCount: 84,
    isLiked: false,
    tags: ['MorningRoutine', 'Espresso', 'Vibe'],
  },
  {
    id: 'reel-2',
    creator: {
      name: 'Marcus Vance',
      username: 'marcusvance',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      isFollowing: true,
    },
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-analog-synthesizer-sound-mixer-close-up-42861-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
    caption: 'Late night modular synth exploration in 7/8 time. Tape echo warms everything up perfectly 🎛️⚡',
    musicTrack: 'Original Audio — Marcus Vance Live Session',
    likesCount: 2310,
    commentsCount: 156,
    isLiked: true,
    tags: ['ModularSynth', 'AnalogWarmth', 'StudioLife'],
  },
  {
    id: 'reel-3',
    creator: {
      name: 'Elena Rostova',
      username: 'elenarostova',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      isFollowing: false,
    },
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-potter-shaping-a-clay-pot-on-a-wheel-42857-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    caption: 'Trimming foot rings on this batch of matcha bowls. The rhythm of the wheel is pure meditation 🏺🌿',
    musicTrack: 'Nils Frahm — Ambre (Ceramic Edit)',
    likesCount: 3890,
    commentsCount: 210,
    isLiked: false,
    tags: ['Ceramics', 'Handmade', 'SlowLiving'],
  },
  {
    id: 'reel-4',
    creator: {
      name: 'Kai Takahashi',
      username: 'kaitakahashi',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      isFollowing: false,
    },
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-neon-lights-in-a-busy-street-at-night-42858-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
    caption: 'Rainy evening walks through Shinjuku alleys with the 35mm f/1.4 lens. Neon reflections hit different 📸🌧️',
    musicTrack: 'Midnight City — Ambient Lo-fi Echoes',
    likesCount: 4520,
    commentsCount: 312,
    isLiked: false,
    tags: ['TokyoStreets', '35mm', 'NightPhotography'],
  },
];

export interface ReelsPageProps {
  onProfileClick: (username: string | null) => void;
  onCommentClick?: (reel: ReelItem) => void;
}

export const ReelsPage: React.FC<ReelsPageProps> = ({ onProfileClick }) => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [reels, setReels] = useState<ReelItem[]>(SAMPLE_REELS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const currentReel = reels[currentIndex];

  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(reels.length - 1);
    }
  };

  const handleLike = () => {
    setReels((prev) =>
      prev.map((r, i) => {
        if (i !== currentIndex) return r;
        const willBeLiked = !r.isLiked;
        return {
          ...r,
          isLiked: willBeLiked,
          likesCount: willBeLiked ? r.likesCount + 1 : Math.max(0, r.likesCount - 1),
        };
      })
    );
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Reel link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="max-w-md mx-auto py-2">
      {/* Top Header */}
      <div className="flex items-center justify-between px-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#FF3366]" />
          <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-[#f3f4f6]">
            Reels
          </h1>
        </div>
        <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
          {currentIndex + 1} of {reels.length}
        </span>
      </div>

      {/* Main Reel Viewer Container */}
      <div className="relative aspect-[9/16] w-full max-h-[75vh] sm:max-h-[80vh] rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-200/80 dark:border-[#2d333b] select-none">
        {/* Background Visual / Video */}
        <video
          key={currentReel.videoUrl}
          src={currentReel.videoUrl}
          poster={currentReel.posterUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => setIsPlaying(!isPlaying)}
          ref={(videoElement) => {
            if (videoElement) {
              if (isPlaying) {
                videoElement.play().catch(() => {});
              } else {
                videoElement.pause();
              }
            }
          }}
        />

        {/* Gradient overlays for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

        {/* Top Controls: Sound & Play State */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-transform active:scale-90 cursor-pointer"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-transform active:scale-90 cursor-pointer"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          </button>
        </div>

        {/* Right Action Bar */}
        <div className="absolute right-3.5 bottom-16 flex flex-col items-center gap-5 z-20">
          {/* Like */}
          <button
            type="button"
            onClick={handleLike}
            className="flex flex-col items-center gap-1 text-white cursor-pointer group"
          >
            <div
              className={`p-3 rounded-full backdrop-blur-md transition-all ${
                currentReel.isLiked
                  ? 'bg-rose-500 text-white scale-110'
                  : 'bg-black/40 group-hover:bg-black/60 text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${currentReel.isLiked ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[11px] font-bold drop-shadow">
              {currentReel.likesCount.toLocaleString()}
            </span>
          </button>

          {/* Comments */}
          <button
            type="button"
            onClick={() => showToast('Comments section opening...', 'info')}
            className="flex flex-col items-center gap-1 text-white cursor-pointer group"
          >
            <div className="p-3 rounded-full bg-black/40 group-hover:bg-black/60 backdrop-blur-md text-white transition-all">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold drop-shadow">
              {currentReel.commentsCount}
            </span>
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            className="flex flex-col items-center gap-1 text-white cursor-pointer group"
          >
            <div className="p-3 rounded-full bg-black/40 group-hover:bg-black/60 backdrop-blur-md text-white transition-all">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold drop-shadow">Share</span>
          </button>
        </div>

        {/* Bottom Information Overlay */}
        <div className="absolute bottom-4 left-4 right-18 z-10 text-white space-y-2">
          {/* Creator Tag & Follow */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onProfileClick(currentReel.creator.username)}
              className="flex items-center gap-2 text-left cursor-pointer group"
            >
              <Avatar
                src={currentReel.creator.image}
                name={currentReel.creator.name}
                size="sm"
                className="ring-2 ring-white/60"
              />
              <span className="text-xs font-bold tracking-tight text-white group-hover:underline">
                @{currentReel.creator.username}
              </span>
            </button>

            {user?.username !== currentReel.creator.username && (
              <button
                type="button"
                onClick={() => showToast(`Followed @${currentReel.creator.username}`, 'success')}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-white/40 bg-white/20 hover:bg-white text-white hover:text-slate-900 backdrop-blur-xs transition-colors cursor-pointer"
              >
                Follow
              </button>
            )}
          </div>

          {/* Caption */}
          <p className="text-xs text-white/95 leading-relaxed drop-shadow line-clamp-3">
            {currentReel.caption}
          </p>

          {/* Hashtags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {currentReel.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium text-white/80 hover:text-white transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Music track */}
          <div className="flex items-center gap-2 text-[11px] text-white/80 pt-1">
            <Music className="w-3 h-3 animate-spin shrink-0" />
            <span className="truncate">{currentReel.musicTrack}</span>
          </div>
        </div>

        {/* Up / Down Navigation Controls (floating inside) */}
        <div className="absolute top-1/2 -translate-y-1/2 right-3 flex flex-col gap-2 z-20">
          <button
            type="button"
            onClick={handlePrev}
            className="p-2 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white transition-all hover:scale-110 cursor-pointer"
            title="Previous Reel"
            aria-label="Previous reel"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="p-2 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white transition-all hover:scale-110 cursor-pointer"
            title="Next Reel"
            aria-label="Next reel"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
