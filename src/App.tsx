/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { initAuth } from './lib/firebase';
import { GoogleWorkspaceHub } from './components/GoogleWorkspaceHub';
import { Project, TimeLog, TodoItem, NoteItem, WidgetType } from './types';
import { soundFx } from './lib/soundFx';
import { RetroHeader, Y2KTheme } from './components/RetroHeader';
import { PixelGridBackground, PixelSparkle, PixelHeartWinged, PixelGameBoy, PixelTamagotchi } from './components/PixelArtIcons';
import { CustomizableDashboard } from './components/CustomizableDashboard';
import { BossReportModal } from './components/BossReportModal';
import { ProjectModal } from './components/ProjectModal';
import { AIChatbotDrawer } from './components/AIChatbotDrawer';
import { PixelProgressBar } from './components/PixelProgressBar';
import { SideNav } from './components/SideNav';
import { TopNav } from './components/TopNav';
import { BottomNav } from './components/BottomNav';
import { TodosWidget } from './components/Widgets/TodosWidget';
import { NotesWidget } from './components/Widgets/NotesWidget';
import { CalendarWidget } from './components/Widgets/CalendarWidget';
import { DriveWidget } from './components/Widgets/DriveWidget';
import { 
  Trash2, 
  Edit, 
  Plus, 
  Search
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);

  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'logs' | 'todos' | 'notes' | 'calendar' | 'workspace'>('dashboard');

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [crtEnabled, setCrtEnabled] = useState(false);
  const [theme, setTheme] = useState<Y2KTheme>('chartreuse');

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [showBossReportModal, setShowBossReportModal] = useState(false);
  const [showChatbotDrawer, setShowChatbotDrawer] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Search filter for logs table
  const [logSearch, setLogSearch] = useState('');

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [pRes, lRes, tRes, nRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/logs'),
        fetch('/api/todos'),
        fetch('/api/notes')
      ]);

      if (pRes.ok) {
        const pData = await pRes.ok ? await pRes.json() : [];
        setProjects(pData);
        if (pData.length > 0 && !activeProject) {
          setActiveProject(pData[0]);
        }
      }
      if (lRes.ok) setLogs(await lRes.json());
      if (tRes.ok) setTodos(await tRes.json());
      if (nRes.ok) setNotes(await nRes.json());
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  useEffect(() => {
    fetchData();
    const unsubscribe = initAuth((u) => {
      setUser(u);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Handlers for Project
  const handleSaveProject = async (projectData: Partial<Project>) => {
    if (projectData.id) {
      // Edit
      const res = await fetch(`/api/projects/${projectData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      if (res.ok) {
        const updated = await res.json();
        setProjects(projects.map(p => p.id === updated.id ? updated : p));
        if (activeProject?.id === updated.id) setActiveProject(updated);
      }
    } else {
      // Create
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      if (res.ok) {
        const created = await res.json();
        setProjects([...projects, created]);
        setActiveProject(created);
      }
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project and all associated logs?')) return;
    soundFx.playDelete();
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (res.ok) {
      const newProjs = projects.filter(p => p.id !== id);
      setProjects(newProjs);
      setActiveProject(newProjs[0] || null);
      fetchData();
    }
  };

  const handleUpdateWidgets = async (projectId: string, widgets: WidgetType[]) => {
    const res = await fetch(`/api/projects/${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ widgets })
    });
    if (res.ok) {
      const updated = await res.json();
      setProjects(projects.map(p => p.id === updated.id ? updated : p));
      if (activeProject?.id === updated.id) setActiveProject(updated);
    }
  };

  // Handlers for Logs
  const handleSaveLog = async (logData: Partial<TimeLog>) => {
    const res = await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData)
    });
    if (res.ok) {
      const newLog = await res.json();
      setLogs([newLog, ...logs]);
    }
  };

  const handleDeleteLog = async (id: string) => {
    soundFx.playDelete();
    const res = await fetch(`/api/logs/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setLogs(logs.filter(l => l.id !== id));
    }
  };

  // Handlers for To-Dos
  const handleAddTodo = async (todoData: Partial<TodoItem>) => {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData)
    });
    if (res.ok) {
      const newTodo = await res.json();
      setTodos([newTodo, ...todos]);
    }
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    });
    if (res.ok) {
      setTodos(todos.map(t => t.id === id ? { ...t, completed } : t));
    }
  };

  const handleDeleteTodo = async (id: string) => {
    const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setTodos(todos.filter(t => t.id !== id));
    }
  };

  // Handlers for Notes
  const handleAddNote = async (noteData: Partial<NoteItem>) => {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData)
    });
    if (res.ok) {
      const newNote = await res.json();
      setNotes([newNote, ...notes]);
    }
  };

  const handleTogglePinNote = async (id: string, isPinned: boolean) => {
    const res = await fetch(`/api/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPinned })
    });
    if (res.ok) {
      setNotes(notes.map(n => n.id === id ? { ...n, isPinned } : n));
    }
  };

  const handleDeleteNote = async (id: string) => {
    const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  // Filtered Logs for Tab
  const activeLogs = logs.filter(l => !activeProject || l.projectId === activeProject.id);
  const filteredTabLogs = activeLogs.filter(l => 
    l.taskName.toLowerCase().includes(logSearch.toLowerCase()) ||
    l.description.toLowerCase().includes(logSearch.toLowerCase())
  );

  // Dynamic theme background class
  const themeBgClass = {
    chartreuse: 'bg-[#CCFF00] text-black',
    pastel_y2k: 'bg-[#C4B5FD] text-black',
    dark_console: 'bg-[#181824] text-white',
    retro_yellow: 'bg-[#FFD93D] text-black',
  }[theme];

  return (
    <div className={`font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col md:flex-row ${crtEnabled ? 'crt-overlay' : ''}`}>
      <PixelGridBackground />

      {/* Side Nav */}
      <SideNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onNewProject={() => {
          setProjectToEdit(null);
          setShowProjectModal(true);
        }}
        onOpenBossReport={() => setShowBossReportModal(true)}
        onOpenChatbot={() => setShowChatbotDrawer(true)}
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {/* Main Body Content */}
      <main className="flex-1 ml-0 md:ml-72 min-h-screen flex flex-col relative z-10 pb-20 md:pb-0">
        <TopNav
          activeProject={activeProject}
          projects={projects}
          onSelectProject={setActiveProject}
          onToggleMobileNav={() => setMobileNavOpen(true)}
          soundEnabled={soundEnabled}
          onToggleSound={() => {
            soundFx.enabled = !soundEnabled;
            setSoundEnabled(!soundEnabled);
          }}
          crtEnabled={crtEnabled}
          onToggleCrt={() => setCrtEnabled(!crtEnabled)}
        />

        <div className="p-gutter md:p-10 flex-1 flex flex-col gap-8 max-w-7xl mx-auto w-full">

        
        {/* Project Scope Banner */}
        {activeProject && (
          <div className="bg-surface border-3 border-on-surface rounded-2xl p-4 md:p-5 shadow-hard-xl flex flex-col md:flex-row md:items-center justify-between gap-4 no-print relative overflow-hidden">
            {/* Background Pixel Sparkles */}
            <PixelSparkle size={18} color="#CCFF00" className="absolute top-2 right-4 pointer-events-none opacity-80" />
            <PixelSparkle size={14} color="#A29BFE" className="absolute bottom-2 left-4 pointer-events-none opacity-80" />

            <div className="space-y-1 relative z-10">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <PixelGameBoy size={28} />
                  <h2 className="font-black text-xl md:text-2xl text-on-surface italic uppercase tracking-tight">
                    {activeProject.name}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setProjectToEdit(activeProject);
                    setShowProjectModal(true);
                  }}
                  className="p-1.5 text-on-surface-variant hover:text-on-surface bg-surface-container-high hover:bg-secondary-container border-3 border-on-surface rounded-lg transition-colors cursor-pointer"
                  title="Edit Project Settings"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-on-surface-variant font-bold leading-relaxed">
                {activeProject.description || 'No scope description defined.'}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 relative z-10">
              <div className="hidden xl:block">
                <PixelTamagotchi size={32} />
              </div>

              <div className="bg-surface-container-high border-3 border-on-surface p-2.5 rounded-xl text-center min-w-[90px] shadow-hard">
                <span className="text-[10px] font-black uppercase text-on-surface-variant block">Rate/hr</span>
                <span className="font-mono text-base text-on-surface font-black">
                  ${activeProject.hourlyRate || 85}
                </span>
              </div>
              <div className="bg-primary-container border-3 border-on-surface p-2.5 rounded-xl text-center min-w-[90px] shadow-hard">
                <span className="text-[10px] font-black uppercase text-on-surface block">Hours Scope</span>
                <span className="font-mono text-base text-on-surface font-black">
                  {activeProject.targetHours}h
                </span>
              </div>
              <div className="bg-tertiary-fixed-dim border-3 border-on-surface p-2.5 rounded-xl text-center min-w-[90px] shadow-hard">
                <span className="text-[10px] font-black uppercase text-on-surface block">Points Scope</span>
                <span className="font-mono text-base text-on-surface font-black">
                  {activeProject.targetPoints}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: Customizable Widgets Dashboard */}
        {activeTab === 'dashboard' && activeProject && (
          <CustomizableDashboard
            project={activeProject}
            logs={logs}
            todos={todos}
            notes={notes}
            onSaveLog={handleSaveLog}
            onAddTodo={handleAddTodo}
            onToggleTodo={handleToggleTodo}
            onDeleteTodo={handleDeleteTodo}
            onAddNote={handleAddNote}
            onTogglePinNote={handleTogglePinNote}
            onDeleteNote={handleDeleteNote}
            onUpdateProjectWidgets={handleUpdateWidgets}
            onOpenReportModal={() => setShowBossReportModal(true)}
          />
        )}

        {/* Fallback if Dashboard active tab but no active project */}
        {activeTab === 'dashboard' && !activeProject && (
          <>
            {/* Header Banner */}
            <div className="bg-surface rounded-2xl border-3 border-on-surface p-8 shadow-hard-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="material-symbols-outlined text-tertiary text-2xl">sports_esports</span>
                <span className="material-symbols-outlined text-retro-pink text-2xl">favorite</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg font-black uppercase mb-2 flex items-center gap-3">
                <span className="material-symbols-outlined text-retro-yellow text-4xl">star</span>
                ALL PROJECTS Y2K PIXEL WORKSPACE
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                Select a project from the top dropdown or create a new one to unlock deadlined to-dos, backdate time logs, and custom drag & drop pixel widgets!
              </p>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map(project => {
                const totalLogs = logs.filter(l => l.projectId === project.id);
                const totalHours = totalLogs.reduce((acc, log) => acc + (log.durationMinutes / 60), 0);
                const percentage = project.targetHours > 0 ? Math.min(100, Math.round((totalHours / project.targetHours) * 100)) : 0;
                
                return (
                  <div key={project.id} className="bg-retro-yellow/20 rounded-2xl border-3 border-on-surface p-6 shadow-hard hover:-translate-y-1 transition-transform relative group">
                    <div className="absolute inset-0 bg-pixel-pattern-light opacity-50 rounded-2xl pointer-events-none"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-headline-md text-headline-md font-bold uppercase">{project.name}</h3>
                        <button 
                          onClick={() => setActiveProject(project)}
                          className="bg-retro-teal text-on-surface font-label-pixel text-label-pixel uppercase border-3 border-on-surface rounded-xl py-2 px-4 shadow-hard hover:brightness-110 flex items-center gap-2 btn-press"
                        >
                          OPEN DASHBOARD
                          <span className="material-symbols-outlined text-sm">rocket_launch</span>
                        </button>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant mb-6">{project.description}</p>
                      {/* Progress Bar */}
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between font-label-pixel text-label-pixel">
                          <span>PROGRESS</span>
                          <span>{percentage}%</span>
                        </div>
                        <div className="h-6 w-full border-3 border-on-surface rounded-full bg-surface p-1">
                          <div className="h-full bg-primary-container rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* TAB 2: Full Time Logs Management & Search */}
        {activeTab === 'logs' && (
          <div className="bg-white border-[4px] border-black rounded-[28px] p-4 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-4 border-black pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF6B6B] border-2 border-black rounded-xl flex items-center justify-center text-xl font-black">
                  ⏱️
                </div>
                <div>
                  <h2 className="font-black text-lg text-black uppercase italic">
                    Full Time & Scope Activity Logs
                  </h2>
                  <p className="text-xs text-zinc-600 font-bold">
                    Search and manage backdated entries and active working sessions.
                  </p>
                </div>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter logs..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="bg-[#F1F2F6] text-black font-bold text-xs pl-9 pr-4 py-2.5 rounded-xl border-2 border-black focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            {/* Logs Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-black text-white font-black uppercase text-[11px] tracking-wider">
                    <th className="p-3 rounded-l-xl">Date</th>
                    <th className="p-3">Project</th>
                    <th className="p-3">Task Name</th>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-center">Duration</th>
                    <th className="p-3 text-center">Points</th>
                    <th className="p-3 text-center rounded-r-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-zinc-200">
                  {filteredTabLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-zinc-500 font-bold">
                        No logs match your current search filter.
                      </td>
                    </tr>
                  ) : (
                    filteredTabLogs.map((log) => {
                      const projName = projects.find(p => p.id === log.projectId)?.name || 'General';
                      return (
                        <tr key={log.id} className="hover:bg-[#FFD93D]/20 transition-colors">
                          <td className="p-3 font-mono font-bold text-black whitespace-nowrap">
                            {log.date.split('T')[0]}
                            {log.backdated && (
                              <span className="ml-2 text-[9px] font-black bg-[#A29BFE] text-black border border-black px-1.5 py-0.5 rounded-full uppercase">
                                BACKDATED
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-black text-black text-xs uppercase">
                            {projName}
                          </td>
                          <td className="p-3 font-bold text-black">
                            {log.taskName}
                          </td>
                          <td className="p-3 text-zinc-600 font-medium max-w-xs truncate">
                            {log.description || '-'}
                          </td>
                          <td className="p-3 text-center font-mono text-black font-black text-sm">
                            {(log.durationMinutes / 60).toFixed(1)} h
                          </td>
                          <td className="p-3 text-center font-mono text-black font-black text-sm">
                            <span className="bg-[#4ECDC4] border border-black px-2 py-0.5 rounded-md">
                              +{log.workingPoints}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleDeleteLog(log.id)}
                              className="p-1.5 text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="Delete log"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Deadlined To-Dos & Scope */}
        {activeTab === 'todos' && activeProject && (
          <div className="max-w-4xl mx-auto min-h-[500px]">
            <TodosWidget
              project={activeProject}
              todos={todos}
              onAddTodo={handleAddTodo}
              onToggleTodo={handleToggleTodo}
              onDeleteTodo={handleDeleteTodo}
            />
          </div>
        )}

        {/* TAB 4: Notes & Learnings */}
        {activeTab === 'notes' && activeProject && (
          <div className="max-w-4xl mx-auto min-h-[500px]">
            <NotesWidget
              project={activeProject}
              notes={notes}
              onAddNote={handleAddNote}
              onTogglePin={handleTogglePinNote}
              onDeleteNote={handleDeleteNote}
            />
          </div>
        )}

        {/* TAB 5: Google Sync Overview */}
        {activeTab === 'calendar' && activeProject && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[500px]">
            <CalendarWidget
              project={activeProject}
              onQuickLogEvent={(summary) => {
                handleSaveLog({
                  projectId: activeProject.id,
                  taskName: summary,
                  description: 'Logged directly from Google Calendar event.',
                  durationMinutes: 60,
                  workingPoints: 10,
                  date: new Date().toISOString(),
                  backdated: false
                });
              }}
              onConvertEventToTodo={(summary, deadline) => {
                handleAddTodo({
                  projectId: activeProject.id,
                  title: summary,
                  deadline,
                  priority: 'high',
                  estimatedPoints: 10,
                  completed: false
                });
              }}
            />
            <DriveWidget
              project={activeProject}
              onAttachDriveDoc={(fileName, fileUrl) => {
                handleAddNote({
                  projectId: activeProject.id,
                  title: `📎 Linked Doc: ${fileName}`,
                  content: `Referenced Google Drive document for project scope.`,
                  category: 'meeting',
                  isPinned: true,
                  driveFileName: fileName,
                  driveFileUrl: fileUrl
                });
              }}
            />
          </div>
        )}

        {/* TAB 6: Google Workspace & Firebase Auth Hub */}
        {activeTab === 'workspace' && (
          <GoogleWorkspaceHub
            user={user}
            onUserChanged={setUser}
            projects={projects}
            activeProject={activeProject}
            timeLogs={logs}
          />
        )}
        </div>
      </main>

      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* Modals */}
      {showProjectModal && (
        <ProjectModal
          projectToEdit={projectToEdit}
          onSaveProject={handleSaveProject}
          onClose={() => setShowProjectModal(false)}
        />
      )}

      {showBossReportModal && (
        <BossReportModal
          projects={projects}
          logs={logs}
          todos={todos}
          notes={notes}
          activeProjectId={activeProject?.id || null}
          onClose={() => setShowBossReportModal(false)}
        />
      )}

      {/* Context-Aware AI Chatbot Drawer */}
      <AIChatbotDrawer
        isOpen={showChatbotDrawer}
        onClose={() => setShowChatbotDrawer(false)}
        activeProject={activeProject || undefined}
        logs={logs}
        todos={todos}
      />
    </div>
  );
}
