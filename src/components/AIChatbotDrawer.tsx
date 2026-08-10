import React, { useState, useRef, useEffect } from 'react';
import { Project, TimeLog, TodoItem } from '../types';
import { soundFx } from '../lib/soundFx';
import { Bot, Send, X, Sparkles, User, RefreshCw, MessageSquare } from 'lucide-react';

interface AIChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeProject?: Project;
  logs: TimeLog[];
  todos: TodoItem[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'pixel';
  text: string;
  timestamp: string;
}

export const AIChatbotDrawer: React.FC<AIChatbotDrawerProps> = ({
  isOpen,
  onClose,
  activeProject,
  logs,
  todos,
}) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_init',
      sender: 'pixel',
      text: `👾 Bleep bloop! Hey there! I'm Pixel, your retro workspace support guide. I know all about your active scope in "${activeProject?.name || 'Workspace'}". Ask me anything about logging backdated time, structuring your boss report, or prioritizing deadlined tasks!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const totalHours = (logs.reduce((acc, l) => acc + l.durationMinutes, 0) / 60).toFixed(1);
  const earnedPoints = logs.reduce((acc, l) => acc + l.workingPoints, 0);
  const pendingTodos = todos.filter((t) => !t.completed).length;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    soundFx.playClick();
    const userText = input.trim();
    setInput('');

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: messages.slice(-6).map((m) => ({
            sender: m.sender === 'user' ? 'User' : 'Pixel AI',
            text: m.text,
          })),
          context: {
            activeProjectName: activeProject?.name || 'All Scope',
            loggedHours: totalHours,
            earnedPoints,
            pendingTodos,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        soundFx.playLevelUp();
        setMessages((prev) => [
          ...prev,
          {
            id: `pix_${Date.now()}`,
            sender: 'pixel',
            text: data.reply || '👾 Bleep bloop! Processing your query...',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FFD93D] h-full border-l-[4px] border-black shadow-2xl flex flex-col p-6 text-black">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black/20 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-[#FFD93D] rounded-2xl border-2 border-black flex items-center justify-center font-black text-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              👾
            </div>
            <div>
              <h3 className="font-black text-xl text-black uppercase italic tracking-tight flex items-center gap-1.5">
                Pixel AI Assistant
              </h3>
              <p className="text-[10px] font-mono font-black text-black">
                CONTEXT-AWARE WORKSPACE AGENT
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-2 bg-white text-black hover:bg-zinc-100 rounded-xl border-2 border-black cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Project Context Badge */}
        <div className="bg-white border-2 border-black p-2.5 rounded-2xl mb-3 flex items-center justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs font-bold">
          <span className="truncate">📂 {activeProject?.name || 'All Projects'}</span>
          <span className="bg-[#4ECDC4] text-black px-2 py-0.5 rounded-full font-black text-[10px] uppercase border border-black shrink-0">
            {totalHours}h Logged • {pendingTodos} Pending
          </span>
        </div>

        {/* Chat History Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center gap-1 mb-1 text-[10px] font-mono font-black text-black">
                {m.sender === 'user' ? (
                  <>
                    <span>You</span> <User className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    <Bot className="w-3.5 h-3.5 text-black" /> <span>Pixel AI</span>
                  </>
                )}
                <span className="text-zinc-600 font-normal">({m.timestamp})</span>
              </div>

              <div
                className={`p-3.5 rounded-2xl border-2 border-black max-w-[88%] text-xs font-bold leading-relaxed shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                  m.sender === 'user'
                    ? 'bg-[#FF7675] text-white'
                    : 'bg-white text-black'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs font-black text-black bg-white p-3 rounded-2xl border-2 border-black w-fit animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin text-[#00A896]" />
              <span>Pixel is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Pixel about deadlines, hours, notes..."
            className="flex-1 bg-white text-black font-bold text-xs p-3 rounded-2xl border-2 border-black focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-black text-white hover:bg-zinc-800 px-4 py-3 rounded-2xl border-2 border-black font-black text-xs uppercase flex items-center gap-1 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
