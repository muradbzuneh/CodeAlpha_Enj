/**
 * Dropdown Menu component with outside-click handling.
 * Adaptive styling for both Default Light (White) mode and Dark mode.
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
}

export const Dropdown: React.FC<DropdownProps> = ({ trigger, items, align = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className={`absolute z-30 mt-1.5 w-44 rounded-xl bg-white dark:bg-[#1a1d23] shadow-xl border border-slate-200/80 dark:border-[#2d333b] py-1 focus:outline-none ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            {items.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  item.onClick();
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium transition-colors text-left cursor-pointer ${
                  item.danger
                    ? 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-300'
                    : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-[#22272e] hover:text-slate-900 dark:hover:text-[#f3f4f6]'
                }`}
              >
                {item.icon && <span className="w-4 h-4 shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
