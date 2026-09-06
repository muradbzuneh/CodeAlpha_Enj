/**
 * Main Application Layout for ENJ.
 * Coordinates 3-column responsive layout:
 * - Left: Navigation
 * - Center: Main feed / active route
 * - Right: Suggestions / trending / integration status
 * - Bottom: Mobile navigation
 */

import React, { useState } from 'react';
import { Header } from './Header';
import { SidebarNav } from './SidebarNav';
import { RightSidebar } from './RightSidebar';
import { MobileNav } from './MobileNav';
import { Modal } from '../ui/Modal';
import { PostComposer } from '../post/PostComposer';
import type { Post } from '../../types';

export interface MainLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
  onPostCreated?: (post: Post) => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  onSearchSubmit?: () => void;
  isComposeOpen?: boolean;
  onCloseCompose?: () => void;
  onOpenCompose?: () => void;
  initialComposeText?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  currentPath,
  onNavigate,
  children,
  onPostCreated,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  isComposeOpen,
  onCloseCompose,
  onOpenCompose,
  initialComposeText = '',
}) => {
  const [internalComposeOpen, setInternalComposeOpen] = useState(false);
  const isComposeModalOpen = isComposeOpen !== undefined ? isComposeOpen : internalComposeOpen;

  const handleOpenCompose = () => {
    if (onOpenCompose) {
      onOpenCompose();
    } else {
      setInternalComposeOpen(true);
    }
  };

  const handleCloseCompose = () => {
    if (onCloseCompose) {
      onCloseCompose();
    } else {
      setInternalComposeOpen(false);
    }
  };

  const handleCreated = (post: Post) => {
    handleCloseCompose();
    onPostCreated?.(post);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0f1115] text-slate-900 dark:text-[#e1e1e1] transition-colors">
      {/* Top Header */}
      <Header
        onNavigate={onNavigate}
        onOpenCompose={handleOpenCompose}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onSearchSubmit={onSearchSubmit}
      />

      {/* Main 3-Column Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-center gap-8">
          {/* Left Sidebar */}
          <SidebarNav
            currentPath={currentPath}
            onNavigate={onNavigate}
            onOpenCompose={handleOpenCompose}
          />

          {/* Central Content Area */}
          <main className="flex-1 max-w-2xl min-w-0 pb-20 md:pb-8">
            {children}
          </main>

          {/* Right Sidebar */}
          <RightSidebar
            onProfileClick={(username) => onNavigate(`/profile/${username}`)}
            onTopicClick={(topic) => {
              if (onSearchChange) onSearchChange(`#${topic}`);
              onNavigate('/search');
            }}
          />
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        currentPath={currentPath}
        onNavigate={onNavigate}
        onOpenCompose={handleOpenCompose}
      />

      {/* Global Compose Modal */}
      <Modal
        isOpen={isComposeModalOpen}
        onClose={handleCloseCompose}
        title="Create a new post"
      >
        <PostComposer
          onPostCreated={handleCreated}
          initialContent={initialComposeText}
        />
      </Modal>
    </div>
  );
};
