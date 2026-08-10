import React, { useState } from 'react';
import { Project, ProjectColor } from '../types';
import { soundFx } from '../lib/soundFx';
import { X, Gamepad2, Zap, Target, DollarSign, Sparkles, FolderPlus } from 'lucide-react';

interface ProjectModalProps {
  projectToEdit?: Project | null;
  onSaveProject: (project: Partial<Project>) => void;
  onDeleteProject?: (id: string) => void;
  onClose: () => void;
}

const colors: { id: ProjectColor; label: string; bg: string }[] = [
  { id: 'pink', label: 'Neon Pink', bg: 'bg-pink-500' },
  { id: 'cyan', label: 'Cyber Cyan', bg: 'bg-cyan-400' },
  { id: 'lime', label: 'Pixel Lime', bg: 'bg-lime-400' },
  { id: 'yellow', label: 'Retro Yellow', bg: 'bg-yellow-300' },
  { id: 'purple', label: 'Electric Purple', bg: 'bg-purple-500' },
  { id: 'orange', label: 'Vibrant Orange', bg: 'bg-orange-400' },
];

export const ProjectModal: React.FC<ProjectModalProps> = ({
  projectToEdit,
  onSaveProject,
  onDeleteProject,
  onClose
}) => {
  const [name, setName] = useState(projectToEdit?.name || '');
  const [description, setDescription] = useState(
    projectToEdit?.description || ''
  );
  const [color, setColor] = useState<ProjectColor>(projectToEdit?.color || 'pink');
  const [targetHours, setTargetHours] = useState(projectToEdit?.targetHours || 40);
  const [targetPoints, setTargetPoints] = useState(projectToEdit?.targetPoints || 100);
  const [hourlyRate, setHourlyRate] = useState(projectToEdit?.hourlyRate || 85);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    soundFx.playSuccess();
    onSaveProject({
      id: projectToEdit?.id,
      name: name.trim(),
      description: description.trim(),
      color,
      targetHours: Number(targetHours) || 40,
      targetPoints: Number(targetPoints) || 100,
      hourlyRate: Number(hourlyRate) || 85
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#180036] border-4 border-black rounded-lg w-full max-w-lg text-slate-100 p-5 pixel-box-pop">
        <div className="flex items-center justify-between border-b-2 border-pink-500 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-6 h-6 text-yellow-300 animate-bounce" />
            <h2 className="font-pixel text-base text-yellow-300 font-bold uppercase">
              {projectToEdit ? 'Edit Project Scope' : 'Create New Project'}
            </h2>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1 bg-pink-500 text-white rounded border-2 border-black pixel-btn-press cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-pixel text-slate-300 block mb-1">
              Project Name:
            </label>
            <input
              type="text"
              placeholder="e.g. CyberDash Y2K Portal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0b001a] text-yellow-300 font-sans text-xs p-2.5 rounded border-2 border-purple-800 focus:border-pink-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-pixel text-slate-300 block mb-1">
              Project Scope Description:
            </label>
            <textarea
              rows={3}
              placeholder="Outline deliverables, client requirements, and milestones..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0b001a] text-slate-200 font-sans text-xs p-2.5 rounded border-2 border-purple-800 focus:border-pink-500 focus:outline-none resize-none"
            />
          </div>

          {/* Color Theme Selector */}
          <div>
            <label className="text-xs font-pixel text-slate-300 block mb-1.5">
              Retro Y2K Color Theme:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {colors.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setColor(c.id);
                  }}
                  className={`p-2 rounded border-2 border-black font-pixel text-[10px] text-black font-bold flex items-center justify-center gap-1 cursor-pointer transition-transform ${
                    c.bg
                  } ${color === c.id ? 'ring-4 ring-yellow-300 scale-105 shadow-[2px_2px_0px_#000]' : 'opacity-70'}`}
                >
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Scope Targets */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-pixel text-slate-300 block mb-1">
                Target Hours:
              </label>
              <input
                type="number"
                min="1"
                value={targetHours}
                onChange={(e) => setTargetHours(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-[#0b001a] text-cyan-300 font-retro-code text-lg p-1.5 rounded border border-purple-800 text-center font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] font-pixel text-slate-300 block mb-1">
                Target Points:
              </label>
              <input
                type="number"
                min="1"
                value={targetPoints}
                onChange={(e) => setTargetPoints(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-[#0b001a] text-pink-400 font-retro-code text-lg p-1.5 rounded border border-purple-800 text-center font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] font-pixel text-slate-300 block mb-1">
                Hourly Rate ($):
              </label>
              <input
                type="number"
                min="0"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-[#0b001a] text-lime-400 font-retro-code text-lg p-1.5 rounded border border-purple-800 text-center font-bold"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t-4 border-black">
            {projectToEdit && onDeleteProject && (
              <button
                type="button"
                onClick={() => {
                  onDeleteProject(projectToEdit.id);
                  onClose();
                }}
                className="px-6 py-4 bg-[#FF6B6B] hover:bg-red-500 text-black font-black text-sm uppercase rounded-xl border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all flex-1"
              >
                Delete Project
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-4 bg-zinc-200 hover:bg-zinc-300 text-black font-black text-sm uppercase rounded-xl border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-4 bg-[#CCFF00] hover:bg-[#b3e600] text-black font-black text-sm uppercase rounded-xl border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              <FolderPlus className="w-5 h-5" />
              {projectToEdit ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
