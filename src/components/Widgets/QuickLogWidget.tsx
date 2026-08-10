import React, { useState } from 'react';
import { Project, TimeLog } from '../../types';
import { soundFx } from '../../lib/soundFx';
import { Calendar, PlusCircle, History, Zap, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuickLogWidgetProps {
  project: Project;
  onSaveLog: (log: Partial<TimeLog>) => void;
}

export const QuickLogWidget: React.FC<QuickLogWidgetProps> = ({ project, onSaveLog }) => {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState('1.5');
  const [workingPoints, setWorkingPoints] = useState(10);
  // Default to today's date formatted YYYY-MM-DDTHH:mm
  const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 16));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) {
      alert('Please enter a task name for this backdated log!');
      return;
    }

    const durationMins = Math.round((parseFloat(hours) || 1) * 60);

    soundFx.playCoin();
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#00f0ff', '#ffe600', '#ff007f']
    });

    onSaveLog({
      projectId: project.id,
      taskName: taskName.trim(),
      description: description.trim() || 'Manual backdated entry.',
      durationMinutes: durationMins,
      workingPoints: Number(workingPoints) || 5,
      date: new Date(logDate).toISOString(),
      backdated: true
    });

    setTaskName('');
    setDescription('');
    setHours('1.5');
  };

  return (
    <div className="bg-[#4ECDC4] border-[4px] border-black rounded-[32px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full text-black">
      <div className="flex items-center justify-between border-b-2 border-black/20 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⌛</span>
          <h3 className="font-black text-xl text-black uppercase italic tracking-tight">
            Backdate Work Log
          </h3>
        </div>
        <span className="font-black text-xs bg-black text-white px-3 py-1 rounded-full uppercase">
          MANUAL ENTRY
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-black text-black uppercase block mb-1">
              Task / Feature Name:
            </label>
            <input
              type="text"
              placeholder="e.g. Backdated Architecture Review"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full bg-white text-black font-bold text-xs p-2.5 rounded-xl border-2 border-black focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-black text-black uppercase block mb-1">
              Project Scope Notes / Deliverables:
            </label>
            <textarea
              rows={2}
              placeholder="Detail what was accomplished for your boss..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white text-black font-bold text-xs p-2.5 rounded-xl border-2 border-black focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] font-black text-black uppercase block mb-1">
                Date & Time:
              </label>
              <input
                type="datetime-local"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="w-full bg-white text-black font-bold text-[10px] p-2 rounded-xl border-2 border-black"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-black uppercase block mb-1">
                Hours Spent:
              </label>
              <input
                type="number"
                step="0.25"
                min="0.25"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full bg-white text-black font-mono text-base p-1.5 rounded-xl border-2 border-black text-center font-black"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-black uppercase block mb-1 flex items-center justify-center gap-0.5">
                <Zap className="w-3.5 h-3.5 fill-current text-black" /> Points:
              </label>
              <input
                type="number"
                min="1"
                value={workingPoints}
                onChange={(e) => setWorkingPoints(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-white text-black font-mono text-base p-1.5 rounded-xl border-2 border-black text-center font-black"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 mt-3 bg-black hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 cursor-pointer transition-transform hover:translate-y-0.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Backdated Log</span>
        </button>
      </form>
    </div>
  );
};
