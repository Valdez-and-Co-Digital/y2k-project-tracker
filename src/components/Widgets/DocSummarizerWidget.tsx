import React, { useState } from 'react';
import { Project, TodoItem, DocAnalysisResult } from '../../types';
import { soundFx } from '../../lib/soundFx';
import { FileText, Sparkles, Plus, CheckCircle, ArrowRight, Zap, RefreshCw } from 'lucide-react';

interface DocSummarizerWidgetProps {
  project: Project;
  onAddTodo: (todo: Omit<TodoItem, 'id' | 'createdAt'>) => void;
  onAddNote: (title: string, content: string, category: 'meeting' | 'learned' | 'general' | 'bug') => void;
}

export const DocSummarizerWidget: React.FC<DocSummarizerWidgetProps> = ({
  project,
  onAddTodo,
  onAddNote,
}) => {
  const [docTitle, setDocTitle] = useState('Client_Sync_Aug2026.gdoc');
  const [docText, setDocText] = useState(
    `Client Sync & Architecture Review:
- Finalized hourly rate of $85 for CyberDash scope.
- Client requested backdated logging support for Tuesday's 3-hour architecture session.
- Decision: Add retro pixel progress bar animation and deadline tracking to main dashboard.
- Action Item: Connect Google Calendar API & Drive API by Friday (Priority: High, Points: 10).
- Action Item: Prepare printable PDF Boss Report summary for management approval (Priority: Medium, Points: 8).`
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DocAnalysisResult | null>(null);
  const [createdItems, setCreatedItems] = useState<string[]>([]);

  const handleAnalyze = async () => {
    soundFx.playClick();
    setLoading(true);
    setCreatedItems([]);

    try {
      const res = await fetch('/api/gemini/summarize-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docTitle,
          docText,
          projectName: project.name,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
        soundFx.playLevelUp();
      }
    } catch (e) {
      console.error('Doc summarize error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoCreateTodos = () => {
    if (!result || !result.actionItems) return;
    soundFx.playLevelUp();

    const createdIds: string[] = [];
    result.actionItems.forEach((act) => {
      onAddTodo({
        projectId: project.id,
        title: act.title,
        completed: false,
        deadline: act.deadline || new Date().toISOString().split('T')[0],
        priority: act.priority || 'medium',
        estimatedPoints: act.estimatedPoints || 5,
      });
      createdIds.push(act.id);
    });

    setCreatedItems(createdIds);
  };

  const handlePinNote = () => {
    if (!result) return;
    soundFx.playCoin();
    const content = `SUMMARY:\n${result.summary}\n\nDECISIONS:\n${result.decisions.map((d) => `• ${d}`).join('\n')}`;
    onAddNote(`📄 AI Summary: ${result.docTitle}`, content, 'meeting');
  };

  return (
    <div className="bg-[#FF7675] border-[4px] border-black rounded-[32px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full text-black">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-black/20 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📝</span>
          <h3 className="font-black text-xl text-black uppercase italic tracking-tight">
            Google Doc & Notes Summarizer
          </h3>
        </div>
        <span className="text-xs font-black bg-black text-white px-3 py-1 rounded-full uppercase flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#FFD93D]" /> FLASH-LITE AI
        </span>
      </div>

      <p className="text-xs text-black font-bold mb-3">
        Analyze Google Drive meeting notes, extract decisions, and auto-create deadlined to-dos:
      </p>

      {/* Form Input */}
      <div className="space-y-2 mb-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            placeholder="Document Name (e.g., Client_Sync.gdoc)"
            className="flex-1 bg-white text-black font-bold text-xs p-2.5 rounded-xl border-2 border-black focus:outline-none"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-black text-white hover:bg-zinc-800 px-4 py-2.5 rounded-xl border-2 border-black font-black text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#FFD93D]" />
            ) : (
              <Sparkles className="w-4 h-4 text-[#FFD93D]" />
            )}
            <span>{loading ? 'Analyzing...' : 'Analyze'}</span>
          </button>
        </div>

        <textarea
          value={docText}
          onChange={(e) => setDocText(e.target.value)}
          rows={3}
          placeholder="Paste meeting notes or document content here..."
          className="w-full bg-white text-black font-bold text-xs p-2.5 rounded-xl border-2 border-black focus:outline-none resize-none"
        />
      </div>

      {/* Analysis Output Result */}
      {result && (
        <div className="bg-white border-2 border-black p-4 rounded-2xl space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-1 overflow-y-auto max-h-[220px]">
          <div className="flex items-center justify-between border-b border-black/10 pb-1.5">
            <h4 className="font-black text-xs text-black uppercase flex items-center gap-1">
              <FileText className="w-4 h-4 text-black" />
              {result.docTitle}
            </h4>
            <div className="flex gap-2">
              <button
                onClick={handlePinNote}
                className="bg-[#FFD93D] text-black font-black text-[10px] uppercase px-2.5 py-1 rounded-lg border border-black cursor-pointer hover:bg-yellow-300"
              >
                + Pin Note
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs text-zinc-800 font-bold leading-relaxed bg-zinc-50 p-2 rounded-xl border border-black/10">
              {result.summary}
            </p>
          </div>

          {result.decisions && result.decisions.length > 0 && (
            <div>
              <span className="text-[10px] font-black uppercase text-black block mb-1">
                Key Decisions:
              </span>
              <ul className="space-y-1">
                {result.decisions.map((dec, i) => (
                  <li key={i} className="text-xs font-bold text-black flex items-start gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{dec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.actionItems && result.actionItems.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black uppercase text-black">
                  Identified Action Items:
                </span>
                <button
                  onClick={handleAutoCreateTodos}
                  disabled={createdItems.length > 0}
                  className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border border-black cursor-pointer flex items-center gap-1 ${
                    createdItems.length > 0
                      ? 'bg-emerald-400 text-black'
                      : 'bg-[#00A896] text-white hover:bg-teal-600'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>
                    {createdItems.length > 0 ? '✓ To-Dos Created!' : 'Auto-Add to To-Dos'}
                  </span>
                </button>
              </div>

              <div className="space-y-1.5">
                {result.actionItems.map((act) => (
                  <div
                    key={act.id}
                    className="bg-[#F1F2F6] p-2 rounded-xl border border-black/20 flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-black truncate flex-1 pr-2">
                      {act.title}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="bg-[#FFD93D] text-black font-black text-[9px] px-1.5 py-0.5 rounded border border-black">
                        +{act.estimatedPoints} pts
                      </span>
                      <span className="bg-black text-white font-black text-[9px] px-1.5 py-0.5 rounded">
                        {act.deadline}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
