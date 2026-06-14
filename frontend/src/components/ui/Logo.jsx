import React from 'react';

export const Logo = ({ size = 32, showText = false, className = '', textClass = 'text-slate-800' }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        {/* Hexagonal Shield */}
        <path d="M16 2L2 9.5V22.5L16 30L30 22.5V9.5L16 2Z" fill="url(#logo-gradient)" />
        {/* Semi-transparent inner hexagon border */}
        <path d="M16 5L5 11V21L16 27L27 21V11L16 5Z" fill="#ffffff" fillOpacity="0.12" />
        {/* Monaco-style editor CLI cursor >_ */}
        <path d="M11 11L15 15L11 19" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 19H21" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      {showText && (
        <span className={`text-base font-extrabold tracking-tight ${textClass}`}>
          SurCodex
        </span>
      )}
    </div>
  );
};
