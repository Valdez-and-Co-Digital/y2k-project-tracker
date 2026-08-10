import React from 'react';

interface SideNavProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  onNewProject: () => void;
  onOpenBossReport: () => void;
  onOpenChatbot: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Widgets Dashboard', icon: 'widgets' },
  { id: 'logs', label: 'Time Logs', icon: 'schedule' },
  { id: 'todos', label: 'To-Dos & Scope', icon: 'checklist' },
  { id: 'notes', label: 'Notes & Learnings', icon: 'description' },
  { id: 'calendar', label: 'Google Sync', icon: 'sync' },
  { id: 'workspace', label: 'Workspace Hub', icon: 'hub' },
];

export const SideNav: React.FC<SideNavProps> = ({
  activeTab,
  onChangeTab,
  onNewProject,
  onOpenBossReport,
  onOpenChatbot,
  isOpen,
  onClose,
}) => {
  const handleTabClick = (id: string) => {
    onChangeTab(id);
    onClose();
  };

  const navContent = (
    <div className="flex flex-col h-full bg-surface">
      <div className="p-4 border-b-3 border-on-surface flex items-center gap-3">
        <div className="w-10 h-10 bg-primary border-2 border-on-surface flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary">robot_2</span>
        </div>
        <h1 className="font-display text-xl font-bold tracking-tight uppercase">PixelTrack 2000</h1>
      </div>
      
      <div className="p-4">
        <button
          onClick={onNewProject}
          className="w-full py-3 bg-pink-400 hover:bg-pink-500 text-black border-3 border-black font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-hard transition-transform active:translate-y-1 active:shadow-none"
        >
          <span className="material-symbols-outlined">add</span>
          New Project
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 border-2 border-transparent hover:border-on-surface transition-colors ${
              activeTab === item.id 
                ? 'bg-primary-container text-on-primary-container border-on-surface shadow-hard' 
                : 'text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-bold text-sm uppercase">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 border-t-3 border-on-surface space-y-3 bg-surface-variant">
        <button
          onClick={onOpenBossReport}
          className="w-full flex items-center gap-3 px-4 py-3 bg-retro-teal text-black border-2 border-black hover:bg-teal-400 font-bold uppercase text-sm shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px]"
        >
          <span className="material-symbols-outlined">monitoring</span>
          Boss Report
        </button>
        <button
          onClick={onOpenChatbot}
          className="w-full flex items-center gap-3 px-4 py-3 bg-primary-container text-on-primary-container border-2 border-black hover:bg-primary hover:text-on-primary font-bold uppercase text-sm shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px]"
        >
          <span className="material-symbols-outlined">smart_toy</span>
          AI Support
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col bg-surface w-72 h-screen border-r-3 border-on-surface fixed left-0 top-0 z-40 shadow-hard-lg">
        {navContent}
      </nav>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Mobile Drawer */}
      <nav 
        className={`md:hidden fixed top-0 left-0 w-72 h-screen z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r-3 border-on-surface shadow-hard-lg`}
      >
        {navContent}
      </nav>
    </>
  );
};
