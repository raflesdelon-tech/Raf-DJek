import React from 'react';

interface SpoonForkIconProps {
  className?: string;
}

/**
 * Ikon Sendok dan Garpu (Spoon and Fork) berdampingan rapi
 * Khusus untuk layanan kuliner & makanan D'Food
 */
export const SpoonForkIcon: React.FC<SpoonForkIconProps> = ({ className = 'w-6 h-6' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Garpu (Fork) di sisi kiri */}
      <path d="M5 2v6a3 3 0 0 0 3 3v11" />
      <path d="M5 2v5" />
      <path d="M8 2v5" />
      <path d="M11 2v5" />
      <path d="M11 2v6a3 3 0 0 1-3 3" />
      {/* Sendok (Spoon) di sisi kanan */}
      <path d="M16 12v10" />
      <path d="M16 2a3.5 3.5 0 0 0-3.5 4.5c.7 2.3 2.5 3.5 3.5 5.5 1-2 2.8-3.2 3.5-5.5A3.5 3.5 0 0 0 16 2z" />
    </svg>
  );
};

export default SpoonForkIcon;
