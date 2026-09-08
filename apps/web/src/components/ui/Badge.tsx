/**
 * Badge component for tags, counts, and status indicators.
 * Adaptive styling for both Default Light (White) mode and Dark mode.
 */

import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const variantStyles = {
    default: 'bg-rose-50 dark:bg-rose-950/40 text-[#FF3366] dark:text-[#FF5E7E] border border-rose-200 dark:border-rose-800/40',
    outline: 'border border-slate-200 dark:border-[#2d333b] text-slate-700 dark:text-zinc-300 bg-white dark:bg-[#1a1d23]',
    success: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40',
    warning: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40',
    neutral: 'bg-slate-100 dark:bg-[#22272e] text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-[#2d333b]',
  }[variant];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
};
