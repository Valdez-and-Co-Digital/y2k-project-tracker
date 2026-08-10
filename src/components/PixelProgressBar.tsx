import React from 'react';
import { Sparkles, Trophy, Zap, Award } from 'lucide-react';

interface PixelProgressBarProps {
  label: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  color?: 'pink' | 'cyan' | 'lime' | 'yellow' | 'purple' | 'orange';
  showAvatar?: boolean;
}

export const PixelProgressBar: React.FC<PixelProgressBarProps> = ({
  label,
  currentValue,
  targetValue,
  unit,
  color = 'pink',
  showAvatar = true
}) => {
  const percentage = Math.min(100, Math.round((currentValue / (targetValue || 1)) * 100));
  const isComplete = percentage >= 100;

  // Calculate 10 chunky pixel blocks
  const blockCount = 10;
  const filledBlocks = Math.floor((percentage / 100) * blockCount);

  const themeColors = {
    pink: {
      bg: 'bg-[#FF6B6B]',
      border: 'border-black',
      glow: 'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
      text: 'text-[#FF6B6B]'
    },
    cyan: {
      bg: 'bg-[#4ECDC4]',
      border: 'border-black',
      glow: 'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
      text: 'text-[#4ECDC4]'
    },
    lime: {
      bg: 'bg-[#00A896]',
      border: 'border-black',
      glow: 'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
      text: 'text-[#00A896]'
    },
    yellow: {
      bg: 'bg-[#FFD93D]',
      border: 'border-black',
      glow: 'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
      text: 'text-[#FFD93D]'
    },
    purple: {
      bg: 'bg-[#A29BFE]',
      border: 'border-black',
      glow: 'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
      text: 'text-[#A29BFE]'
    },
    orange: {
      bg: 'bg-[#FAB1A0]',
      border: 'border-black',
      glow: 'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
      text: 'text-[#FAB1A0]'
    }
  }[color];

  return (
    <div className="w-full bg-white p-4 rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden text-black">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Zap className={`w-4 h-4 fill-current text-black`} />
          <span className="font-black text-xs text-black uppercase tracking-wide">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-base text-black font-black">
            {currentValue} / {targetValue} <span className="text-xs text-zinc-500 font-bold">{unit}</span>
          </span>
          <span className={`font-black text-xs px-2.5 py-0.5 rounded-full border-2 border-black ${isComplete ? 'bg-[#FFD93D] text-black animate-pulse' : 'bg-black text-white'}`}>
            {percentage}%
          </span>
        </div>
      </div>

      {/* Interactive Pixel Progress Bar Track */}
      <div className="relative w-full h-8 bg-[#F1F2F6] border-2 border-black rounded-xl p-1 flex gap-1 shadow-[inner_0_2px_4px_rgba(0,0,0,0.1)]">
        {/* Animated Walking Pixel Avatar Sprite */}
        {showAvatar && percentage > 0 && (
          <div
            className="absolute -top-6 transition-all duration-500 ease-out z-10 flex flex-col items-center"
            style={{ left: `calc(${Math.min(94, Math.max(2, percentage))}% - 14px)` }}
          >
            <div className="text-base animate-bounce">
              {isComplete ? '👑' : percentage > 50 ? '🏃‍♂️' : '👾'}
            </div>
          </div>
        )}

        {/* Chunky Pixel Blocks */}
        {Array.from({ length: blockCount }).map((_, index) => {
          const isFilled = index < filledBlocks;
          const isCurrentEdge = index === filledBlocks - 1;

          return (
            <div
              key={index}
              className={`flex-1 rounded-lg transition-all duration-300 border-2 border-black relative overflow-hidden ${
                isFilled
                  ? `${themeColors.bg} ${isCurrentEdge ? 'animate-pulse' : ''}`
                  : 'bg-zinc-100 border-zinc-300'
              }`}
            >
              {/* Retro Block Highlight overlay */}
              {isFilled && (
                <div className="absolute top-0 inset-x-0 h-1/2 bg-white/30 pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>

      {/* Level-Up Banner on Complete */}
      {isComplete && (
        <div className="mt-2.5 bg-[#FFD93D] p-2 rounded-xl border-2 border-black text-black font-black text-xs text-center uppercase flex items-center justify-center gap-2 animate-bounce shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Trophy className="w-4 h-4 fill-current" />
          <span>LEVEL COMPLETE! TARGET ACHIEVED 🚀</span>
          <Sparkles className="w-4 h-4 fill-current" />
        </div>
      )}
    </div>
  );
};
