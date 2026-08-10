import React, { useState } from 'react';
import { Project, NoteItem } from '../../types';
import { soundFx } from '../../lib/soundFx';
import { StickyNote, Pin, Plus, Trash2, ExternalLink, FileText, Lightbulb, MessageSquare, Bug, Folder } from 'lucide-react';

interface NotesWidgetProps {
  project: Project;
  notes: NoteItem[];
  onAddNote: (note: Partial<NoteItem>) => void;
  onTogglePin: (id: string, isPinned: boolean) => void;
  onDeleteNote: (id: string) => void;
}

export const NotesWidget: React.FC<NotesWidgetProps> = ({
  project,
  notes,
  onAddNote,
  onTogglePin,
  onDeleteNote
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'learned' | 'meeting' | 'general' | 'bug'>('learned');
  const [driveFileName, setDriveFileName] = useState('');
  const [driveFileUrl, setDriveFileUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const projectNotes = notes.filter((n) => n.projectId === project.id);
  // Sort pinned notes to the top!
  const sortedNotes = [...projectNotes].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    soundFx.playCoin();
    onAddNote({
      projectId: project.id,
      title: title.trim(),
      content: content.trim(),
      category,
      isPinned: true, // Auto-pin new important notes!
      driveFileName: driveFileName.trim() || undefined,
      driveFileUrl: driveFileUrl.trim() || undefined
    });

    setTitle('');
    setContent('');
    setDriveFileName('');
    setDriveFileUrl('');
    setIsCreating(false);
  };

  const getCategoryIcon = (cat: 'learned' | 'meeting' | 'general' | 'bug') => {
    switch (cat) {
      case 'learned':
        return <Lightbulb className="w-3.5 h-3.5 text-yellow-300" />;
      case 'meeting':
        return <MessageSquare className="w-3.5 h-3.5 text-cyan-300" />;
      case 'bug':
        return <Bug className="w-3.5 h-3.5 text-pink-400" />;
      default:
        return <StickyNote className="w-3.5 h-3.5 text-lime-400" />;
    }
  };

  return (
    <div className="bg-[#A29BFE] border-[4px] border-black rounded-[32px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full text-black">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-black/20 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📌</span>
          <h3 className="font-black text-xl text-black uppercase italic tracking-tight">
            Notes & Learnings
          </h3>
        </div>
        <button
          onClick={() => {
            soundFx.playClick();
            setIsCreating(!isCreating);
          }}
          className="bg-black text-white text-xs font-black px-3.5 py-1.5 rounded-full border border-black flex items-center gap-1 cursor-pointer uppercase hover:bg-zinc-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>{isCreating ? 'Cancel' : 'New Note'}</span>
        </button>
      </div>

      {/* Note Creation Form Modal / Panel */}
      {isCreating && (
        <form onSubmit={handleSubmit} className="bg-white border-2 border-black p-4 rounded-2xl mb-3 space-y-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div>
            <label className="text-[10px] font-black text-black uppercase block mb-1">
              Note Title / Learning Header:
            </label>
            <input
              type="text"
              placeholder="e.g. 🔥 Key Insight: Recharts + Retro Styles"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#F1F2F6] text-black font-bold text-xs p-2 rounded-xl border-2 border-black focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-black uppercase block mb-1">
              Note Content:
            </label>
            <textarea
              rows={2}
              placeholder="Record architectural insights, meeting takeaways, or bugs..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#F1F2F6] text-black font-bold text-xs p-2 rounded-xl border-2 border-black focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-black text-black uppercase block mb-1">
                Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#F1F2F6] text-black font-bold text-[10px] p-2 rounded-xl border-2 border-black cursor-pointer"
              >
                <option value="learned">💡 Learned Insight</option>
                <option value="meeting">📝 Meeting Notes</option>
                <option value="general">📌 General Note</option>
                <option value="bug">🐛 Bug / Tech Debt</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black text-black uppercase block mb-1">
                Linked Google Doc Name:
              </label>
              <input
                type="text"
                placeholder="e.g. Architecture_Spec.docx"
                value={driveFileName}
                onChange={(e) => setDriveFileName(e.target.value)}
                className="w-full bg-[#F1F2F6] text-black font-bold text-[10px] p-2 rounded-xl border-2 border-black"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-black text-white font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black cursor-pointer hover:bg-zinc-800"
          >
            Save & Pin Note
          </button>
        </form>
      )}

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[220px] pr-1">
        {sortedNotes.length === 0 ? (
          <div className="text-center py-6 text-black/60 font-black text-xs border-2 border-dashed border-black/30 rounded-2xl bg-white/40">
            No notes created yet for this project.
          </div>
        ) : (
          sortedNotes.map((note) => (
            <div
              key={note.id}
              className={`p-3 rounded-2xl border-2 border-black relative transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                note.isPinned
                  ? 'bg-[#FFD93D]'
                  : 'bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  {getCategoryIcon(note.category)}
                  <h4 className="font-bold text-xs text-black truncate">
                    {note.title}
                  </h4>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      soundFx.playLevelUp();
                      onTogglePin(note.id, !note.isPinned);
                    }}
                    className={`p-1 rounded-lg cursor-pointer ${
                      note.isPinned ? 'text-black bg-black/10' : 'text-zinc-400 hover:text-black'
                    }`}
                    title={note.isPinned ? 'Unpin Note' : 'Pin Note to Top'}
                  >
                    <Pin className={`w-4 h-4 ${note.isPinned ? 'fill-black rotate-45' : ''}`} />
                  </button>

                  <button
                    onClick={() => {
                      soundFx.playDelete();
                      onDeleteNote(note.id);
                    }}
                    className="p-1 text-zinc-400 hover:text-red-600 rounded-lg cursor-pointer"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {note.content && (
                <p className="text-xs text-black mt-1 font-bold whitespace-pre-wrap leading-relaxed bg-black/5 p-2 rounded-xl border border-black/10">
                  {note.content}
                </p>
              )}

              {note.driveFileName && (
                <div className="mt-2 pt-1 border-t border-black/20 flex items-center justify-between text-[10px] text-black font-black">
                  <span className="flex items-center gap-1 truncate">
                    <FileText className="w-3.5 h-3.5 text-black" />
                    {note.driveFileName}
                  </span>
                  <a
                    href={note.driveFileUrl || 'https://drive.google.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline flex items-center gap-0.5 text-black font-black"
                  >
                    <span>View Doc</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
