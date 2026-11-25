import React from 'react';
import dericoLogoImg from '../../assets/images/derico-logo.jpg';

export const DERICO_LOGO_SRC = dericoLogoImg;

interface DericoLogoProps {
  /** 'light' = sitting on a white/light surface; 'dark' = sitting on obsidian/dark surface */
  variant?: 'light' | 'dark';
  /** Emblem size */
  size?: 'sm' | 'md' | 'lg';
  /** Optional label for Admin sidebar */
  showWordmark?: boolean;
  adminLabel?: boolean;
  className?: string;
}

export const DericoLogo: React.FC<DericoLogoProps> = ({
  variant = 'light',
  size = 'md',
  showWordmark = false,
  adminLabel = false,
  className = '',
}) => {
  const boxClass =
    size === 'sm'
      ? 'w-11 h-11 rounded-xl'
      : size === 'lg'
      ? 'w-16 h-16 rounded-2xl'
      : 'w-12 h-12 sm:w-14 sm:h-14 rounded-xl';

  const isDark = variant === 'dark';

  return (
    <div className={`inline-flex items-center gap-2.5 text-left shrink-0 ${className}`}>
      <div
        className={`${boxClass} overflow-hidden shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${
          isDark
            ? 'bg-white p-1 shadow-md ring-1 ring-white/20'
            : 'bg-white p-0.5'
        }`}
      >
        <img
          src={dericoLogoImg}
          alt="Derico Motors"
          className="w-full h-full object-contain"
        />
      </div>

      {showWordmark && adminLabel && (
        <span className="font-display font-bold text-sm text-white truncate tracking-tight">
          Admin
        </span>
      )}
    </div>
  );
};
