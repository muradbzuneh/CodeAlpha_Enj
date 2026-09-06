/**
 * Official ENJ Logo Component.
 * Faithfully matches the user-provided brand identity:
 * - Rounded friendly "Enj." typography
 * - Dynamic joyful smile swoosh underneath in golden-yellow to coral-pink gradient
 * - Warm golden period dot (. in #FFB703)
 * - Signature watercolor sunset aura (vibrant pink to peach/orange cloud)
 */

import React from 'react';

export interface LogoProps {
  variant?: 'wordmark' | 'badge' | 'icon' | 'hero';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showAura?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'wordmark',
  size = 'md',
  className = '',
  showAura = false,
}) => {
  // Dimension scales
  const dimensions = {
    sm: { width: 84, height: 32, iconSize: 32 },
    md: { width: 110, height: 40, iconSize: 38 },
    lg: { width: 140, height: 50, iconSize: 48 },
    xl: { width: 220, height: 80, iconSize: 72 },
  }[size];

  if (variant === 'icon') {
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-2xl overflow-hidden shadow-sm shadow-[#FF4D6D]/20 transition-transform duration-200 group-hover:scale-105 ${className}`}
        style={{ width: dimensions.iconSize, height: dimensions.iconSize }}
        aria-label="ENJ Logo"
      >
        {/* Watercolor aura background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#FF3366] via-[#FF5E7E] to-[#FFAA00]" />
        
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_70%)]" />

        <svg
          viewBox="0 0 100 100"
          className="relative w-[75%] h-[75%] drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="iconSmileGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFD166" />
              <stop offset="50%" stopColor="#FFAA00" />
              <stop offset="100%" stopColor="#FFF0F5" />
            </linearGradient>
            <linearGradient id="iconLetterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#FFF5F7" />
            </linearGradient>
          </defs>

          {/* Stylized 'E' with playful smile */}
          <path
            d="M26 32 C26 24, 34 20, 50 20 C66 20, 74 25, 74 34 C74 40, 68 44, 58 45 C70 47, 76 52, 76 64 C76 76, 65 82, 48 82 C32 82, 26 76, 26 68"
            stroke="url(#iconLetterGrad)"
            strokeWidth="11"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M28 50 L56 50"
            stroke="url(#iconLetterGrad)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Joyful smile swoop */}
          <path
            d="M34 68 C44 76, 62 76, 70 66"
            stroke="url(#iconSmileGrad)"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  if (variant === 'badge' || variant === 'hero') {
    return (
      <div className={`relative inline-flex items-center justify-center p-3 rounded-3xl ${className}`}>
        {/* Soft aura blur matching user's artwork */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF3366]/40 via-[#FF758F]/50 to-[#FFAA00]/40 rounded-3xl blur-xl -z-10 scale-110" />
        <div className="relative rounded-2xl bg-gradient-to-tr from-[#FF2A6D] via-[#FF597B] to-[#FF9E44] p-3.5 px-6 shadow-lg shadow-[#FF2A6D]/25 flex items-center justify-center">
          <svg
            viewBox="0 0 280 110"
            style={{ width: dimensions.width, height: dimensions.height }}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-md"
          >
            <defs>
              <linearGradient id="badgeSmile" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFE066" />
                <stop offset="60%" stopColor="#FF9F1C" />
                <stop offset="100%" stopColor="#FF385C" />
              </linearGradient>
              <linearGradient id="textWhiteGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#FFF2F4" />
              </linearGradient>
              <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#900C3F" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* Letter 'E' */}
            <path
              d="M45 76 C32 76, 24 67, 24 53 C24 37, 34 26, 50 26 C64 26, 73 34, 73 45 C73 48, 71 50, 67 50 L38 50 C38 61, 44 66, 54 66 C60 66, 66 63, 69 59 C71 57, 73 57, 75 59 L79 63 C80 65, 80 67, 78 69 C71 74, 60 76, 45 76 Z M39 42 L61 42 C60 36, 55 33, 49 33 C43 33, 40 37, 39 42 Z"
              fill="url(#textWhiteGlow)"
              filter="url(#softGlow)"
            />

            {/* Letter 'n' */}
            <path
              d="M88 38 C88 35, 90 33, 93 33 C96 33, 98 35, 98 38 L98 44 C102 38, 109 34, 118 34 C132 34, 139 43, 139 56 L139 74 C139 77, 137 79, 134 79 C131 79, 129 77, 129 74 L129 57 C129 49, 124 43, 115 43 C107 43, 100 48, 98 56 L98 74 C98 77, 96 79, 93 79 C90 79, 88 77, 88 74 L88 38 Z"
              fill="url(#textWhiteGlow)"
              filter="url(#softGlow)"
            />

            {/* Letter 'j' with curve */}
            <path
              d="M152 38 C152 35, 154 33, 157 33 C160 33, 162 35, 162 38 L162 72 C162 85, 154 94, 140 94 C133 94, 126 91, 122 86 C121 84, 121 82, 123 80 L127 76 C128 75, 130 75, 132 77 C134 79, 138 82, 142 82 C149 82, 152 77, 152 70 L152 38 Z"
              fill="url(#textWhiteGlow)"
              filter="url(#softGlow)"
            />
            {/* 'j' dot */}
            <circle cx="157" cy="22" r="6" fill="#FFFFFF" filter="url(#softGlow)" />

            {/* Warm Golden Period '.' */}
            <circle cx="180" cy="73" r="7" fill="#FFC72C" />
            <circle cx="180" cy="73" r="5" fill="#FFAA00" />

            {/* Joyful Smile Swoosh underneath 'nj' */}
            <path
              d="M96 82 C116 93, 142 91, 154 80"
              stroke="url(#badgeSmile)"
              strokeWidth="7"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    );
  }

  // Standard Wordmark (Crisp & scalable, works in Light and Dark mode)
  return (
    <div className={`relative inline-flex items-center gap-1.5 select-none ${className}`}>
      {showAura && (
        <div className="absolute -inset-2 bg-gradient-to-r from-[#FF3366]/20 via-[#FF758F]/25 to-[#FFAA00]/20 rounded-full blur-md -z-10" />
      )}
      
      <svg
        viewBox="0 0 210 90"
        style={{ width: dimensions.width, height: dimensions.height }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
        aria-label="ENJ"
      >
        <defs>
          <linearGradient id="logoSmileGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFB703" />
            <stop offset="60%" stopColor="#FF758F" />
            <stop offset="100%" stopColor="#FF3366" />
          </linearGradient>

          {/* Letter gradient for Light Mode */}
          <linearGradient id="letterGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Letter gradient for Dark Mode */}
          <linearGradient id="letterGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F1F5F9" />
          </linearGradient>

          <linearGradient id="brandAccentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF3366" />
            <stop offset="100%" stopColor="#FF758F" />
          </linearGradient>
        </defs>

        {/* --- Letter 'E' --- */}
        {/* Backplate / Body */}
        <path
          d="M32 64 C20 64, 13 56, 13 44 C13 30, 22 20, 36 20 C49 20, 56 28, 56 37 C56 39.5, 54 41.5, 50.5 41.5 L24 41.5 C24.5 50.5, 30 55, 38.5 55 C44 55, 49 52.5, 52 49 C53.5 47, 55.5 47, 57 48.5 L60 52 C61.5 53.5, 61 55.5, 59 57 C53 62, 43 64, 32 64 Z M24.5 35 L45 35 C44.5 29.5, 41 27, 36 27 C31 27, 26 29.5, 24.5 35 Z"
          className="fill-slate-900 dark:fill-white transition-colors duration-200"
        />

        {/* --- Letter 'n' --- */}
        <path
          d="M68 29 C68 26.5, 70 24.5, 72.5 24.5 C75 24.5, 77 26.5, 77 29 L77 34 C80 29, 87 25.5, 95 25.5 C107 25.5, 114 33, 114 44 L114 60 C114 62.5, 112 64.5, 109.5 64.5 C107 64.5, 105 62.5, 105 60 L105 45 C105 38, 100.5 33.5, 93 33.5 C86 33.5, 80 37.5, 78 44.5 L78 60 C78 62.5, 76 64.5, 73.5 64.5 C71 64.5, 68 62.5, 68 60 L68 29 Z"
          className="fill-slate-900 dark:fill-white transition-colors duration-200"
        />

        {/* --- Letter 'j' --- */}
        <path
          d="M125 29 C125 26.5, 127 24.5, 129.5 24.5 C132 24.5, 134 26.5, 134 29 L134 58 C134 69, 127 76, 115 76 C109 76, 103 73.5, 99.5 69.5 C98 68, 98 66, 100 64.5 L103 61.5 C104.5 60, 106.5 60, 108 61.5 C110 63.5, 113 65.5, 116 65.5 C122 65.5, 125 61.5, 125 56 L125 29 Z"
          className="fill-slate-900 dark:fill-white transition-colors duration-200"
        />
        {/* 'j' dot */}
        <circle
          cx="129.5"
          cy="15.5"
          r="5.5"
          className="fill-slate-900 dark:fill-white transition-colors duration-200"
        />

        {/* --- Warm Golden Period '.' --- */}
        <circle cx="149" cy="59" r="6" fill="#FFAA00" />
        <circle cx="149" cy="59" r="4" fill="#FFC72C" />

        {/* --- The Signature Smiling Swoosh underneath 'nj' --- */}
        <path
          d="M75 66 C91 75.5, 114 74, 124 65"
          stroke="url(#logoSmileGradient)"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
