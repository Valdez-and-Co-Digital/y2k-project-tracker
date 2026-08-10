import React from 'react';
import { Project, TimeLog } from '../../types';
import { PixelProgressBar } from '../PixelProgressBar';
import { Sparkles, Trophy, Target, Award } from 'lucide-react';

interface PixelProgressWidgetProps {
  project: Project;
  logs: TimeLog[];
}

export const PixelProgressWidget: React.FC<PixelProgressWidgetProps> = ({ project, logs }) => {
  const projectLogs = logs.filter((l) => l.projectId === project.id);
  
  const totalMinutes = projectLogs.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
  
  const totalEarnedPoints = projectLogs.reduce((acc, curr) => acc + curr.workingPoints, 0);

  return (
    <div className="bg-[#FFD93D] border-[4px] border-black rounded-[32px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full justify-between text-black">
      <div className="flex items-center justify-between border-b-2 border-black/20 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          <h3 className="font-black text-xl text-black uppercase italic tracking-tight">
            Pixel Scope Progress
          </h3>
        </div>
        <div className="flex items-center gap-1 text-xs font-black bg-black text-white px-3 py-1 rounded-full uppercase">
          <Target className="w-3.5 h-3.5 text-[#FF6B6B]" />
          <span>SCOPE METRICS</span>
        </div>
      </div>

      <div className="space-y-4 my-2">
        {/* Hours Meter */}
        <PixelProgressBar
          label="Target Work Hours"
          currentValue={totalHours}
          targetValue={project.targetHours}
          unit="hrs"
          color="cyan"
          showAvatar={true}
        />

        {/* Working Points Meter */}
        <PixelProgressBar
          label="Working Points Scope"
          currentValue={totalEarnedPoints}
          targetValue={project.targetPoints}
          unit="pts"
          color="pink"
          showAvatar={true}
        />
      </div>

      {/* Scope Stats Bar */}
      <div className="mt-4 bg-white border-[3px] border-black p-3.5 rounded-2xl grid grid-cols-3 gap-2 text-center text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div>
          <span className="text-[10px] font-black text-zinc-500 uppercase block">Total Logs</span>
          <span className="font-mono text-xl text-black font-black">{projectLogs.length}</span>
        </div>
        <div>
          <span className="text-[10px] font-black text-zinc-500 uppercase block">Est. Billable</span>
          <span className="font-mono text-xl text-[#00A896] font-black">
            ${(totalHours * (project.hourlyRate || 75)).toFixed(0)}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-black text-zinc-500 uppercase block">Avg Pts/Log</span>
          <span className="font-mono text-xl text-[#FF6B6B] font-black">
            {projectLogs.length > 0 ? (totalEarnedPoints / projectLogs.length).toFixed(1) : '0'}
          </span>
        </div>
      </div>
    </div>
  );
};
