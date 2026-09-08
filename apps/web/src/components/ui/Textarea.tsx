/**
 * Textarea component with character count and validation states.
 * Adaptive styling for both Default Light (White) mode and Dark mode.
 */

import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxLength?: number;
  currentLength?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, maxLength, currentLength, className = '', id, ...props }, ref) => {
    const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          {label && (
            <label htmlFor={textareaId} className="text-xs font-semibold tracking-wide text-slate-700 dark:text-zinc-300">
              {label}
            </label>
          )}
          {maxLength !== undefined && (
            <span
              className={`text-xs ${
                currentLength !== undefined && currentLength >= maxLength
                  ? 'text-rose-500 dark:text-rose-400 font-semibold'
                  : 'text-slate-400 dark:text-zinc-500'
              }`}
            >
              {currentLength ?? 0} / {maxLength}
            </span>
          )}
        </div>
        <textarea
          id={textareaId}
          ref={ref}
          maxLength={maxLength}
          className={`w-full text-sm rounded-xl border bg-slate-50 dark:bg-[#16181d] p-3 text-slate-900 dark:text-[#f3f4f6] placeholder:text-slate-400 dark:placeholder:text-zinc-500 transition-colors focus:outline-none focus:bg-white dark:focus:bg-[#121418] focus:ring-2 focus:ring-[#FF3366]/30 focus:border-[#FF3366] resize-y min-h-[100px] disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-[#0f1115] ${
            error ? 'border-rose-500 focus:ring-rose-500/30 focus:border-rose-500' : 'border-slate-200 dark:border-[#2d333b]'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-rose-500 dark:text-rose-400 font-medium">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
