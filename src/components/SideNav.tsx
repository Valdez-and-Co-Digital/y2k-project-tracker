import React from 'react';
import { SmartToy, Add, Widgets, Schedule, Checklist, Description, Sync, Hub, Assessment, Menu, Palette, Pets, Folder, ExpandMore, VolumeUp, Tv } from '@mui/icons-material';

interface SideNavProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  onNewProject: () => void;
  onOpenBossReport: () => void;
  onOpenChatbot: () => void;
}

export function SideNav({ activeTab, onChangeTab, onNewProject, onOpenBossReport, onOpenChatbot }: SideNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Widgets Dashboard', icon: 'widgets' },
    { id: 'logs', label: 'Time Logs', icon: 'schedule' },
    { id: 'todos', label: 'To-Dos & Scope', icon: 'checklist' },
    { id: 'notes', label: 'Notes & Learnings', icon: 'description' },
    { id: 'google', label: 'Google Sync', icon: 'sync' },
    { id: 'workspace', label: 'Workspace Hub', icon: 'hub' },
  ];

  return (
    <nav className="hidden md:flex flex-col bg-surface w-72 h-screen border-r-3 border-on-surface fixed left-0 top-0 z-40 p-container-padding shadow-hard-lg">
      <div className="flex flex-col gap-6 h-full">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary-container border-3 border-on-surface rounded-xl flex items-center justify-center shadow-hard">
            <span className="material-symbols-outlined text-3xl">smart_toy</span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md font-black italic tracking-tighter uppercase leading-none">PIXELTRACK<br/><span className="text-tertiary-container text-stroke-black">2000</span></h1>
          </div>
        </div>

        {/* CTA */}
        <button 
          onClick={onNewProject}
          className="bg-secondary-container hover:bg-secondary-fixed text-on-surface font-label-pixel text-label-pixel uppercase border-3 border-on-surface rounded-xl py-3 px-4 shadow-hard flex items-center justify-center gap-2 transition-all btn-press w-full"
        >
          <span className="material-symbols-outlined">add</span>
          NEW PROJECT
        </button>

        {/* Navigation Links */}
        <div className="flex flex-col gap-2 flex-grow mt-4">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-3 border-on-surface transition-all group ${
                  isActive 
                    ? 'bg-primary-container text-on-primary-container shadow-hard translate-x-[-2px] translate-y-[-2px]' 
                    : 'bg-surface text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-label-pixel text-label-pixel uppercase">{item.label}</span>
              </button>
            )
          })}
        </div>

        {/* Footer Links */}
        <div className="flex flex-col gap-2 mt-auto">
          <button onClick={onOpenBossReport} className="flex items-center gap-3 px-4 py-3 rounded-xl border-3 border-on-surface bg-retro-teal text-on-surface hover:brightness-110 transition-all shadow-hard btn-press w-full text-left">
            <span className="material-symbols-outlined">assessment</span>
            <span className="font-label-pixel text-label-pixel uppercase">Boss Report</span>
          </button>
          <button onClick={onOpenChatbot} className="flex items-center gap-3 px-4 py-3 rounded-xl border-3 border-on-surface bg-primary-container text-on-surface hover:brightness-110 transition-all shadow-hard btn-press w-full text-left">
            <span className="material-symbols-outlined">smart_toy</span>
            <span className="font-label-pixel text-label-pixel uppercase">AI Support</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
