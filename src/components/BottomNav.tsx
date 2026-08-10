import React from 'react';

interface BottomNavProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'logs', label: 'Logs', icon: 'history_edu' },
    { id: 'todos', label: 'Tasks', icon: 'checklist' },
    { id: 'workspace', label: 'Hub', icon: 'hub' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-surface border-t-3 border-on-surface pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChangeTab(item.id)}
            className={`flex flex-col items-center justify-center w-16 h-14 transition-colors ${
              isActive 
                ? 'bg-primary-container text-on-primary-container rounded-lg border-2 border-on-surface' 
                : 'text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">{item.icon}</span>
            <span className="text-[10px] font-bold uppercase mt-1 tracking-wider">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
