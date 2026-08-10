import React, { useState, useEffect } from 'react';
import { CalendarEvent, Project } from '../../types';
import { soundFx } from '../../lib/soundFx';
import { Calendar, RefreshCw, ExternalLink, Clock, Plus, CheckCircle2 } from 'lucide-react';

interface CalendarWidgetProps {
  project: Project;
  onQuickLogEvent?: (title: string) => void;
  onConvertEventToTodo?: (title: string, date: string) => void;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  project,
  onQuickLogEvent,
  onConvertEventToTodo
}) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<string>('');

  const fetchCalendar = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/google/calendar');
      if (res.ok) {
        const data = await res.json();
        setEvents(data.items || []);
        setSource(data.source || '');
      }
    } catch (err) {
      console.error('Error fetching calendar:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, []);

  return (
    <div className="bg-[#FAB1A0] border-[4px] border-black rounded-[32px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full text-black">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-black/20 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📅</span>
          <h3 className="font-black text-xl text-black uppercase italic tracking-tight">
            Google Calendar Sync
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black bg-black text-white px-3 py-1 rounded-full uppercase">
            {source === 'google' ? '🟢 LIVE GOOGLE' : '⚡ DEMO CALENDAR'}
          </span>
          <button
            onClick={() => {
              soundFx.playClick();
              fetchCalendar();
            }}
            disabled={loading}
            className="p-1.5 bg-white text-black rounded-lg border-2 border-black cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-zinc-100"
            title="Refresh Calendar Feed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <p className="text-xs text-black font-bold mb-3">
        Work events, meetings, and deadlines pulled directly into your workspace scope:
      </p>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[220px] pr-1">
        {events.length === 0 ? (
          <div className="text-center py-6 text-black/60 font-black text-xs border-2 border-dashed border-black/30 rounded-2xl bg-white/40">
            No calendar events scheduled.
          </div>
        ) : (
          events.map((evt) => {
            const eventTime = evt.start.dateTime
              ? new Date(evt.start.dateTime).toLocaleString([], {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : evt.start.date || 'All Day';

            return (
              <div
                key={evt.id}
                className="bg-white p-3.5 rounded-2xl border-2 border-black space-y-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-xs text-black">
                    {evt.summary}
                  </h4>
                  <span className="text-[10px] font-mono text-black bg-[#FFD93D] px-2 py-0.5 rounded-full border border-black font-black shrink-0">
                    {eventTime}
                  </span>
                </div>

                {evt.description && (
                  <p className="text-xs text-zinc-600 line-clamp-2 font-medium">
                    {evt.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-black/10 text-xs font-bold">
                  <span className="text-zinc-600 truncate max-w-[150px]">
                    📍 {evt.location || 'Online Meet'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {onQuickLogEvent && (
                      <button
                        onClick={() => {
                          soundFx.playCoin();
                          onQuickLogEvent(evt.summary);
                        }}
                        className="bg-[#FF6B6B] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border border-black cursor-pointer flex items-center gap-1 hover:bg-[#ff5252]"
                        title="Quick Log Time for Event"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Log Time</span>
                      </button>
                    )}

                    {onConvertEventToTodo && (
                      <button
                        onClick={() => {
                          soundFx.playLevelUp();
                          onConvertEventToTodo(
                            evt.summary,
                            evt.start.dateTime ? evt.start.dateTime.split('T')[0] : new Date().toISOString().split('T')[0]
                          );
                        }}
                        className="bg-[#4ECDC4] text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border border-black cursor-pointer flex items-center gap-1 hover:bg-[#3dbdb5]"
                        title="Add as To-Do"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ To-Do</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
