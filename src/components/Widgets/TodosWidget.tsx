import React, { useState } from 'react';
import { Project, TodoItem } from '../../types';
import { soundFx } from '../../lib/soundFx';
import { CheckSquare, Square, Plus, Calendar, AlertTriangle, Trash2, Zap, Filter } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TodosWidgetProps {
  project: Project;
  todos: TodoItem[];
  onAddTodo: (todo: Partial<TodoItem>) => void;
  onToggleTodo: (id: string, completed: boolean) => void;
  onDeleteTodo: (id: string) => void;
}

export const TodosWidget: React.FC<TodosWidgetProps> = ({
  project,
  todos,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [estimatedPoints, setEstimatedPoints] = useState(5);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const projectTodos = todos.filter((t) => t.projectId === project.id);
  const filteredTodos = projectTodos.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    soundFx.playCoin();
    onAddTodo({
      projectId: project.id,
      title: newTitle.trim(),
      deadline,
      priority,
      estimatedPoints: Number(estimatedPoints) || 5,
      completed: false
    });

    setNewTitle('');
  };

  const handleToggle = (id: string, currentCompleted: boolean) => {
    if (!currentCompleted) {
      soundFx.playSuccess();
      confetti({
        particleCount: 35,
        spread: 40,
        origin: { y: 0.7 },
        colors: ['#00ff66', '#ffe600', '#00f0ff']
      });
    } else {
      soundFx.playClick();
    }
    onToggleTodo(id, !currentCompleted);
  };

  const getPriorityBadge = (p: 'low' | 'medium' | 'high') => {
    switch (p) {
      case 'high':
        return <span className="bg-[#FF6B6B] text-white border border-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase">HIGH 🚀</span>;
      case 'medium':
        return <span className="bg-[#FFD93D] text-black border border-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase">MED</span>;
      case 'low':
        return <span className="bg-[#4ECDC4] text-black border border-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase">LOW</span>;
    }
  };

  return (
    <div className="bg-[#00A896] border-[4px] border-black rounded-[32px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full text-black">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-black/20 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✅</span>
          <h3 className="font-black text-xl text-black uppercase italic tracking-tight">
            Deadlined To-Dos & Scope
          </h3>
        </div>
        <div className="flex items-center gap-1 bg-black text-white p-1 rounded-full border border-black text-xs font-black">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-0.5 rounded-full transition-colors ${filter === 'all' ? 'bg-[#FFD93D] text-black' : 'text-zinc-300'}`}
          >
            All ({projectTodos.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-2.5 py-0.5 rounded-full transition-colors ${filter === 'pending' ? 'bg-[#FFD93D] text-black' : 'text-zinc-300'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-2.5 py-0.5 rounded-full transition-colors ${filter === 'completed' ? 'bg-[#FFD93D] text-black' : 'text-zinc-300'}`}
          >
            Done
          </button>
        </div>
      </div>

      {/* Add Todo Form */}
      <form onSubmit={handleCreate} className="space-y-2.5 mb-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="New task title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 bg-white text-black font-bold text-xs p-2.5 rounded-xl border-2 border-black focus:outline-none"
            required
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-2.5 rounded-xl border-2 border-black font-black text-xs uppercase flex items-center gap-1 cursor-pointer hover:bg-zinc-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[10px] font-black text-black uppercase block mb-1">
              Deadline:
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-white text-black font-bold text-[10px] p-2 rounded-xl border-2 border-black"
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-black uppercase block mb-1">
              Priority:
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="w-full bg-white text-black font-bold text-[10px] p-2 rounded-xl border-2 border-black cursor-pointer"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High 🚀</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black text-black uppercase block mb-1 flex items-center justify-center gap-0.5">
              <Zap className="w-3.5 h-3.5 fill-current text-black" /> Points:
            </label>
            <input
              type="number"
              min="1"
              value={estimatedPoints}
              onChange={(e) => setEstimatedPoints(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-white text-black font-mono text-base p-1.5 rounded-xl border-2 border-black text-center font-black"
            />
          </div>
        </div>
      </form>

      {/* Todo List Items */}
      <div className="flex-1 overflow-y-auto space-y-2 max-h-[220px] pr-1">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-6 text-black/60 font-black text-xs border-2 border-dashed border-black/30 rounded-2xl bg-white/40">
            No tasks found in this view.
          </div>
        ) : (
          filteredTodos.map((todo) => {
            const isPastDue = new Date(todo.deadline) < new Date() && !todo.completed;

            return (
              <div
                key={todo.id}
                className={`p-3 rounded-2xl border-2 border-black flex items-center justify-between gap-2 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                  todo.completed
                    ? 'bg-zinc-100 opacity-60 line-through'
                    : isPastDue
                    ? 'bg-[#FF6B6B]/20 border-red-800'
                    : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggle(todo.id, todo.completed)}
                    className="mt-0.5 text-black cursor-pointer hover:scale-110 transition-transform shrink-0"
                  >
                    {todo.completed ? (
                      <CheckSquare className="w-5 h-5 fill-[#00A896] text-black" />
                    ) : (
                      <Square className="w-5 h-5 text-zinc-400" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-bold ${todo.completed ? 'text-zinc-500' : 'text-black'} truncate`}>
                      {todo.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[10px] font-bold text-zinc-600 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-black" />
                        {todo.deadline}
                      </span>
                      {getPriorityBadge(todo.priority)}
                      <span className="text-[10px] font-mono text-black bg-[#FFD93D] px-2 py-0.5 border border-black rounded-full font-black">
                        +{todo.estimatedPoints} pts
                      </span>
                      {isPastDue && (
                        <span className="text-[10px] font-black text-red-600 flex items-center gap-0.5">
                          <AlertTriangle className="w-3.5 h-3.5" /> Overdue
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundFx.playDelete();
                    onDeleteTodo(todo.id);
                  }}
                  className="text-zinc-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer shrink-0"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
