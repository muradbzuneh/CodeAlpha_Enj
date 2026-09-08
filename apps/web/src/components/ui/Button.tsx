/**
 * Reusable Button component matching ENJ Brand Identity:
 * - Human-crafted tactile design (no AI-generated rainbow gradients or glowing shadows)
 * - Refined, solid brand accents and high-contrast neutrals
 * - Accessible focus indicators and crisp micro-interactions
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading = false, disabled, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 dark:focus-visible:ring-white/20 focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:scale-[0.98] select-none whitespace-nowrap';

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2',
      lg: 'text-base px-5 py-2.5 gap-2.5',
    }[size];

    const variantStyles = {
      primary:
        'bg-[#FF3366] hover:bg-[#EE2055] text-white shadow-2xs font-semibold border border-transparent',
      secondary:
        'bg-slate-100 dark:bg-[#22272e] text-slate-800 dark:text-[#e1e1e1] hover:bg-slate-200 dark:hover:bg-[#2a3039] border border-slate-200/80 dark:border-[#2d333b]',
      outline:
        'border border-slate-200 dark:border-[#2d333b] bg-white dark:bg-[#1a1d23] text-slate-700 dark:text-[#e1e1e1] hover:bg-slate-50 dark:hover:bg-[#22272e] hover:border-slate-300 dark:hover:border-[#383f4a] shadow-2xs',
      ghost:
        'text-slate-600 dark:text-[#9ca3af] hover:bg-slate-100 dark:hover:bg-[#22272e] hover:text-slate-900 dark:hover:text-[#f3f4f6]',
      danger:
        'bg-rose-600 text-white hover:bg-rose-700 shadow-2xs font-semibold',
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
