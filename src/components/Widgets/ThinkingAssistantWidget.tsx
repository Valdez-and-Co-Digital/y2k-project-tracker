import React, { useState } from 'react';
import { Project, TimeLog, TodoItem } from '../../types';
import { soundFx } from '../../lib/soundFx';
import { Brain, Sparkles, Send, CheckCircle2, ChevronRight, Zap, RefreshCw } from 'lucide-react';

interface ThinkingAssistantWidgetProps {
  project: Project;
  logs: TimeLog[];
  todos: TodoItem[];
}

export const ThinkingAssistantWidget: React.FC<ThinkingAssistantWidgetProps> = ({
  project,
  logs,
  todos,
}) => {
  const [query, setQuery] = useState(
    `Analyze velocity for ${project.name}, evaluate rate of $${project.hourlyRate}/hr, and suggest high-priority task scope.`
  );
  const [enableThinking, setEnableThinking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    thinkingProcess?: string;
    finalAnswer?: string;
  } | null>(null);

  const presets = [
    `Analyze scope & velocity for ${project.name}`,
    `Draft boss progress summary with hourly rate calculations`,
    `Evaluate deadline risk for pending project tasks`,
  ];

  const handleRunAnalysis = async (customQuery?: string) => {
    soundFx.playClick();
    setLoading(true);
    const activeQuery = customQuery || query;

    try {
      const res = await fetch('/api/gemini/thinking-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: activeQuery,
          project,
          logs,
          todos,
          enableThinking,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResponse(data);
        soundFx.playLevelUp();
      }
    } catch (e) {
      console.error('Thinking Assistant Error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#6C5CE7] border-[4px] border-black rounded-[32px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-black/20 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          <h3 className="font-black text-xl text-white uppercase italic tracking-tight">
            Gemini Thinking Mode
          </h3>
        </div>

        {/* Thinking Mode Toggle */}
        <button
          onClick={() => {
            soundFx.playClick();
            setEnableThinking(!enableThinking);
          }}
          className={`px-3 py-1 rounded-full border border-black font-black text-xs uppercase flex items-center gap-1.5 transition-colors ${
            enableThinking
              ? 'bg-[#FFD93D] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              : 'bg-black text-zinc-300'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span>{enableThinking ? 'PRO THINKING ON' : 'FLASH MODE'}</span>
        </button>
      </div>

      <p className="text-xs text-white/90 font-bold mb-2">
        Give AI time to think. Solves complex project velocity, rate calculations, and boss query strategy:
      </p>

      {/* Preset Buttons */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none">
        {presets.map((p, i) => (
          <button
            key={i}
            onClick={() => {
              setQuery(p);
              handleRunAnalysis(p);
            }}
            className="text-[10px] font-black uppercase bg-black/40 hover:bg-black/60 text-white px-2.5 py-1 rounded-lg border border-white/20 shrink-0 cursor-pointer"
          >
            ⚡ {p.substring(0, 24)}...
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask complex scope or velocity questions..."
          className="flex-1 bg-white text-black font-bold text-xs p-2.5 rounded-xl border-2 border-black focus:outline-none"
        />
        <button
          onClick={() => handleRunAnalysis()}
          disabled={loading}
          className="bg-[#FFD93D] text-black hover:bg-yellow-300 px-4 py-2.5 rounded-xl border-2 border-black font-black text-xs uppercase flex items-center gap-1 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span>{loading ? 'Thinking...' : 'Analyze'}</span>
        </button>
      </div>

      {/* Output Results */}
      {response && (
        <div className="space-y-3 flex-1 overflow-y-auto max-h-[220px] text-black">
          {/* Thinking Process Breakdown */}
          {enableThinking && response.thinkingProcess && (
            <div className="bg-black text-zinc-200 border-2 border-black p-3 rounded-2xl text-xs font-mono space-y-1">
              <div className="flex items-center gap-1 text-[#FFD93D] font-black uppercase text-[10px] border-b border-zinc-800 pb-1">
                <Brain className="w-3.5 h-3.5" />
                <span>AI Reasoning & Velocity Calculation:</span>
              </div>
              <p className="whitespace-pre-wrap leading-relaxed text-[11px] opacity-90">
                {response.thinkingProcess}
              </p>
            </div>
          )}

          {/* Final Strategy Answer */}
          {response.finalAnswer && (
            <div className="bg-white border-2 border-black p-3.5 rounded-2xl text-xs font-bold leading-relaxed space-y-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-1 text-black font-black uppercase text-xs">
                <Sparkles className="w-4 h-4 text-[#FF7675]" />
                <span>Strategy Recommendation:</span>
              </div>
              <div className="whitespace-pre-wrap text-zinc-800">
                {response.finalAnswer}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
