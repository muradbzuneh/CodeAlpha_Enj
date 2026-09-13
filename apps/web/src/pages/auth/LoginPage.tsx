/**
 * Login Page for ENJ.
 * Authenticates with Better Auth backend route: POST /api/auth/sign-in/email.
 * Adaptive styling for both Default Light (White) mode and Dark mode.
 */

import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/ui/Logo';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { signIn, isLoading } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email || !password) {
      setFormError('Please enter your email and password.');
      return;
    }

    try {
      await signIn(email, password);
      showToast('Welcome back to ENJ', 'success');
      onNavigate('/');
    } catch (err: any) {
      setFormError(err?.message || 'Invalid email or password.');
    }
  };

  // Fast demo credentials filling for quick review testing
  const fillDemoAccount = () => {
    setEmail('alex.rivers@example.com');
    setPassword('password123');
    setFormError(null);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white dark:bg-[#1a1d23] border border-slate-200/80 dark:border-[#2d333b] rounded-3xl p-8 shadow-xl transition-colors">
        {/* Header Branding with Custom ENJ Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Logo size="lg" showText={false} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-[#f3f4f6]">
            Sign in to ENJ
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Access your feed, stories, discussions, and personal network.
          </p>
        </div>

        {formError && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 flex items-center gap-2.5 text-xs text-rose-600 dark:text-rose-300 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-2"
            isLoading={isLoading}
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>


        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('/signup')}
              className="text-[#FF3366] font-bold hover:underline cursor-pointer"
            >
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
