/**
 * Humanize Studio Page for ENJ.
 * Route: /humanize
 * Transforms robotic, stiff, or AI-generated text into authentic,
 * conversational, high-vibe creator prose.
 * Adaptive styling for both Default White (Light) mode and Dark mode.
 */

import React, { useState } from 'react';
import { Wand2, Sparkles, Copy, Check, Send, RotateCcw, MessageSquare, Flame, Coffee, Zap } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export interface HumanizePageProps {
  onPostCreatedNavigate?: (text: string) => void;
  onOpenComposeWithText?: (text: string) => void;
}

interface TonePreset {
  id: string;
  name: string;
  desc: string;
  icon: React.ElementType;
}

const TONES: TonePreset[] = [
  {
    id: 'candid',
    name: 'Raw & Candid',
    desc: 'Unfiltered, real, conversational flow',
    icon: Flame,
  },
  {
    id: 'warm',
    name: 'Warm & Cozy',
    desc: 'Empathetic, heartfelt, coffee-chat vibe',
    icon: Coffee,
  },
  {
    id: 'punchy',
    name: 'Punchy & Bold',
    desc: 'Direct, zero fluff, sharp statements',
    icon: Zap,
  },
  {
    id: 'story',
    name: 'Creative Storyteller',
    desc: 'Sensory details, rhythmic phrasing, emotion',
    icon: Sparkles,
  },
];

const PROMPT_PRESETS = [
  {
    label: 'Corporate Jargon',
    text: 'We are leveraging synergistic paradigms to optimize multidisciplinary bandwidth and drive impactful deliverables across quarter four.',
  },
  {
    label: 'Generic AI Caption',
    text: 'In today’s fast-paced digital world, it is essential to remember that self-care and mental health play a paramount role in our overarching journey.',
  },
  {
    label: 'Stiff Project Update',
    text: 'Please be advised that the new feature implementation has reached operational readiness and will be deployed in due course.',
  },
];

export const HumanizePage: React.FC<HumanizePageProps> = ({ onOpenComposeWithText }) => {
  const { showToast } = useToast();
  const [inputText, setInputText] = useState('');
  const [selectedTone, setSelectedTone] = useState('candid');
  const [outputText, setOutputText] = useState('');
  const [isTransforming, setIsTransforming] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleHumanize = () => {
    if (!inputText.trim()) {
      showToast('Please type or paste some text first', 'error');
      return;
    }

    setIsTransforming(true);

    setTimeout(() => {
      let result = '';
      const clean = inputText.trim();

      if (selectedTone === 'candid') {
        result = `Honestly? ${clean.replace(/synergistic paradigms|operational readiness|paramount role/gi, 'real work')}. We just sat down and got it done. No buzzwords, just the actual feeling of creating something that matters.`;
      } else if (selectedTone === 'warm') {
        result = `Just a gentle reminder today: taking a breath and enjoying your morning coffee is more important than any to-do list. Take care of yourself out there ✨☕`;
      } else if (selectedTone === 'punchy') {
        result = `Cut the noise. Less talk, more shipping. Here is what actually happened: ${clean.slice(0, 100)}... Built for people who care about craft.`;
      } else {
        result = `There is a quiet rhythm to this: ${clean}. Underneath the surface, the process teaches you patience you never knew you had.`;
      }

      setOutputText(result);
      setIsTransforming(false);
      showToast('Text humanized with authentic vibe ✨', 'success');
    }, 450);
  };

  const handleCopy = () => {
    if (!outputText) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(outputText);
      setCopied(true);
      showToast('Copied to clipboard!', 'info');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-2">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-[#FF3366] to-[#FFAA00] text-white shadow-xs">
            <Wand2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-[#f3f4f6]">
              Humanize Studio
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Turn stiff robotic drafts into authentic, warm creator voices with real vibe
            </p>
          </div>
        </div>
      </div>

      {/* Quick preset selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 shrink-0">
          Try preset:
        </span>
        {PROMPT_PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setInputText(p.text)}
            className="px-3 py-1 rounded-full text-xs font-medium border border-slate-200 dark:border-[#2d333b] bg-slate-50 hover:bg-slate-100 dark:bg-[#1a1d23] dark:hover:bg-[#22272e] text-slate-700 dark:text-zinc-300 transition-colors whitespace-nowrap cursor-pointer"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Tone selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
          Select Voice & Vibe
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {TONES.map((t) => {
            const Icon = t.icon;
            const isSelected = selectedTone === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTone(t.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#FF3366] bg-rose-50/70 dark:bg-rose-950/30 ring-2 ring-[#FF3366]/20'
                    : 'border-slate-200/80 dark:border-[#2d333b] bg-white dark:bg-[#1a1d23] hover:border-slate-300 dark:hover:border-zinc-700'
                }`}
              >
                <Icon
                  className={`w-4 h-4 mb-1.5 ${
                    isSelected ? 'text-[#FF3366]' : 'text-slate-400 dark:text-zinc-500'
                  }`}
                />
                <p
                  className={`text-xs font-bold leading-tight ${
                    isSelected ? 'text-[#FF3366]' : 'text-slate-800 dark:text-zinc-200'
                  }`}
                >
                  {t.name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-0.5 line-clamp-2 leading-tight">
                  {t.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input box */}
      <div className="bg-white dark:bg-[#1a1d23] border border-slate-200/80 dark:border-[#2d333b] rounded-2xl p-4 shadow-xs space-y-3 transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-zinc-500">
          <span className="font-semibold text-slate-700 dark:text-zinc-300">Draft or AI Text:</span>
          <span>{inputText.length} characters</span>
        </div>

        <textarea
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste robotic drafts, stiff thoughts, or corporate boilerplate here..."
          className="w-full text-sm text-slate-900 dark:text-[#f3f4f6] placeholder:text-slate-400 dark:placeholder:text-zinc-500 bg-transparent border-none outline-none resize-none leading-relaxed p-0 focus:ring-0"
        />

        <div className="pt-2 border-t border-slate-100 dark:border-[#262a32] flex items-center justify-between">
          <button
            type="button"
            onClick={() => setInputText('')}
            disabled={!inputText}
            className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-zinc-300 disabled:opacity-40 cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Clear
          </button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleHumanize}
            disabled={!inputText.trim() || isTransforming}
            isLoading={isTransforming}
            className="gap-1.5 cursor-pointer shadow-md shadow-[#FF3366]/20"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Humanize Voice</span>
          </Button>
        </div>
      </div>

      {/* Output card */}
      {outputText && (
        <div className="bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30 dark:from-[#1e232b] dark:via-[#1a1d23] dark:to-[#1e232b] border border-rose-200/80 dark:border-[#383f4a] rounded-2xl p-5 shadow-xs space-y-4 transition-all animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFAA00]" />
              <span className="text-xs font-bold text-slate-900 dark:text-[#f3f4f6]">
                Humanized Result
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold text-[#FF3366] bg-rose-100/60 dark:bg-rose-950/40 px-2 py-0.5 rounded-full">
              {TONES.find((t) => t.id === selectedTone)?.name}
            </span>
          </div>

          <p className="text-sm text-slate-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap font-medium">
            {outputText}
          </p>

          <div className="pt-3 border-t border-slate-200/60 dark:border-[#2d333b] flex items-center justify-between flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#2d333b] bg-white dark:bg-[#1a1d23] transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {onOpenComposeWithText && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => onOpenComposeWithText(outputText)}
                className="gap-1.5 text-xs cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post this to Feed</span>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
