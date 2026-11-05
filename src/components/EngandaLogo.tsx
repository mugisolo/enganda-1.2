import React from 'react';

interface EngandaLogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

/**
 * Original professional vector identity for ENGANDA based on a connected
 * radial-network symbol representing multiple community groups & programmes
 * united under one trusted umbrella.
 */
export const EngandaLogo: React.FC<EngandaLogoProps> = ({
  variant = 'dark',
  size = 'md',
  showSubtitle = true,
}) => {
  const iconDimensions =
    size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';
  const wordmarkSize =
    size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className="inline-flex items-center gap-3 select-none">
      <div
        className={`${iconDimensions} rounded-xl bg-[#0F5132] flex items-center justify-center shadow-sm border border-emerald-700/40 shrink-0`}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1"
          aria-hidden="true"
        >
          {/* Outer trusted umbrella ring */}
          <circle
            cx="32"
            cy="32"
            r="22"
            stroke="#34D399"
            strokeWidth="2"
            strokeDasharray="4 3"
            opacity="0.65"
          />
          {/* Secondary inner connectivity ring */}
          <circle
            cx="32"
            cy="32"
            r="14"
            stroke="#A7F3D0"
            strokeWidth="1.2"
            opacity="0.35"
          />
          {/* Radial network spokes */}
          <g stroke="#FBBF24" strokeWidth="2.2" strokeLinecap="round">
            <line x1="32" y1="32" x2="32" y2="10" />
            <line x1="32" y1="32" x2="51" y2="21" />
            <line x1="32" y1="32" x2="51" y2="43" />
            <line x1="32" y1="32" x2="32" y2="54" />
            <line x1="32" y1="32" x2="13" y2="43" />
            <line x1="32" y1="32" x2="13" y2="21" />
          </g>
          {/* Connected satellite group nodes */}
          <circle cx="32" cy="10" r="4" fill="#FFFFFF" stroke="#0F5132" strokeWidth="1.5" />
          <circle cx="51" cy="21" r="4" fill="#34D399" stroke="#0F5132" strokeWidth="1.5" />
          <circle cx="51" cy="43" r="4" fill="#FFFFFF" stroke="#0F5132" strokeWidth="1.5" />
          <circle cx="32" cy="54" r="4" fill="#34D399" stroke="#0F5132" strokeWidth="1.5" />
          <circle cx="13" cy="43" r="4" fill="#FFFFFF" stroke="#0F5132" strokeWidth="1.5" />
          <circle cx="13" cy="21" r="4" fill="#34D399" stroke="#0F5132" strokeWidth="1.5" />
          {/* Central ENGANDA hub */}
          <circle cx="32" cy="32" r="8.2" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2.2" />
          <circle cx="32" cy="32" r="3" fill="#0F5132" />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <span
          className={`${wordmarkSize} font-extrabold tracking-tight font-['Plus_Jakarta_Sans',sans-serif] ${
            variant === 'light' ? 'text-white' : 'text-slate-900'
          }`}
        >
          ENGANDA
        </span>
        {showSubtitle && (
          <span
            className={`text-[10px] font-semibold uppercase tracking-[0.16em] mt-1 ${
              variant === 'light' ? 'text-emerald-300/90' : 'text-[#0F5132]'
            }`}
          >
            Community Network Umbrella
          </span>
        )}
      </div>
    </div>
  );
};
