/**
 * Bottom Navigation Bar for mobile viewports (<768px).
 * Icons: Home, Explore, Post (+), Likes, Profile
 */

import React from 'react';
import { Home, Compass, Plus, Heart, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface MobileNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenCompose?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentPath, onNavigate, onOpenCompose }) => {
  const { user } = useAuth();

  const navItems: {
    label: string;
    path: string;
    icon: React.ElementType;
    isAction?: boolean;
    requiresAuth?: boolean;
  }[] = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Post', path: '#post', icon: Plus, isAction: true },
    { label: 'Likes', path: '/liked', icon: Heart, requiresAuth: true },
    {
      label: 'Profile',
      path: user ? (user.username ? `/profile/${user.username}` : '/settings/profile') : '/login',
      icon: User,
      requiresAuth: true,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#1a1d23]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-[#2d333b] md:hidden pb-safe transition-colors">
      <div className="flex items-center justify-around h-14 px-2">
        {navItems.map((item) => {
          if (item.requiresAuth && !user) return null;

          const Icon = item.icon;
          const isActive =
            !item.isAction &&
            (item.path === '/'
              ? currentPath === '/'
              : currentPath.startsWith(item.path));

          const handleClick = () => {
            if (item.isAction) {
              if (user && onOpenCompose) {
                onOpenCompose();
              } else if (!user) {
                onNavigate('/login');
              }
            } else {
              onNavigate(item.path);
            }
          };

          return (
            <button
              key={item.label}
              type="button"
              onClick={handleClick}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
                isActive
                  ? 'text-[#FF3366] font-bold'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
              aria-label={item.label}
            >
              {item.isAction ? (
                <div className="w-6 h-6 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-2xs active:scale-95 transition-transform">
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </div>
              ) : (
                <Icon className="w-5 h-5" />
              )}
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
