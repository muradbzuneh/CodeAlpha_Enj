/**
 * Settings & Profile Page for ENJ.
 * Route: /settings/profile
 * Features:
 * - Theme Configuration (Default White / Light vs Dark Mode)
 * - Profile Information (Name, Username, Bio)
 * - Validation & Persistence
 */

import React, { useState, useEffect } from 'react';
import { User, AtSign, ArrowLeft, Save, AlertCircle, Sun, Moon, Check, Palette } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

export interface SettingsProfilePageProps {
  onNavigate: (path: string) => void;
}

const MAX_BIO_LENGTH = 160;

export const SettingsProfilePage: React.FC<SettingsProfilePageProps> = ({ onNavigate }) => {
  const { user, updateCurrentUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setUsername(user.username || '');
      setBio(user.bio || '');
    }
  }, [user]);

  if (!user) {
    return (
      <div className="bg-white dark:bg-[#1a1d23] border border-slate-200/80 dark:border-[#2d333b] rounded-2xl p-10 text-center shadow-xs transition-colors">
        <h2 className="text-base font-bold text-slate-900 dark:text-[#f3f4f6]">Please sign in</h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          You must be logged in to modify your settings.
        </p>
        <Button variant="primary" size="sm" onClick={() => onNavigate('/login')} className="mt-4">
          Go to Sign in
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUsername = username.trim().toLowerCase().replace(/^@/, '');
    if (!cleanUsername) {
      setError('Username is required.');
      return;
    }

    if (!/^[a-z0-9_]+$/.test(cleanUsername)) {
      setError('Username can only contain lowercase letters, numbers, and underscores.');
      return;
    }

    if (bio.length > MAX_BIO_LENGTH) {
      setError(`Bio cannot exceed ${MAX_BIO_LENGTH} characters.`);
      return;
    }

    setIsSaving(true);
    try {
      const updatedProfile = await api.users.updateProfile({
        username: cleanUsername,
        name: name.trim(),
        bio: bio.trim(),
      });

      updateCurrentUser({
        username: updatedProfile.username,
        name: updatedProfile.name,
        bio: updatedProfile.bio,
      });
      showToast('Profile updated successfully', 'success');
      onNavigate(user.username ? `/profile/${user.username}` : '/');
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 px-1">
        <button
          type="button"
          onClick={() => onNavigate(user.username ? `/profile/${user.username}` : '/settings/profile')}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#22272e] text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-[#f3f4f6] transition-colors cursor-pointer"
          aria-label="Back to profile"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-[#f3f4f6]">
            Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-500">
            Appearance theme, public handle, and profile information
          </p>
        </div>
      </div>

      {/* Appearance Theme Switcher (Requested Feature) */}
      <div className="bg-white dark:bg-[#1a1d23] border border-slate-200/80 dark:border-[#2d333b] rounded-2xl p-5 sm:p-6 shadow-xs transition-colors">
        <div className="flex items-center gap-2 mb-1.5">
          <Palette className="w-4 h-4 text-[#FF3366]" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-[#f3f4f6]">
            Appearance & Theme
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
          Choose your interface theme. Default is White (Light mode), or switch to Dark mode.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Light Theme Card (Default) */}
          <button
            type="button"
            onClick={() => {
              setTheme('light');
              showToast('Switched to White (Light) mode', 'info');
            }}
            className={`p-4 rounded-2xl border text-left flex items-start justify-between transition-all cursor-pointer ${
              theme === 'light'
                ? 'border-[#FF3366] bg-rose-50/50 dark:bg-rose-950/20 ring-2 ring-[#FF3366]/30 shadow-xs'
                : 'border-slate-200 dark:border-[#2d333b] bg-slate-50 dark:bg-[#16181d] hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-amber-500 flex items-center justify-center shadow-xs">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    White / Light
                  </span>
                  <span className="text-[10px] bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300 px-1.5 py-0.2 rounded font-semibold">
                    Default
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  Clean, crisp, high-contrast white canvas
                </p>
              </div>
            </div>

            {theme === 'light' && (
              <div className="w-5 h-5 rounded-full bg-[#FF3366] text-white flex items-center justify-center shadow-xs shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
          </button>

          {/* Dark Theme Card */}
          <button
            type="button"
            onClick={() => {
              setTheme('dark');
              showToast('Switched to Dark mode', 'info');
            }}
            className={`p-4 rounded-2xl border text-left flex items-start justify-between transition-all cursor-pointer ${
              theme === 'dark'
                ? 'border-[#FF3366] bg-rose-50/50 dark:bg-rose-950/20 ring-2 ring-[#FF3366]/30 shadow-xs'
                : 'border-slate-200 dark:border-[#2d333b] bg-slate-50 dark:bg-[#16181d] hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0f1115] border border-zinc-700 text-indigo-400 flex items-center justify-center shadow-xs">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Dark Mode
                </span>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  Eye-friendly obsidian palette with radiant accents
                </p>
              </div>
            </div>

            {theme === 'dark' && (
              <div className="w-5 h-5 rounded-full bg-[#FF3366] text-white flex items-center justify-center shadow-xs shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Profile Settings Card */}
      <div className="bg-white dark:bg-[#1a1d23] border border-slate-200/80 dark:border-[#2d333b] rounded-2xl p-5 sm:p-6 shadow-xs transition-colors">
        {/* Profile Avatar Notice */}
        <div className="flex items-start gap-4 pb-6 border-b border-slate-100 dark:border-[#262a32]">
          <Avatar src={user.image} name={user.name || user.username} size="lg" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#f3f4f6]">
              Profile Photo & Identity
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Avatar is linked to your ENJ member identity. Custom avatar upload will be enabled soon.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 flex items-center gap-2.5 text-xs text-rose-600 dark:text-rose-300 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <Input
            label="Display Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            icon={<User className="w-4 h-4" />}
            required
          />

          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
            placeholder="handle"
            icon={<AtSign className="w-4 h-4" />}
            helperText="Your unique handle on ENJ (e.g. @alexrivers)"
            required
          />

          <Textarea
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell the community a little about what you build, think, or care about..."
            maxLength={MAX_BIO_LENGTH}
            currentLength={bio.length}
            rows={3}
          />

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => onNavigate(user.username ? `/profile/${user.username}` : '/settings/profile')}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSaving}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-1.5" />
              <span>Save Changes</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
