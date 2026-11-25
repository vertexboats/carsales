import React from 'react';
import dericoLogoImg from '../../assets/images/derico-logo.jpg';

export const DERICO_LOGO_SRC = dericoLogoImg;

interface DericoLogoProps {
  /** 'light' = sitting on a white/light surface; 'dark' = sitting on obsidian/dark surface */
  variant?: 'light' | 'dark';
  /** Emblem size */
  size?: 'sm' | 'md' | 'lg';
  /** Show stacked DERICO / MOTORS wordmark next to crest */
  showWordmark?: boolean;
  /** Optional subtitle/badge instead of stacked wordmark (e.g. for Admin sidebar) */
  adminLabel?: boolean;
  className?: string;
}

export const DericoLogo: React.FC<DericoLogoProps> = ({
  variant = 'light',
  size = 'md',
  showWordmark = true,
  adminLabel = false,
  className = '',
}) => {
  const boxClass =
    size === 'sm'
      ? 'w-9 h-9 rounded-xl'
      : size === 'lg'
      ? 'w-12 h-12 rounded-2xl'
      : 'w-10 h-10 rounded-xl';

  const wordmarkHeight =
    size === 'sm' ? 'h-9' : size === 'lg' ? 'h-12' : 'h-10';

  const isDark = variant === 'dark';

  return (
    <div className={`inline-flex items-center gap-2.5 text-left shrink-0 ${className}`}>
      <div
        className={`${boxClass} overflow-hidden shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${
          isDark
            ? 'bg-white p-0.5 shadow-md ring-1 ring-white/20'
            : 'bg-white border border-[#ECECEC] p-0.5 shadow-xs'
        }`}
      >
        <img
          src={dericoLogoImg}
          alt="Derico Motors Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {showWordmark && !adminLabel && (
        <div className={`${wordmarkHeight} flex flex-col justify-between py-0.5`}>
          <span
            className={`font-display font-extrabold leading-none uppercase ${
              size === 'sm'
                ? 'text-[14px] tracking-[0.05em]'
                : size === 'lg'
                ? 'text-[17px] tracking-[0.05em]'
                : 'text-[15px] tracking-[0.05em]'
            } ${isDark ? 'text-white' : 'text-[#040401]'}`}
          >
            Derico
          </span>
          <div
            className={`w-full h-[1.5px] rounded-full ${
              isDark ? 'bg-white/80' : 'bg-[#040401]'
            }`}
          />
          <span
            className={`font-display font-extrabold leading-none uppercase ${
              size === 'sm'
                ? 'text-[9px] tracking-[0.24em]'
                : size === 'lg'
                ? 'text-[11px] tracking-[0.24em]'
                : 'text-[10px] tracking-[0.24em]'
            } ${isDark ? 'text-white/90' : 'text-[#040401]'}`}
          >
            Motors
          </span>
        </div>
      )}

      {showWordmark && adminLabel && (
        <span className="font-display font-bold text-base text-white truncate tracking-tight">
          Derico<span className="text-[#FF3600]">.</span>Admin
        </span>
      )}
    </div>
  );
};
