/**
 * Skeleton component for smooth loading states.
 * Adaptive styling for both Default Light (White) mode and Dark mode.
 */

import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <div className={`animate-pulse bg-slate-200 dark:bg-[#252a32] rounded-lg ${className}`} />;
};

export const PostSkeleton: React.FC = () => {
  return (
    <div className="p-5 bg-white dark:bg-[#1a1d23] border border-slate-200/80 dark:border-[#2d333b] rounded-2xl shadow-xs space-y-4 transition-colors">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="w-32 h-3.5" />
          <Skeleton className="w-20 h-3" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="w-full h-3.5" />
        <Skeleton className="w-5/6 h-3.5" />
        <Skeleton className="w-2/3 h-3.5" />
      </div>
      <div className="flex items-center gap-6 pt-2">
        <Skeleton className="w-14 h-4 rounded-md" />
        <Skeleton className="w-14 h-4 rounded-md" />
      </div>
    </div>
  );
};

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#1a1d23] border border-slate-200/80 dark:border-[#2d333b] rounded-2xl p-6 shadow-xs space-y-4 transition-colors">
      <div className="flex justify-between items-start">
        <Skeleton className="w-20 h-20 rounded-full" />
        <Skeleton className="w-24 h-9 rounded-xl" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-40 h-5" />
        <Skeleton className="w-28 h-3.5" />
      </div>
      <Skeleton className="w-full h-12 rounded-lg" />
      <div className="flex gap-6 pt-2">
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-20 h-4" />
      </div>
    </div>
  );
};
