import React from 'react';

// Crisp pixel rendering style helper
const pixelSvgStyle = { shapeRendering: 'crispEdges' as const };

// 4-Point Pixel Sparkle / Star ✨
export const PixelSparkle: React.FC<{ className?: string; size?: number; color?: string }> = ({
  className = '',
  size = 24,
  color = 'currentColor'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    className={className}
    style={pixelSvgStyle}
  >
    <path
      d="M7 0h2v5h5v2H9v7H7V7H2V5h5V0z"
      fill={color}
    />
    <rect x="6" y="6" width="4" height="2" fill="#FFFFFF" />
  </svg>
);

// Pixel Heart with Wings 💖
export const PixelHeartWinged: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 32
}) => (
  <svg
    width={size}
    height={size * 0.75}
    viewBox="0 0 32 24"
    fill="none"
    className={className}
    style={pixelSvgStyle}
  >
    {/* Left Wing */}
    <path d="M0 6h4v2H0V6zm2 2h4v2H2V8zm2 2h4v2H4v-2z" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
    {/* Right Wing */}
    <path d="M28 6h4v2h-4V6zm-2 2h4v2h-4V8zm-2 2h4v2h-4v-2z" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
    {/* Pixel Heart Body */}
    <path
      d="M10 4h4v2h-4V4zm8 0h4v2h-4V4zm-10 2h6v2H8V6zm8 0h6v2h-6V6zm-9 2h16v4H7V8zm2 4h12v2H9v-2zm2 2h8v2h-8v-2zm2 2h4v2h-4v-2z"
      fill="#A29BFE"
    />
    <path
      d="M10 3h4v1h-4V3zm8 0h4v1h-4V3zm-10 3h2v1H8V6zm14 0h2v1h-2V6zm-15 2h1v4H7V8zm17 0h1v4h-1V8zm-16 4h1v2H8v-2zm15 0h1v2h-1v-2zm-13 2h1v2h-1v-2zm11 0h1v2h-1v-2zm-9 2h1v2h-1v-2zm7 0h1v2h-1v-2zm-5 2h2v1h-2v-1z"
      fill="#000000"
    />
  </svg>
);

// Tamagotchi Handheld Console 🐣
export const PixelTamagotchi: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 40
}) => (
  <svg
    width={size}
    height={size * 1.1}
    viewBox="0 0 32 36"
    fill="none"
    className={className}
    style={pixelSvgStyle}
  >
    {/* Egg Body */}
    <rect x="6" y="2" width="20" height="32" rx="0" fill="#FF7675" />
    <rect x="4" y="6" width="24" height="24" rx="0" fill="#FF7675" />
    <rect x="2" y="10" width="28" height="16" rx="0" fill="#FF7675" />
    {/* Body Outline */}
    <path d="M8 0h16v2H8V0zM4 2h4v2H4V2zM2 6h2v4H2V6zM0 10h2v16H0V10zm2 16h2v4H2v-4zm2 4h4v2H4v-2zm4 2h16v2H8v-2zm16-2h4v2h-4v-2zm4-4h2v-4h-2v4zm0-16h2v10h-2V10zm0-4h-2V2h2v4z" fill="#000000" />
    {/* Screen */}
    <rect x="8" y="8" width="16" height="12" fill="#ECCC68" stroke="#000000" strokeWidth="2" />
    {/* Pixel Cat / Alien Face inside Tamagotchi */}
    <path d="M11 11h2v2h-2v-2zm8 0h2v2h-2v-2zm-6 5h6v1h-6v-1z" fill="#000000" />
    {/* 3 Buttons */}
    <circle cx="10" cy="26" r="2" fill="#FFD93D" stroke="#000000" strokeWidth="1" />
    <circle cx="16" cy="27" r="2" fill="#FFD93D" stroke="#000000" strokeWidth="1" />
    <circle cx="22" cy="26" r="2" fill="#FFD93D" stroke="#000000" strokeWidth="1" />
  </svg>
);

// Game Boy Console 🎮
export const PixelGameBoy: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 36
}) => (
  <svg
    width={size}
    height={size * 1.3}
    viewBox="0 0 24 32"
    fill="none"
    className={className}
    style={pixelSvgStyle}
  >
    {/* Shell */}
    <rect x="2" y="2" width="20" height="28" fill="#A29BFE" stroke="#000000" strokeWidth="2" />
    {/* Screen Frame */}
    <rect x="4" y="4" width="16" height="12" fill="#000000" />
    <rect x="6" y="6" width="12" height="8" fill="#9AE6B4" />
    {/* Screen Details */}
    <rect x="8" y="8" width="8" height="4" fill="#22543D" />
    {/* D-Pad */}
    <path d="M7 20h2v2H7v-2zm-2 2h6v2H5v-2zm2 2h2v2H7v-2z" fill="#000000" />
    {/* A & B Buttons */}
    <rect x="17" y="19" width="3" height="3" fill="#FF6B6B" rx="1" stroke="#000000" strokeWidth="1" />
    <rect x="13" y="22" width="3" height="3" fill="#FF6B6B" rx="1" stroke="#000000" strokeWidth="1" />
    {/* Select Start */}
    <rect x="8" y="27" width="3" height="1" fill="#000000" />
    <rect x="13" y="27" width="3" height="1" fill="#000000" />
  </svg>
);

// Flip Phone 📱
export const PixelFlipPhone: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 28
}) => (
  <svg
    width={size}
    height={size * 1.4}
    viewBox="0 0 20 28"
    fill="none"
    className={className}
    style={pixelSvgStyle}
  >
    {/* Top Screen */}
    <rect x="4" y="2" width="12" height="10" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
    <rect x="6" y="4" width="8" height="6" fill="#4ECDC4" />
    <rect x="8" y="6" width="4" height="2" fill="#000000" />
    {/* Hinge */}
    <rect x="2" y="12" width="16" height="2" fill="#000000" />
    {/* Keypad Base */}
    <rect x="4" y="14" width="12" height="12" fill="#FFD93D" stroke="#000000" strokeWidth="2" />
    {/* Keypad Grid */}
    <rect x="6" y="16" width="2" height="2" fill="#000000" />
    <rect x="9" y="16" width="2" height="2" fill="#000000" />
    <rect x="12" y="16" width="2" height="2" fill="#000000" />
    <rect x="6" y="19" width="2" height="2" fill="#000000" />
    <rect x="9" y="19" width="2" height="2" fill="#000000" />
    <rect x="12" y="19" width="2" height="2" fill="#000000" />
    <rect x="6" y="22" width="2" height="2" fill="#000000" />
    <rect x="9" y="22" width="2" height="2" fill="#000000" />
    <rect x="12" y="22" width="2" height="2" fill="#000000" />
  </svg>
);

// Cassette Tape 📼
export const PixelCassette: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 36
}) => (
  <svg
    width={size}
    height={size * 0.65}
    viewBox="0 0 32 20"
    fill="none"
    className={className}
    style={pixelSvgStyle}
  >
    <rect x="1" y="1" width="30" height="18" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
    <rect x="4" y="4" width="24" height="8" fill="#A29BFE" stroke="#000000" strokeWidth="1" />
    {/* Spools */}
    <circle cx="10" cy="8" r="2" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
    <circle cx="22" cy="8" r="2" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
    <rect x="8" y="14" width="16" height="3" fill="#FF6B6B" stroke="#000000" strokeWidth="1" />
  </svg>
);

// Pixel Smiley Face 😃
export const PixelSmiley: React.FC<{ className?: string; size?: number; color?: string }> = ({
  className = '',
  size = 28,
  color = '#A29BFE'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    className={className}
    style={pixelSvgStyle}
  >
    <rect x="4" y="0" width="12" height="20" fill={color} />
    <rect x="0" y="4" width="20" height="12" fill={color} />
    <rect x="2" y="2" width="16" height="16" fill={color} />
    {/* Outline */}
    <path d="M6 0h8v2H6V0zM2 2h4v2H2V2zM0 6h2v8H0V6zm2 8h4v2H2v-2zm4 2h8v2H6v-2zm8-2h4v2h-4v-2zm2-8h2v8h-2V6zm-2-4h4v2h-4V2z" fill="#000000" />
    {/* Eyes */}
    <rect x="5" y="6" width="3" height="4" fill="#000000" />
    <rect x="12" y="6" width="3" height="4" fill="#000000" />
    {/* Mouth */}
    <path d="M5 13h2v2H5v-2zm2 2h6v2H7v-2zm6-2h2v2h-2v-2z" fill="#000000" />
  </svg>
);

// Pixel Alien 👾
export const PixelAlienIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 28
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    className={className}
    style={pixelSvgStyle}
  >
    <path
      d="M6 2h8v2H6V2zm-2 2h12v2H4V4zm-2 2h16v4H2V6zm0 4h4v2H2v-2zm12 0h4v2h-4v-2zm-10 2h12v2H4v-2zm2 2h2v4H6v-4zm6 0h2v4h-2v-4z"
      fill="#A29BFE"
    />
    <path
      d="M6 1h8v1H6V1zm-2 2h2v1H4V3zm12 0h2v1h-2V3zm-14 3h2v1H2V6zm16 0h2v1h-2V6zm-16 4h2v1H2v-1zm16 0h2v1h-2v-1z"
      fill="#000000"
    />
    {/* Eyes */}
    <rect x="5" y="7" width="3" height="3" fill="#000000" />
    <rect x="12" y="7" width="3" height="3" fill="#000000" />
  </svg>
);

// Pixel "Like!" Speech Bubble 💬
export const PixelLikeBubble: React.FC<{ className?: string; text?: string }> = ({
  className = '',
  text = 'Like!'
}) => (
  <div className={`bg-white text-black font-black text-xs px-3 py-1 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] relative flex items-center gap-1 font-pixel uppercase tracking-wide ${className}`}>
    <span>{text}</span>
    <PixelSparkle size={12} color="#FFD93D" />
    <div className="absolute -bottom-2 left-4 w-2 h-2 bg-white border-r-2 border-b-2 border-black rotate-45" />
  </div>
);

// Pixel Grid Background Overlay Pattern
export const PixelGridBackground: React.FC = () => (
  <div
    className="fixed inset-0 pointer-events-none opacity-20 z-0"
    style={{
      backgroundImage: `radial-gradient(#000000 1.5px, transparent 1.5px), radial-gradient(#000000 1.5px, #FFD93D 1.5px)`,
      backgroundSize: `24px 24px`,
      backgroundPosition: `0 0, 12px 12px`
    }}
  />
);
