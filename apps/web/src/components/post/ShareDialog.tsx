import React from 'react';
import { X, Link2, Send } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  postUrl: string;
  postContent?: string;
}

const SHARE_OPTIONS = [
  {
    name: 'WhatsApp',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-950/20',
    getUrl: (url: string, text: string) =>
      `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`,
  },
  {
    name: 'Telegram',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.492-1.302.48-.428-.013-1.252-.242-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    getUrl: (url: string, text: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    name: 'X / Twitter',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    color: 'text-black dark:text-white',
    bg: 'bg-slate-100 dark:bg-zinc-800',
    getUrl: (url: string, text: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text.slice(0, 240))}`,
  },
  {
    name: 'Facebook',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: 'LinkedIn',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    color: 'text-blue-700',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    getUrl: (url: string) =>
      `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}`,
  },
  {
    name: 'Email',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>,
    color: 'text-slate-600 dark:text-zinc-400',
    bg: 'bg-slate-100 dark:bg-zinc-800',
    getUrl: (url: string, text: string) =>
      `mailto:?subject=${encodeURIComponent('Check out this post on ENJ')}&body=${encodeURIComponent(text + '\n\n' + url)}`,
  },
];

export const ShareDialog: React.FC<ShareDialogProps> = ({ isOpen, onClose, postUrl, postContent = '' }) => {
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      showToast('Link copied to clipboard', 'success');
      onClose();
    } catch {
      showToast('Failed to copy link', 'error');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'ENJ Post', text: postContent, url: postUrl });
        onClose();
      } catch {}
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4" onClick={onClose}>
      <div
        className="w-full sm:max-w-sm bg-white dark:bg-[#1a1d23] rounded-t-2xl sm:rounded-2xl border border-slate-200/80 dark:border-[#2d333b] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-[#262a32]">
          <h3 className="text-sm font-bold text-slate-900 dark:text-[#f3f4f6]">Share to</h3>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#22272e] cursor-pointer">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Share options grid */}
        <div className="p-4 grid grid-cols-3 gap-3">
          {SHARE_OPTIONS.map((option) => (
            <a
              key={option.name}
              href={option.getUrl(postUrl, postContent)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl ${option.bg} hover:opacity-80 transition-opacity`}
            >
              <span className={option.color}>{option.icon}</span>
              <span className="text-[10px] font-medium text-slate-700 dark:text-zinc-300">{option.name}</span>
            </a>
          ))}
        </div>

        {/* Copy link + native share */}
        <div className="px-4 pb-4 space-y-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 dark:bg-[#22272e] hover:bg-slate-200 dark:hover:bg-[#2d333b] text-sm font-medium text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
          >
            <Link2 className="w-4 h-4" />
            Copy link
          </button>
          {typeof navigator.share === 'function' && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#FF3366] hover:bg-[#EE2055] text-white text-sm font-medium transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Share via device
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
