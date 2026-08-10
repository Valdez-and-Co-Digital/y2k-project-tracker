import React from 'react';
import { Project, TimeLog } from '../../types';
import { soundFx } from '../../lib/soundFx';
import { FileText, Award, DollarSign, Clock, Zap, ExternalLink, Printer } from 'lucide-react';

interface BossReportWidgetProps {
  project: Project;
  logs: TimeLog[];
  onOpenReportModal: () => void;
}

export const BossReportWidget: React.FC<BossReportWidgetProps> = ({
  project,
  logs,
  onOpenReportModal
}) => {
  const projectLogs = logs.filter((l) => l.projectId === project.id);
  const totalMins = projectLogs.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const totalHours = Math.round((totalMins / 60) * 10) / 10;
  const totalPoints = projectLogs.reduce((acc, curr) => acc + curr.workingPoints, 0);
  const backdatedCount = projectLogs.filter((l) => l.backdated).length;
  const totalEarnings = (totalHours * (project.hourlyRate || 75)).toFixed(2);

  return (
    <div className="bg-[#1a0033] border-2 border-black rounded-lg p-4 pixel-box-pop flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center justify-between border-b-2 border-yellow-400/40 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-yellow-300" />
            <h3 className="font-pixel text-sm text-yellow-300 font-bold uppercase">
              Boss Work Summary
            </h3>
          </div>
          <span className="font-arcade text-[10px] bg-yellow-400/20 text-yellow-300 px-2 py-0.5 border border-yellow-400/40 rounded">
            📊 EXPORT READY
          </span>
        </div>

        <p className="text-xs text-slate-300 font-sans mb-3">
          Clean itemized work log summary ready to show management & clients:
        </p>

        {/* Highlight Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-[#0b001a] border border-purple-800 p-2 rounded text-center">
            <span className="text-[10px] font-pixel text-slate-400 block flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-pink-400" /> Total Hours
            </span>
            <span className="font-retro-code text-2xl text-yellow-300 font-bold">
              {totalHours} h
            </span>
          </div>

          <div className="bg-[#0b001a] border border-purple-800 p-2 rounded text-center">
            <span className="text-[10px] font-pixel text-slate-400 block flex items-center justify-center gap-1">
              <Zap className="w-3 h-3 text-yellow-400" /> Working Points
            </span>
            <span className="font-retro-code text-2xl text-pink-400 font-bold">
              {totalPoints} pts
            </span>
          </div>

          <div className="bg-[#0b001a] border border-purple-800 p-2 rounded text-center">
            <span className="text-[10px] font-pixel text-slate-400 block flex items-center justify-center gap-1">
              <DollarSign className="w-3 h-3 text-lime-400" /> Billable Value
            </span>
            <span className="font-retro-code text-2xl text-lime-400 font-bold">
              ${totalEarnings}
            </span>
          </div>

          <div className="bg-[#0b001a] border border-purple-800 p-2 rounded text-center">
            <span className="text-[10px] font-pixel text-slate-400 block">
              Backdated Entries
            </span>
            <span className="font-retro-code text-2xl text-cyan-300 font-bold">
              {backdatedCount}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          soundFx.playLevelUp();
          onOpenReportModal();
        }}
        className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-pixel text-xs font-bold rounded border-2 border-black pixel-box-pink pixel-btn-press flex items-center justify-center gap-2 cursor-pointer"
      >
        <Printer className="w-4 h-4 stroke-[2.5]" />
        <span>Generate Clean Boss Report / PDF</span>
      </button>
    </div>
  );
};
