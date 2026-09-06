/**
 * Accessible Input component with label, error states, and prefix/suffix support.
 * Adaptive styling for both Default Light (White) mode and Dark mode.
 */

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold tracking-wide text-slate-700 dark:text-zinc-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-slate-400 dark:text-zinc-500 pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full text-sm rounded-xl border bg-slate-50 dark:bg-[#16181d] px-3.5 py-2.5 text-slate-900 dark:text-[#f3f4f6] placeholder:text-slate-400 dark:placeholder:text-zinc-500 transition-colors focus:outline-none focus:bg-white dark:focus:bg-[#121418] focus:ring-2 focus:ring-[#FF3366]/30 focus:border-[#FF3366] disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-[#0f1115] ${
              icon ? 'pl-10' : ''
            } ${error ? 'border-rose-500 focus:ring-rose-500/30 focus:border-rose-500' : 'border-slate-200 dark:border-[#2d333b]'} ${className}`}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-xs text-rose-500 dark:text-rose-400 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 dark:text-zinc-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
