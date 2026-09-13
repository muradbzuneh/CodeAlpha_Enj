import React, { useState, useEffect } from 'react';
import { Hash, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

interface HashtagItem {
  tag: string;
  count: number;
}

export interface HashtagCloudProps {
  onHashtagClick: (tag: string) => void;
}

export const HashtagCloud: React.FC<HashtagCloudProps> = ({ onHashtagClick }) => {
  const [hashtags, setHashtags] = useState<HashtagItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await apiClient.get<{ data: HashtagItem[] }>("/api/explore/hashtags");
        if (mounted) setHashtags(res.data || []);
      } catch {} finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (hashtags.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5 px-1">
        <Hash className="w-3.5 h-3.5 text-[#FFAA00]" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
          Popular Hashtags
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {hashtags.map((h) => (
          <button
            key={h.tag}
            type="button"
            onClick={() => onHashtagClick(h.tag)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#22272e] dark:hover:bg-[#2d333b] border border-slate-200/80 dark:border-[#2d333b] transition-colors cursor-pointer"
          >
            <span className="text-xs font-bold text-[#FF3366]">{h.tag}</span>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500">{h.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
