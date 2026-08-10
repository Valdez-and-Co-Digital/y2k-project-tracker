import React, { useState, useEffect } from 'react';
import { Project, TimeLog } from '../../types';
import { soundFx } from '../../lib/soundFx';
import { Play, Pause, RotateCcw, Save, Clock, Plus, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TimerWidgetProps {
  project: Project;
  onSaveLog: (log: Partial<TimeLog>) => void;
}

export const TimerWidget: React.FC<TimerWidgetProps> = ({ project, onSaveLog }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [workingPoints, setWorkingPoints] = useState(5);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((sec) => sec + 1);
        if (seconds % 60 === 0) {
          soundFx.playTick();
        }
      }, 1000);
    } else if (!isActive && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  const handleStartPause = () => {
    if (!isActive) {
      soundFx.playTimerStart();
    } else {
      soundFx.playClick();
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    soundFx.playClick();
    setIsActive(false);
    setSeconds(0);
  };

  const handleAddMinutes = (mins: number) => {
    soundFx.playCoin();
    setSeconds((sec) => sec + mins * 60);
  };

  const handleSave = () => {
    if (seconds < 10) {
      alert('Log time for at least a few seconds before saving!');
      return;
    }
    soundFx.playSuccess();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ff007f', '#00f0ff', '#ffe600', '#00ff66']
    });

    const durationMins = Math.max(1, Math.round(seconds / 60));
    onSaveLog({
      projectId: project.id,
      taskName: taskName || 'Focus Working Session',
      description: description || 'Live timer logged session.',
      durationMinutes: durationMins,
      workingPoints: Number(workingPoints) || 5,
      date: new Date().toISOString(),
      backdated: false
    });

    setSeconds(0);
    setIsActive(false);
    setTaskName('');
    setDescription('');
  };

  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#FF6B6B] border-[4px] border-black rounded-[32px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full text-black">
      <div className="flex items-center justify-between border-b-2 border-black/20 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⏱️</span>
          <h3 className="font-black text-xl text-white uppercase italic tracking-tight">
            Timer Widget
          </h3>
        </div>
        <span className="font-black text-xs bg-black text-white px-3 py-1 rounded-full uppercase tracking-wider">
          {isActive ? '⚡ RUNNING' : '⏸️ PAUSED'}
        </span>
      </div>

      {/* Digital LED Time Display */}
      <div className="bg-white border-[4px] border-black rounded-2xl p-4 mb-4 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <div className="font-mono text-4xl md:text-5xl text-black font-black tracking-widest">
          {formatTime(seconds)}
        </div>
        <div className="flex justify-center gap-2 mt-3">
          <button
            onClick={() => handleAddMinutes(15)}
            className="bg-[#FFE66D] hover:bg-yellow-300 text-black text-xs font-black px-3 py-1 rounded-lg border-2 border-black pixel-btn-press"
          >
            +15m
          </button>
          <button
            onClick={() => handleAddMinutes(30)}
            className="bg-[#FFE66D] hover:bg-yellow-300 text-black text-xs font-black px-3 py-1 rounded-lg border-2 border-black pixel-btn-press"
          >
            +30m
          </button>
          <button
            onClick={() => handleAddMinutes(60)}
            className="bg-[#FFE66D] hover:bg-yellow-300 text-black text-xs font-black px-3 py-1 rounded-lg border-2 border-black pixel-btn-press"
          >
            +1h
          </button>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-2 mb-4 flex-1">
        <div>
          <label className="text-xs font-black text-white uppercase tracking-wider block mb-1">
            Task Name:
          </label>
          <input
            type="text"
            placeholder="e.g. Refactoring asset loader sprites..."
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full bg-white text-black font-bold text-xs p-2.5 rounded-xl border-2 border-black focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs font-black text-white uppercase tracking-wider block mb-1">
              Description / Notes:
            </label>
            <input
              type="text"
              placeholder="Brief summary..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white text-black font-bold text-xs p-2.5 rounded-xl border-2 border-black focus:outline-none"
            />
          </div>
          <div className="w-24">
            <label className="text-xs font-black text-white uppercase tracking-wider block mb-1 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-current text-yellow-300" /> Pts:
            </label>
            <input
              type="number"
              min="1"
              value={workingPoints}
              onChange={(e) => setWorkingPoints(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-white text-black font-mono text-base p-2 rounded-xl border-2 border-black text-center font-black"
            />
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleStartPause}
          className={`flex-1 py-3 rounded-2xl border-[3px] border-black font-black text-sm uppercase tracking-wider pixel-btn-press flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
            isActive
              ? 'bg-[#FFD93D] text-black'
              : 'bg-[#4ECDC4] text-black'
          }`}
        >
          {isActive ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isActive ? 'Pause' : 'Start'}</span>
        </button>

        <button
          onClick={handleReset}
          className="p-3 bg-white text-black rounded-2xl border-[3px] border-black pixel-btn-press cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          title="Reset Timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={handleSave}
          className="px-5 py-3 bg-black text-white rounded-2xl border-[3px] border-black font-black text-sm uppercase tracking-wider pixel-btn-press flex items-center gap-1.5 cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-zinc-800"
        >
          <Save className="w-4 h-4" />
          <span>Save Log</span>
        </button>
      </div>
    </div>
  );
};
