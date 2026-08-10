import React, { useState } from 'react';
import { Project, TimeLog, TodoItem, NoteItem, WidgetType } from '../types';
import { soundFx } from '../lib/soundFx';
import { TimerWidget } from './Widgets/TimerWidget';
import { QuickLogWidget } from './Widgets/QuickLogWidget';
import { PixelProgressWidget } from './Widgets/PixelProgressWidget';
import { TodosWidget } from './Widgets/TodosWidget';
import { NotesWidget } from './Widgets/NotesWidget';
import { CalendarWidget } from './Widgets/CalendarWidget';
import { DriveWidget } from './Widgets/DriveWidget';
import { BossReportWidget } from './Widgets/BossReportWidget';
import { GamificationBadgesWidget } from './Widgets/GamificationBadgesWidget';
import { DocSummarizerWidget } from './Widgets/DocSummarizerWidget';
import { ThinkingAssistantWidget } from './Widgets/ThinkingAssistantWidget';
import { 
  GripVertical, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  SlidersHorizontal, 
  Check, 
  RotateCcw,
  LayoutGrid
} from 'lucide-react';

interface CustomizableDashboardProps {
  project: Project;
  logs: TimeLog[];
  todos: TodoItem[];
  notes: NoteItem[];
  onSaveLog: (log: Partial<TimeLog>) => void;
  onAddTodo: (todo: Partial<TodoItem>) => void;
  onToggleTodo: (id: string, completed: boolean) => void;
  onDeleteTodo: (id: string) => void;
  onAddNote: (note: Partial<NoteItem>) => void;
  onTogglePinNote: (id: string, isPinned: boolean) => void;
  onDeleteNote: (id: string) => void;
  onUpdateProjectWidgets: (projectId: string, newWidgets: WidgetType[]) => void;
  onOpenReportModal: () => void;
}

const ALL_WIDGETS: { type: WidgetType; label: string }[] = [
  { type: 'timer', label: '⏱️ Live Stopwatch Timer' },
  { type: 'progress', label: '🎮 Pixel Art Progress Meters' },
  { type: 'gamification_badges', label: '🏆 Badges, Levels & Streaks' },
  { type: 'doc_summarizer', label: '📝 Meeting Notes AI Summarizer' },
  { type: 'thinking_assistant', label: '🧠 Gemini Thinking Mode' },
  { type: 'quick_log', label: '⏳ Backdate Work Log' },
  { type: 'todos', label: '✅ Deadlined To-Dos & Scope' },
  { type: 'notes', label: '📌 Pinned Notes & Learnings' },
  { type: 'calendar', label: '📅 Google Calendar Sync' },
  { type: 'drive', label: '📁 Google Drive Spec Docs' },
  { type: 'report_summary', label: '📊 Boss Summary & Export' },
];

export const CustomizableDashboard: React.FC<CustomizableDashboardProps> = ({
  project,
  logs,
  todos,
  notes,
  onSaveLog,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onAddNote,
  onTogglePinNote,
  onDeleteNote,
  onUpdateProjectWidgets,
  onOpenReportModal
}) => {
  const [isCustomizeMode, setIsCustomizeMode] = useState(false);
  const [widgets, setWidgets] = useState<WidgetType[]>(project.widgets || ALL_WIDGETS.map(w => w.type));

  const moveWidget = (index: number, direction: 'up' | 'down') => {
    soundFx.playClick();
    const newWidgets = [...widgets];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newWidgets.length) {
      const temp = newWidgets[index];
      newWidgets[index] = newWidgets[targetIndex];
      newWidgets[targetIndex] = temp;
      setWidgets(newWidgets);
      onUpdateProjectWidgets(project.id, newWidgets);
    }
  };

  const toggleWidgetVisibility = (type: WidgetType) => {
    soundFx.playClick();
    let newWidgets: WidgetType[];
    if (widgets.includes(type)) {
      newWidgets = widgets.filter(w => w !== type);
    } else {
      newWidgets = [...widgets, type];
    }
    setWidgets(newWidgets);
    onUpdateProjectWidgets(project.id, newWidgets);
  };

  const renderWidgetContent = (type: WidgetType) => {
    switch (type) {
      case 'timer':
        return <TimerWidget project={project} onSaveLog={onSaveLog} />;
      case 'progress':
        return <PixelProgressWidget project={project} logs={logs} />;
      case 'gamification_badges':
        return <GamificationBadgesWidget project={project} logs={logs} todos={todos} />;
      case 'doc_summarizer':
        return (
          <DocSummarizerWidget
            project={project}
            onAddTodo={onAddTodo}
            onAddNote={(title, content, category) => {
              onAddNote({
                projectId: project.id,
                title,
                content,
                category,
                isPinned: true,
              });
            }}
          />
        );
      case 'thinking_assistant':
        return <ThinkingAssistantWidget project={project} logs={logs} todos={todos} />;
      case 'quick_log':
        return <QuickLogWidget project={project} onSaveLog={onSaveLog} />;
      case 'todos':
        return (
          <TodosWidget
            project={project}
            todos={todos}
            onAddTodo={onAddTodo}
            onToggleTodo={onToggleTodo}
            onDeleteTodo={onDeleteTodo}
          />
        );
      case 'notes':
        return (
          <NotesWidget
            project={project}
            notes={notes}
            onAddNote={onAddNote}
            onTogglePin={onTogglePinNote}
            onDeleteNote={onDeleteNote}
          />
        );
      case 'calendar':
        return (
          <CalendarWidget
            project={project}
            onQuickLogEvent={(summary) => {
              onSaveLog({
                projectId: project.id,
                taskName: summary,
                description: 'Logged directly from Google Calendar event.',
                durationMinutes: 60,
                workingPoints: 10,
                date: new Date().toISOString(),
                backdated: false
              });
            }}
            onConvertEventToTodo={(summary, deadline) => {
              onAddTodo({
                projectId: project.id,
                title: summary,
                deadline,
                priority: 'high',
                estimatedPoints: 10,
                completed: false
              });
            }}
          />
        );
      case 'drive':
        return (
          <DriveWidget
            project={project}
            onAttachDriveDoc={(fileName, fileUrl) => {
              onAddNote({
                projectId: project.id,
                title: `📎 Linked Doc: ${fileName}`,
                content: `Referenced Google Drive document for project scope.`,
                category: 'meeting',
                isPinned: true,
                driveFileName: fileName,
                driveFileUrl: fileUrl
              });
            }}
          />
        );
      case 'report_summary':
        return (
          <BossReportWidget
            project={project}
            logs={logs}
            onOpenReportModal={onOpenReportModal}
          />
        );
      default:
        return null;
    }
  };

  return (
      {/* Dashboard Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-6 rounded-2xl border-3 border-on-surface shadow-hard no-print relative overflow-hidden">
        <div className="absolute inset-0 bg-pixel-pattern-light opacity-50 rounded-2xl pointer-events-none"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 bg-retro-yellow border-3 border-on-surface rounded-xl flex items-center justify-center text-2xl font-black shadow-hard">
            <span className="material-symbols-outlined text-on-surface">bar_chart</span>
          </div>
          <div>
            <h2 className="font-headline-md text-headline-md font-bold uppercase text-on-surface">
              Dashboard Widgets Layout
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant font-bold">
              Reorder or customize widgets to prioritize your daily work scope.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            setIsCustomizeMode(!isCustomizeMode);
          }}
          className={`px-4 py-3 rounded-xl border-3 border-on-surface font-label-pixel text-label-pixel uppercase flex items-center gap-2 cursor-pointer shadow-hard btn-press transition-all relative z-10 ${
            isCustomizeMode
              ? 'bg-error text-on-error hover:brightness-110'
              : 'bg-retro-teal text-on-surface hover:brightness-110'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{isCustomizeMode ? 'Done Customizing' : 'Rearrange Widgets'}</span>
        </button>
      </div>

      {/* Customize Panel Controls */}
      {isCustomizeMode && (
        <div className="bg-surface p-6 rounded-2xl border-3 border-on-surface shadow-hard no-print space-y-4">
          <h3 className="font-headline-sm text-headline-sm font-bold uppercase flex items-center gap-2">
            <span className="material-symbols-outlined text-retro-teal">settings</span>
            Enable or Disable Widgets for {project.name}:
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ALL_WIDGETS.map((item) => {
              const isVisible = widgets.includes(item.type);
              return (
                <button
                  key={item.type}
                  onClick={() => toggleWidgetVisibility(item.type)}
                  className={`p-3 rounded-xl border-3 border-on-surface font-label-pixel text-label-pixel flex items-center justify-between gap-1 transition-all cursor-pointer ${
                    isVisible
                      ? 'bg-tertiary-fixed text-on-tertiary-fixed shadow-hard btn-press hover:brightness-110'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 opacity-50" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Grid Display of Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 md:gap-6">
        {widgets.map((widgetType, index) => (
          <div key={widgetType} className="relative group">
            {/* Reordering Controls in Customize Mode */}
            {isCustomizeMode && (
              <div className="absolute -top-3 right-3 z-20 bg-[#FFD93D] text-black border-2 border-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-black text-xs">
                <button
                  onClick={() => moveWidget(index, 'up')}
                  disabled={index === 0}
                  className="hover:text-red-600 disabled:opacity-30 cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5 stroke-[3]" />
                </button>
                <button
                  onClick={() => moveWidget(index, 'down')}
                  disabled={index === widgets.length - 1}
                  className="hover:text-red-600 disabled:opacity-30 cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5 stroke-[3]" />
                </button>
                <button
                  onClick={() => toggleWidgetVisibility(widgetType)}
                  className="hover:text-red-600 cursor-pointer ml-1"
                  title="Hide Widget"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {renderWidgetContent(widgetType)}
          </div>
        ))}
      </div>
    </div>
  );
};
