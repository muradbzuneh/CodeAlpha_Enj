/**
 * Avatar component with graceful image loading and initials fallback.
 */

import React, { useState } from 'react';
import { resolveMediaUrl } from '../../lib/resolveMediaUrl';

export interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className = '' }) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (n: string) => {
    if (!n) return '?';
    const parts = n.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base font-semibold',
    xl: 'w-20 h-20 text-xl font-bold',
  }[size];

  const showFallback = !src || imageError;
  const resolvedSrc = resolveMediaUrl(src);

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden bg-[#252a32] text-zinc-300 select-none ring-1 ring-white/10 ${sizeClasses} ${className}`}
    >
      {!showFallback ? (
        <img
          src={resolvedSrc}
          alt={name}
          onError={() => setImageError(true)}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-medium tracking-tight">{getInitials(name)}</span>
      )}
    </div>
  );
};
