import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'logo' | 'loading' | 'done'>('logo');

  useEffect(() => {
    const logoTimer = setTimeout(() => setPhase('loading'), 800);
    return () => clearTimeout(logoTimer);
  }, []);

  useEffect(() => {
    if (phase !== 'loading') return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 15 + 5;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setPhase('done');
            onComplete?.();
          }, 300);
          return 100;
        }
        return next;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [phase, onComplete]);

  if (phase === 'done') return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500"
      style={{
        background: 'linear-gradient(135deg, #FF3366 0%, #FF6B6B 35%, #FFAA00 70%, #FF3366 100%)',
      }}
    >
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-white/5 animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-white/5 animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-white/3" style={{ animation: 'ping 4s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
      </div>

      {/* Logo */}
      <div className={`relative z-10 transition-all duration-700 ${phase === 'logo' ? 'scale-100 opacity-100' : 'scale-105 opacity-90'}`}>
        <div className="flex items-center gap-1">
          <span className="text-6xl sm:text-7xl font-black text-white drop-shadow-2xl tracking-tighter" style={{ fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif", textShadow: '0 4px 30px rgba(0,0,0,0.2)' }}>
            Enj
          </span>
          <span className="text-4xl sm:text-5xl font-black text-white/90" style={{ fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif" }}>.</span>
        </div>
        <div className="mt-2 text-center">
          <span className="text-xs sm:text-sm font-medium text-white/70 tracking-[0.3em] uppercase">
            Social Platform
          </span>
        </div>
      </div>

      {/* Progress bar */}
      {phase === 'loading' && (
        <div className="relative z-10 mt-12 w-48 sm:w-56">
          <div className="h-0.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-white rounded-full transition-all duration-200 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="absolute bottom-6 z-10">
        <p className="text-[10px] text-white/40 font-medium tracking-wider">
          &copy; {new Date().getFullYear()} ENJ
        </p>
      </div>
    </div>
  );
};
