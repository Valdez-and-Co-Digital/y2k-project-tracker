import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../types';

interface TopNavProps {
  activeProject: Project | null;
  projects: Project[];
  onSelectProject: (project: Project | null) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
  onToggleMobileNav: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeProject,
  projects,
  onSelectProject,
  soundEnabled,
  onToggleSound,
  crtEnabled,
  onToggleCrt,
  onToggleMobileNav,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (project: Project | null) => {
    onSelectProject(project);
    setIsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-4 bg-surface-container-lowest border-b-3 border-on-surface">
      <div className="flex items-center gap-4">
        {/* Mobile Nav Toggle */}
        <button 
          className="md:hidden p-2 border-2 border-on-surface hover:bg-surface-variant flex items-center justify-center"
          onClick={onToggleMobileNav}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* Project Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-surface border-2 border-on-surface hover:bg-surface-variant font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] transition-all"
          >
            <span className="material-symbols-outlined text-primary">folder</span>
            <span className="truncate max-w-[150px] sm:max-w-[200px]">
              {activeProject ? activeProject.name : 'Workspace Overview'}
            </span>
            <span className="material-symbols-outlined">arrow_drop_down</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-surface border-3 border-on-surface shadow-hard z-50">
              <button
                onClick={() => handleSelect(null)}
                className={`w-full text-left px-4 py-3 hover:bg-primary-container hover:text-on-primary-container border-b-2 border-on-surface flex items-center gap-3 ${
                  !activeProject ? 'bg-primary-container text-on-primary-container font-bold' : ''
                }`}
              >
                <span className="material-symbols-outlined">grid_view</span>
                Workspace Overview
              </button>
              <div className="max-h-60 overflow-y-auto">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleSelect(project)}
                    className={`w-full text-left px-4 py-3 hover:bg-surface-variant border-b border-outline-variant flex items-center gap-3 ${
                      activeProject?.id === project.id ? 'font-bold bg-surface-variant' : ''
                    }`}
                  >
                    <span className="material-symbols-outlined text-primary">folder</span>
                    <span className="truncate">{project.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Desktop Pills */}
        <div className="hidden md:flex items-center gap-3 mr-4">
          <div className="px-3 py-1 bg-lime-300 text-black border-2 border-black font-mono text-xs uppercase flex items-center gap-1 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            <span className="material-symbols-outlined text-sm">palette</span>
            Theme: Lime
          </div>
          <div className="px-3 py-1 bg-pink-300 text-black border-2 border-black font-mono text-xs uppercase flex items-center gap-1 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            <span className="material-symbols-outlined text-sm">pets</span>
            Lvl 12
          </div>
        </div>

        {/* Toggles */}
        <div className="flex gap-2">
          <button 
            onClick={onToggleSound}
            className={`p-2 border-2 border-on-surface flex items-center justify-center transition-colors ${
              soundEnabled ? 'bg-primary text-on-primary' : 'bg-surface hover:bg-surface-variant'
            }`}
            title="Toggle Sound"
          >
            <span className="material-symbols-outlined">
              {soundEnabled ? 'volume_up' : 'volume_off'}
            </span>
          </button>
          
          <button 
            onClick={onToggleCrt}
            className={`p-2 border-2 border-on-surface flex items-center justify-center transition-colors ${
              crtEnabled ? 'bg-retro-teal text-black' : 'bg-surface hover:bg-surface-variant'
            }`}
            title="Toggle CRT Effect"
          >
            <span className="material-symbols-outlined">tv</span>
          </button>
        </div>

        {/* User Avatar */}
        <div className="w-10 h-10 bg-primary-container border-2 border-on-surface rounded-full flex items-center justify-center overflow-hidden">
          <span className="material-symbols-outlined text-on-primary-container">person</span>
        </div>
      </div>
    </header>
  );
};
