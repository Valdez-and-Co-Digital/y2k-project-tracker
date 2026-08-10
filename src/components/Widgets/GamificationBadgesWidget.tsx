import React, { useMemo } from 'react';
import { Project, TimeLog, TodoItem, Badge } from '../../types';
import { Award, Zap, Flame, Trophy, CheckCircle, ShieldCheck, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GamificationBadgesWidgetProps {
  project: Project;
  logs: TimeLog[];
  todos: TodoItem[];
}

export const GamificationBadgesWidget: React.FC<GamificationBadgesWidgetProps> = ({
  project,
  logs,
  todos,
}) => {
  // Calculate gamification statistics
  const totalLoggedMinutes = useMemo(() => {
    return logs.reduce((acc, log) => acc + log.durationMinutes, 0);
  }, [logs]);

  const totalLoggedHours = (totalLoggedMinutes / 60).toFixed(1);

  const totalEarnedPoints = useMemo(() => {
    const logPoints = logs.reduce((acc, log) => acc + log.workingPoints, 0);
    const todoPoints = todos
      .filter((t) => t.completed)
      .reduce((acc, t) => acc + t.estimatedPoints, 0);
    return logPoints + todoPoints;
  }, [logs, todos]);

  const completedTodosCount = useMemo(() => {
    return todos.filter((t) => t.completed).length;
  }, [todos]);

  // Streak Calculation (consecutive days with activity)
  const currentStreak = useMemo(() => {
    if (logs.length === 0) return 1;
    const uniqueDates = Array.from(
      new Set(logs.map((l) => l.date.split('T')[0]))
    ).sort();
    return uniqueDates.length;
  }, [logs]);

  // Level & Progress Bar calculation
  // Each Level requires 30 points
  const level = Math.floor(totalEarnedPoints / 30) + 1;
  const currentLevelProgress = totalEarnedPoints % 30;
  const progressPercent = Math.min(100, Math.round((currentLevelProgress / 30) * 100));

  // Milestones Badges
  const badges: Badge[] = useMemo(() => {
    return [
      {
        id: 'badge_pro',
        title: 'Project Pro',
        description: 'Earn 30+ working points on a project',
        icon: '🏆',
        unlocked: totalEarnedPoints >= 30,
        requirement: `${totalEarnedPoints}/30 points`,
      },
      {
        id: 'badge_focus',
        title: 'Focus Master',
        description: 'Log 5+ hours of active time',
        icon: '⚡',
        unlocked: totalLoggedMinutes >= 300,
        requirement: `${totalLoggedHours}/5 hrs`,
      },
      {
        id: 'badge_slayer',
        title: 'Scope Slayer',
        description: 'Complete 3+ deadlined tasks',
        icon: '🎯',
        unlocked: completedTodosCount >= 3,
        requirement: `${completedTodosCount}/3 tasks`,
      },
      {
        id: 'badge_streak',
        title: 'Streak Titan',
        description: 'Maintain a multi-day streak',
        icon: '🔥',
        unlocked: currentStreak >= 2,
        requirement: `${currentStreak}/2 days`,
      },
      {
        id: 'badge_backdate',
        title: 'Time Traveler',
        description: 'Log backdated work entries',
        icon: '⏳',
        unlocked: logs.some((l) => l.backdated),
        requirement: logs.some((l) => l.backdated) ? 'Unlocked!' : 'Log 1 backdate',
      },
    ];
  }, [totalEarnedPoints, totalLoggedMinutes, totalLoggedHours, completedTodosCount, currentStreak, logs]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="bg-[#FFD93D] border-[4px] border-black rounded-[32px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full text-black">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-black/20 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎮</span>
          <h3 className="font-black text-xl text-black uppercase italic tracking-tight">
            Pixel Level & Badges
          </h3>
        </div>
        <div className="flex items-center gap-1 bg-black text-[#FFD93D] px-3 py-1 rounded-full font-black text-xs uppercase border border-black">
          <Flame className="w-4 h-4 fill-current text-orange-400" />
          <span>{currentStreak} DAY STREAK</span>
        </div>
      </div>

      {/* Retro Pixel Progress Bar Level Up Meter */}
      <div className="bg-white border-2 border-black p-4 rounded-2xl mb-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-black text-[#FFD93D] rounded-xl border-2 border-black flex items-center justify-center font-black text-lg">
              LV{level}
            </div>
            <div>
              <span className="font-black text-xs text-black uppercase block">
                {level === 1 ? '👾 Pixel Novice' : level === 2 ? '⚡ Scope Runner' : '👑 Work Master'}
              </span>
              <span className="text-[10px] font-mono font-bold text-zinc-600">
                {totalEarnedPoints} total pts earned
              </span>
            </div>
          </div>
          <button
            onClick={triggerConfetti}
            className="text-[10px] font-black uppercase bg-[#4ECDC4] text-black px-2.5 py-1 rounded-lg border border-black hover:bg-[#3dbdb5] cursor-pointer"
          >
            🎉 Celebrate
          </button>
        </div>

        {/* Animated Retro Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono font-black text-black">
            <span>LEVEL PROGRESS</span>
            <span>{currentLevelProgress} / 30 PTS ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-zinc-200 h-5 rounded-xl border-2 border-black p-0.5 relative overflow-hidden">
            <div
              className="bg-[#00A896] h-full rounded-lg transition-all duration-500 relative flex items-center justify-end pr-1"
              style={{ width: `${Math.max(8, progressPercent)}%` }}
            >
              <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Badges Grid */}
      <span className="text-xs font-black uppercase text-black block mb-2">
        Unlocked Milestone Badges ({badges.filter((b) => b.unlocked).length}/{badges.length}):
      </span>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 flex-1 overflow-y-auto max-h-[160px] pr-1">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`p-2.5 rounded-2xl border-2 border-black flex flex-col justify-between transition-all ${
              badge.unlocked
                ? 'bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-zinc-100 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{badge.icon}</span>
              {badge.unlocked ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <span className="text-[9px] font-black text-zinc-400 uppercase">
                  🔒 LCK
                </span>
              )}
            </div>

            <div className="mt-1">
              <h4 className="font-bold text-xs text-black truncate">
                {badge.title}
              </h4>
              <p className="text-[9px] text-zinc-600 font-bold line-clamp-1">
                {badge.description}
              </p>
              <span className="text-[9px] font-mono font-black text-black mt-0.5 block">
                {badge.requirement}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
