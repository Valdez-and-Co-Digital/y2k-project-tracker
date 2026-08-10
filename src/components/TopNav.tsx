import React from 'react';
import { Project } from '../types';
import { Menu, Palette, Pets, ExpandMore, VolumeUp, Tv } from '@mui/icons-material';

interface TopNavProps {
  activeProject: Project | null;
  soundEnabled: boolean;
  onToggleSound: () => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
}

export function TopNav({
  activeProject,
  soundEnabled,
  onToggleSound,
  crtEnabled,
  onToggleCrt
}: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-gutter py-4 bg-surface-container-lowest border-b-3 border-on-surface">
      {/* Mobile Menu Button (Hidden on Desktop) */}
      <button className="md:hidden p-2 rounded-lg border-3 border-on-surface bg-surface hover:bg-surface-container-high">
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Marquee/Top Links (Desktop) */}
      <div className="hidden md:flex items-center gap-4">
        <div className="flex items-center gap-2 bg-surface-container-high rounded-full px-4 py-1 border-3 border-on-surface shadow-hard">
          <span className="material-symbols-outlined text-sm">palette</span>
          <span className="font-label-pixel text-label-pixel">Theme: Lime</span>
        </div>
        <div className="flex items-center gap-2 bg-tertiary-container rounded-full px-4 py-1 border-3 border-on-surface shadow-hard">
          <span className="material-symbols-outlined text-sm">pets</span>
          <span className="font-label-pixel text-label-pixel">Tamagotchi</span>
        </div>
      </div>

      {/* Trailing Actions */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface rounded-xl border-3 border-on-surface hover:bg-surface-container-high transition-all shadow-hard btn-press">
            <span className="material-symbols-outlined">folder</span>
            <span className="font-label-pixel text-label-pixel uppercase truncate max-w-[120px] md:max-w-none">
              {activeProject ? activeProject.name : 'Workspace Overview'}
            </span>
            <span className="material-symbols-outlined">expand_more</span>
          </button>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={onToggleSound}
            className={`w-10 h-10 rounded-xl border-3 border-on-surface flex items-center justify-center hover:brightness-110 shadow-hard btn-press ${
              soundEnabled ? 'bg-retro-yellow' : 'bg-surface'
            }`}
          >
            <span className="material-symbols-outlined">
              {soundEnabled ? 'volume_up' : 'volume_off'}
            </span>
          </button>
          <button 
            onClick={onToggleCrt}
            className={`w-10 h-10 rounded-xl border-3 border-on-surface flex items-center justify-center hover:brightness-110 shadow-hard btn-press ${
              crtEnabled ? 'bg-retro-teal' : 'bg-surface'
            }`}
          >
            <span className="material-symbols-outlined">tv</span>
          </button>
        </div>

        <div className="w-10 h-10 rounded-full border-3 border-on-surface overflow-hidden bg-primary-container shrink-0">
          <img 
            className="w-full h-full object-cover" 
            alt="User avatar" 
            src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Morgan"
          />
        </div>
      </div>
    </header>
  );
}
