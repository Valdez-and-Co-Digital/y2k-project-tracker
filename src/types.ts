export type ProjectColor = 'pink' | 'cyan' | 'lime' | 'yellow' | 'purple' | 'orange';

export type WidgetType = 
  | 'timer' 
  | 'progress' 
  | 'quick_log' 
  | 'todos' 
  | 'notes' 
  | 'calendar' 
  | 'drive' 
  | 'report_summary'
  | 'doc_summarizer'
  | 'thinking_assistant'
  | 'gamification_badges';

export interface Project {
  id: string;
  name: string;
  description: string; // Project scope description
  color: ProjectColor;
  icon: string; // Icon identifier
  targetHours: number;
  targetPoints: number; // Working points scope
  hourlyRate: number; // Optional billing rate for boss report
  widgets: WidgetType[]; // Customizable widget layout order
  createdAt: string;
}

export interface TimeLog {
  id: string;
  projectId: string;
  taskName: string;
  description: string;
  durationMinutes: number;
  workingPoints: number;
  date: string; // YYYY-MM-DD or ISO
  backdated: boolean;
  createdAt: string;
}

export interface TodoItem {
  id: string;
  projectId: string;
  title: string;
  completed: boolean;
  deadline: string; // YYYY-MM-DD or ISO
  priority: 'low' | 'medium' | 'high';
  estimatedPoints: number;
  createdAt: string;
}

export interface NoteItem {
  id: string;
  projectId: string;
  title: string;
  content: string;
  category: 'learned' | 'meeting' | 'general' | 'bug';
  isPinned: boolean;
  driveFileName?: string;
  driveFileUrl?: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  htmlLink?: string;
  location?: string;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  iconLink?: string;
  modifiedTime?: string;
}

export interface BossReportFilter {
  projectId: string | 'all';
  startDate: string;
  endDate: string;
  includeNotes: boolean;
  includeToDos: boolean;
  includeCalculations: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  requirement: string;
}

export interface ActionItem {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  estimatedPoints: number;
  deadline: string;
}

export interface DocAnalysisResult {
  docTitle: string;
  summary: string;
  decisions: string[];
  actionItems: ActionItem[];
}
