import React from 'react';
import { Project, ProjectColor } from '../types';
import { soundFx } from '../lib/soundFx';
import { 
  PixelSparkle, 
  PixelHeartWinged, 
  PixelTamagotchi, 
  PixelGameBoy, 
  PixelFlipPhone, 
  PixelCassette, 
  PixelSmiley, 
  PixelAlienIcon, 
  PixelLikeBubble 
} from './PixelArtIcons';
import { 
  Gamepad2, 
  Volume2, 
  VolumeX, 
  Tv, 
  Plus, 
  FileText, 
  Sparkles, 
  Layers, 
  Clock, 
  CheckSquare, 
  StickyNote, 
  Calendar, 
  Folder,
  Palette
} from 'lucide-react';

export type Y2KTheme = 'chartreuse' | 'pastel_y2k' | 'dark_console' | 'retro_yellow';

interface RetroHeaderProps {
  projects: Project[];
  activeProject: Project | null;
  onSelectProject: (p: Project | null) => void;
  onOpenNewProject: () => void;
  onOpenBossReport: () => void;
  onOpenChatbot: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
  activeTab: 'dashboard' | 'logs' | 'todos' | 'notes' | 'calendar' | 'workspace';
  onChangeTab: (tab: 'dashboard' | 'logs' | 'todos' | 'notes' | 'calendar' | 'workspace') => void;
  theme: Y2KTheme;
  onChangeTheme: (theme: Y2KTheme) => void;
}

const colorMap: Record<ProjectColor, string> = {
  pink: 'bg-pink-500 text-white border-pink-700',
  cyan: 'bg-cyan-400 text-black border-cyan-600',
  lime: 'bg-lime-400 text-black border-lime-600',
  yellow: 'bg-yellow-300 text-black border-yellow-500',
  purple: 'bg-purple-500 text-white border-purple-700',
  orange: 'bg-orange-400 text-black border-orange-600',
};

export const RetroHeader: React.FC<RetroHeaderProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onOpenNewProject,
  onOpenBossReport,
  onOpenChatbot,
  soundEnabled,
  onToggleSound,
  crtEnabled,
  onToggleCrt,
  activeTab,
  onChangeTab,
  theme,
  onChangeTheme
}) => {
  return (
    <header className="bg-white border-b-[4px] border-black p-3 md:p-5 text-black relative z-30 shadow-[0_8px_0_0_#000] no-print mb-2">
      {/* Top Banner Marquee */}
      <div className="bg-black border-[3px] border-black overflow-hidden py-1.5 mb-4 text-xs font-mono text-white flex items-center rounded-2xl relative">
        <span className="bg-[#FF6B6B] text-white px-3 py-0.5 text-[10px] uppercase font-black mr-2 shrink-0 animate-pulse rounded-full border border-black z-10 flex items-center gap-1">
          <PixelSparkle size={12} color="#FFFFFF" /> Y2K PIXEL ENGINE
        </span>
        <div className="animate-marquee whitespace-nowrap text-[11px] font-black tracking-wider text-[#FFD93D] flex items-center gap-4">
          <span>👾 TRACK TIME</span> <span>❖</span>
          <span>⚡ LOG WORKING POINTS</span> <span>❖</span>
          <span>🎮 TAMAGOTCHI & GAMEBOY PIXEL ART</span> <span>❖</span>
          <span>📝 GOOGLE DOCS AI SUMMARIZER</span> <span>❖</span>
          <span>🧠 GEMINI THINKING MODE</span> <span>❖</span>
          <span>📊 EXPORT CLEAN BOSS REPORTS</span> <span>❖</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Logo and Brand Title with Pixel Art Decor */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onSelectProject(null)}>
            <div className="relative">
              <div className="w-12 h-12 bg-[#CCFF00] border-[3px] border-black rounded-2xl flex items-center justify-center font-black text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:translate-y-0.5 transition-transform">
                👾
              </div>
              <PixelSparkle size={14} color="#A29BFE" className="absolute -top-2 -right-2 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-2xl md:text-3xl tracking-tight text-black italic uppercase flex items-center gap-1.5">
                  PixelTrack <span className="text-[#A29BFE]">2000</span>
                </h1>
                <span className="hidden sm:inline-block bg-[#CCFF00] text-black text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  Y2K Pixel Art
                </span>
              </div>
              <p className="text-xs text-zinc-600 font-bold hidden sm:flex items-center gap-2">
                <span>Quirky Scope & Time Engine</span>
                <PixelLikeBubble text="Like!" className="scale-75 origin-left" />
              </p>
            </div>
          </div>

          {/* Quick Sound & CRT Controls for Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => { soundFx.playClick(); onToggleSound(); }}
              className={`p-2 rounded-xl border-2 border-black pixel-btn-press text-xs font-black ${soundEnabled ? 'bg-[#FFD93D] text-black' : 'bg-zinc-200 text-zinc-500'}`}
              title="Toggle Sound FX"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => { soundFx.playClick(); onToggleCrt(); }}
              className={`p-2 rounded-xl border-2 border-black pixel-btn-press text-xs font-black ${crtEnabled ? 'bg-[#4ECDC4] text-black' : 'bg-zinc-200 text-zinc-500'}`}
              title="Toggle CRT Scanline Overlay"
            >
              <Tv className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Project Selector, Y2K Themes & Actions */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {/* Y2K Pixel Theme Selector */}
          <div className="flex items-center gap-1 bg-[#F1F2F6] p-1 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-[10px] font-black uppercase px-2 text-black flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-black" />
              <span className="hidden lg:inline">Theme:</span>
            </span>

            <button
              onClick={() => { soundFx.playClick(); onChangeTheme('chartreuse'); }}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-black border border-black transition-all ${
                theme === 'chartreuse' ? 'bg-[#CCFF00] text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-zinc-600 hover:bg-zinc-100'
              }`}
              title="Chartreuse Lime & Lilac (Ref Image 1)"
            >
              🥑 Lime
            </button>

            <button
              onClick={() => { soundFx.playClick(); onChangeTheme('pastel_y2k'); }}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-black border border-black transition-all ${
                theme === 'pastel_y2k' ? 'bg-[#C4B5FD] text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-zinc-600 hover:bg-zinc-100'
              }`}
              title="Pastel Tamagotchi Lilac & Pink (Ref Image 2)"
            >
              🌸 Tamagotchi
            </button>

            <button
              onClick={() => { soundFx.playClick(); onChangeTheme('dark_console'); }}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-black border border-black transition-all ${
                theme === 'dark_console' ? 'bg-[#181824] text-[#00F0FF] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-zinc-600 hover:bg-zinc-100'
              }`}
              title="Dark Console Neon (Ref Image 3)"
            >
              👾 Console
            </button>

            <button
              onClick={() => { soundFx.playClick(); onChangeTheme('retro_yellow'); }}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-black border border-black transition-all ${
                theme === 'retro_yellow' ? 'bg-[#FFD93D] text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-zinc-600 hover:bg-zinc-100'
              }`}
              title="Classic Yellow"
            >
              ⚡ Yellow
            </button>
          </div>

          {/* Project Selector Dropdown */}
          <div className="relative flex-1 sm:flex-initial min-w-[180px]">
            <select
              value={activeProject ? activeProject.id : 'all'}
              onChange={(e) => {
                soundFx.playClick();
                const val = e.target.value;
                if (val === 'all') {
                  onSelectProject(null);
                } else {
                  const p = projects.find(proj => proj.id === val);
                  if (p) onSelectProject(p);
                }
              }}
              className="w-full bg-[#F1F2F6] text-black font-black text-xs px-3.5 py-2.5 rounded-2xl border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:outline-none cursor-pointer"
            >
              <option value="all">🌟 All Projects Overview</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  📁 {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* New Project Button */}
          <button
            onClick={() => { soundFx.playClick(); onOpenNewProject(); }}
            className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-black text-xs px-3.5 py-2.5 rounded-2xl border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 cursor-pointer uppercase flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">New Project</span>
            <span className="sm:hidden">Project</span>
          </button>

          {/* Boss Export Button */}
          <button
            onClick={() => { soundFx.playLevelUp(); onOpenBossReport(); }}
            className="bg-[#4ECDC4] hover:bg-[#3dbdb5] text-black font-black text-xs px-3.5 py-2.5 rounded-2xl border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 cursor-pointer uppercase flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 stroke-[2.5]" />
            <span>Boss Report</span>
          </button>

          {/* AI Support Chatbot Button */}
          <button
            onClick={() => { soundFx.playClick(); onOpenChatbot(); }}
            className="bg-[#CCFF00] hover:bg-lime-300 text-black font-black text-xs px-3.5 py-2.5 rounded-2xl border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 cursor-pointer uppercase flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 stroke-[2.5] text-black animate-pulse" />
            <span>🤖 AI Support</span>
          </button>

          {/* Sound & CRT Controls Desktop */}
          <div className="hidden md:flex items-center gap-2 ml-1 border-l-2 border-black pl-3">
            <button
              onClick={() => { soundFx.playClick(); onToggleSound(); }}
              className={`p-2.5 rounded-xl border-2 border-black pixel-btn-press text-xs font-black cursor-pointer ${soundEnabled ? 'bg-[#FFD93D] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-zinc-200 text-zinc-500'}`}
              title="Sound FX On/Off"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => { soundFx.playClick(); onToggleCrt(); }}
              className={`p-2.5 rounded-xl border-2 border-black pixel-btn-press text-xs font-black cursor-pointer ${crtEnabled ? 'bg-[#4ECDC4] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-zinc-200 text-zinc-500'}`}
              title="CRT Retro Effect"
            >
              <Tv className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="max-w-7xl mx-auto mt-5 pt-3 border-t-2 border-black flex items-center justify-between overflow-x-auto scrollbar-none gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { soundFx.playClick(); onChangeTab('dashboard'); }}
            className={`px-4 py-2 rounded-t-2xl font-black text-xs border-[3px] border-b-0 border-black flex items-center gap-1.5 cursor-pointer transition-all uppercase ${
              activeTab === 'dashboard'
                ? 'bg-[#FFD93D] text-black italic -mb-[3px] shadow-[4px_-3px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-[#F1F2F6] text-zinc-700 hover:bg-[#FFE66D]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Widgets Dashboard</span>
          </button>

          <button
            onClick={() => { soundFx.playClick(); onChangeTab('logs'); }}
            className={`px-4 py-2 rounded-t-2xl font-black text-xs border-[3px] border-b-0 border-black flex items-center gap-1.5 cursor-pointer transition-all uppercase ${
              activeTab === 'logs'
                ? 'bg-[#FF6B6B] text-white italic -mb-[3px] shadow-[4px_-3px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-[#F1F2F6] text-zinc-700 hover:bg-[#FFE66D]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Time Logs</span>
          </button>

          <button
            onClick={() => { soundFx.playClick(); onChangeTab('todos'); }}
            className={`px-4 py-2 rounded-t-2xl font-black text-xs border-[3px] border-b-0 border-black flex items-center gap-1.5 cursor-pointer transition-all uppercase ${
              activeTab === 'todos'
                ? 'bg-[#4ECDC4] text-black italic -mb-[3px] shadow-[4px_-3px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-[#F1F2F6] text-zinc-700 hover:bg-[#FFE66D]'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>To-Dos & Scope</span>
          </button>

          <button
            onClick={() => { soundFx.playClick(); onChangeTab('notes'); }}
            className={`px-4 py-2 rounded-t-2xl font-black text-xs border-[3px] border-b-0 border-black flex items-center gap-1.5 cursor-pointer transition-all uppercase ${
              activeTab === 'notes'
                ? 'bg-[#A29BFE] text-black italic -mb-[3px] shadow-[4px_-3px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-[#F1F2F6] text-zinc-700 hover:bg-[#FFE66D]'
            }`}
          >
            <StickyNote className="w-4 h-4" />
            <span>Notes & Learnings</span>
          </button>

          <button
            onClick={() => { soundFx.playClick(); onChangeTab('calendar'); }}
            className={`px-4 py-2 rounded-t-2xl font-black text-xs border-[3px] border-b-0 border-black flex items-center gap-1.5 cursor-pointer transition-all uppercase ${
              activeTab === 'calendar'
                ? 'bg-[#FAB1A0] text-black italic -mb-[3px] shadow-[4px_-3px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-[#F1F2F6] text-zinc-700 hover:bg-[#FFE66D]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Google Sync</span>
          </button>

          <button
            onClick={() => { soundFx.playClick(); onChangeTab('workspace'); }}
            className={`px-4 py-2 rounded-t-2xl font-black text-xs border-[3px] border-b-0 border-black flex items-center gap-1.5 cursor-pointer transition-all uppercase ${
              activeTab === 'workspace'
                ? 'bg-[#CCFF00] text-black italic -mb-[3px] shadow-[4px_-3px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-[#F1F2F6] text-zinc-700 hover:bg-[#FFE66D]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-black animate-pulse" />
            <span>Workspace Hub</span>
          </button>
        </div>

        {/* Current Scope Banner */}
        {activeProject && (
          <div className="hidden lg:flex items-center gap-2 bg-[#F1F2F6] px-3.5 py-1.5 rounded-full border-2 border-black text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Folder className="w-3.5 h-3.5 text-black" />
            <span className="font-black text-black uppercase">{activeProject.name}</span>
            <span className="text-zinc-600">• Scope: {activeProject.targetHours}h / {activeProject.targetPoints} pts</span>
          </div>
        )}
      </div>
    </header>
  );
};
