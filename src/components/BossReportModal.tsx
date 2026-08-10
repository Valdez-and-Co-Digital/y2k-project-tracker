import React, { useState } from 'react';
import { Project, TimeLog, TodoItem, NoteItem, BossReportFilter } from '../types';
import { soundFx } from '../lib/soundFx';
import { X, Printer, Download, FileText, CheckCircle, Calendar, Zap, DollarSign, Clock, Sparkles } from 'lucide-react';

interface BossReportModalProps {
  projects: Project[];
  logs: TimeLog[];
  todos: TodoItem[];
  notes: NoteItem[];
  activeProjectId: string | null;
  onClose: () => void;
}

export const BossReportModal: React.FC<BossReportModalProps> = ({
  projects,
  logs,
  todos,
  notes,
  activeProjectId,
  onClose
}) => {
  const [filter, setFilter] = useState<BossReportFilter>({
    projectId: activeProjectId || 'all',
    startDate: new Date(Date.now() - 86400000 * 30).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    includeNotes: true,
    includeToDos: true,
    includeCalculations: true
  });

  const [bossNote, setBossNote] = useState(
    'Executive Summary: Accomplished key project deliverables, implemented user requested feature scope, and logged backdated hours.'
  );

  // Filter logs by project & date range
  const filteredLogs = logs.filter((l) => {
    if (filter.projectId !== 'all' && l.projectId !== filter.projectId) return false;
    const logDate = l.date.split('T')[0];
    return logDate >= filter.startDate && logDate <= filter.endDate;
  });

  // Filter notes & todos
  const filteredNotes = notes.filter((n) => {
    if (filter.projectId !== 'all' && n.projectId !== filter.projectId) return false;
    return true;
  });

  const filteredTodos = todos.filter((t) => {
    if (filter.projectId !== 'all' && t.projectId !== filter.projectId) return false;
    return true;
  });

  const totalMinutes = filteredLogs.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
  const totalPoints = filteredLogs.reduce((acc, curr) => acc + curr.workingPoints, 0);

  // Calculate billables
  const totalBillable = filteredLogs.reduce((acc, curr) => {
    const proj = projects.find((p) => p.id === curr.projectId);
    const rate = proj?.hourlyRate || 75;
    return acc + (curr.durationMinutes / 60) * rate;
  }, 0);

  const handlePrint = () => {
    soundFx.playSuccess();
    window.print();
  };

  const handleDownloadCSV = () => {
    soundFx.playCoin();
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Date,Project,Task Name,Description,Duration,Working Points,Backdated\n';

    filteredLogs.forEach((l) => {
      const projName = projects.find((p) => p.id === l.projectId)?.name || 'General';
      const cleanTask = `"${l.taskName.replace(/"/g, '""')}"`;
      const cleanDesc = `"${l.description.replace(/"/g, '""')}"`;
      
      let durationFormat = `${l.durationMinutes} Mins`;
      if (l.durationMinutes >= 30) {
        durationFormat = `${Number((l.durationMinutes / 60).toFixed(2))} Hrs`;
      }

      csvContent += `${l.date.split('T')[0]},${projName},${cleanTask},${cleanDesc},${durationFormat},${l.workingPoints},${l.backdated ? 'Yes' : 'No'}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Boss_Work_Report_${filter.startDate}_to_${filter.endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-[#180036] border-4 border-black rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto text-slate-100 p-4 md:p-6 pixel-box-pop print-container">
        
        {/* Modal Top Bar (Hidden on Print) */}
        <div className="flex items-center justify-between border-b-2 border-yellow-400 pb-3 mb-4 no-print">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center text-black font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-pixel text-lg text-yellow-300 font-bold">
                Boss Work Log & Scope Export Report
              </h2>
              <p className="text-xs text-slate-300 font-sans">
                Clean, professional summary formatted for manager review and invoicing.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 bg-pink-500 hover:bg-pink-400 text-white rounded border-2 border-black pixel-btn-press cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls (Hidden on Print) */}
        <div className="bg-[#0c001f] p-3 rounded-lg border-2 border-purple-800 mb-6 space-y-3 no-print">
          <span className="font-pixel text-xs text-pink-400 font-bold uppercase block">
            ⚙️ Report Export Filters:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-pixel text-slate-300 block mb-1">Select Project:</label>
              <select
                value={filter.projectId}
                onChange={(e) => setFilter({ ...filter, projectId: e.target.value })}
                className="w-full bg-[#160036] text-yellow-300 font-pixel text-xs p-2 rounded border border-purple-800 cursor-pointer"
              >
                <option value="all">🌟 All Active Projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    📁 {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-pixel text-slate-300 block mb-1">Start Date:</label>
              <input
                type="date"
                value={filter.startDate}
                onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
                className="w-full bg-[#160036] text-cyan-300 font-sans p-1.5 rounded border border-purple-800"
              />
            </div>

            <div>
              <label className="font-pixel text-slate-300 block mb-1">End Date:</label>
              <input
                type="date"
                value={filter.endDate}
                onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
                className="w-full bg-[#160036] text-cyan-300 font-sans p-1.5 rounded border border-purple-800"
              />
            </div>
          </div>

          <div>
            <label className="font-pixel text-slate-300 block mb-1">Executive Summary Note for Boss:</label>
            <input
              type="text"
              value={bossNote}
              onChange={(e) => setBossNote(e.target.value)}
              className="w-full bg-[#160036] text-slate-200 font-sans text-xs p-2 rounded border border-purple-800 focus:border-yellow-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-purple-900">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-pixel text-xs px-4 py-2 rounded border-2 border-black pixel-box-pop pixel-btn-press flex items-center gap-2 cursor-pointer font-bold"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>

              <button
                onClick={handleDownloadCSV}
                className="bg-cyan-400 hover:bg-cyan-300 text-black font-pixel text-xs px-4 py-2 rounded border-2 border-black pixel-box-pop pixel-btn-press flex items-center gap-2 cursor-pointer font-bold"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>

            <span className="text-[11px] font-pixel text-slate-400 hidden sm:inline">
              Showing {filteredLogs.length} logged entries
            </span>
          </div>
        </div>

        {/* PRINTABLE DOCUMENT BODY */}
        <div className="bg-white text-slate-900 p-6 md:p-8 rounded-lg shadow-xl print-container border-2 border-slate-300 font-sans">
          
          {/* Document Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold font-sans text-slate-900 tracking-tight">
                WORK ACTIVITY & SCOPE SUMMARY REPORT
              </h1>
              <p className="text-sm text-slate-600 font-medium mt-1">
                Prepared for Executive / Management Review
              </p>
              <div className="mt-2 text-xs text-slate-500 flex items-center gap-3 font-mono">
                <span>Period: {filter.startDate} to {filter.endDate}</span>
                <span>•</span>
                <span>Generated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block bg-slate-900 text-white font-mono text-xs px-3 py-1 font-bold rounded">
                PIXELTRACK REPORT
              </span>
            </div>
          </div>

          {/* Executive Note */}
          {bossNote && (
            <div className="bg-slate-100 border-l-4 border-slate-900 p-3 mb-6 text-xs text-slate-800 rounded-r">
              <span className="font-bold block text-slate-900 mb-0.5 uppercase tracking-wide">
                Executive Note:
              </span>
              <p className="italic">{bossNote}</p>
            </div>
          )}

          {/* Key Metrics Table */}
          <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 text-center">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block">
                Total Hours Worked
              </span>
              <span className="text-2xl font-bold font-mono text-slate-900">
                {totalHours} h
              </span>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block">
                Working Points Completed
              </span>
              <span className="text-2xl font-bold font-mono text-slate-900">
                {totalPoints} pts
              </span>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block">
                Total Billable
              </span>
              <span className="text-2xl font-bold font-mono text-slate-900">
                ${totalBillable.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Detailed Time Logs Itemized List */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1 mb-3">
              Itemized Time & Scope Activity Logs
            </h3>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-200 text-slate-800 font-bold uppercase text-[10px]">
                  <th className="p-2 border border-slate-300">Date</th>
                  <th className="p-2 border border-slate-300">Task Name</th>
                  <th className="p-2 border border-slate-300">Description / Deliverables</th>
                  <th className="p-2 border border-slate-300 text-center">Duration</th>
                  <th className="p-2 border border-slate-300 text-center">Points</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-500">
                      No logged work items for this filter range.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 border-b border-slate-200">
                      <td className="p-2 border border-slate-300 font-mono text-[11px] whitespace-nowrap">
                        {log.date.split('T')[0]}
                        {log.backdated && (
                          <span className="ml-1 text-[9px] bg-amber-100 text-amber-800 px-1 py-0.5 rounded font-sans font-bold">
                            BACKDATED
                          </span>
                        )}
                      </td>
                      <td className="p-2 border border-slate-300 font-semibold text-slate-900">
                        {log.taskName}
                      </td>
                      <td className="p-2 border border-slate-300 text-slate-700">
                        {log.description || 'General development & review'}
                      </td>
                      <td className="p-2 border border-slate-300 text-center font-mono font-bold">
                        {(log.durationMinutes / 60).toFixed(1)} h
                      </td>
                      <td className="p-2 border border-slate-300 text-center font-mono text-slate-900">
                        +{log.workingPoints}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Key Learnings & Pinned Notes Section */}
          {filter.includeNotes && filteredNotes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1 mb-2">
                Key Accomplishments, Insights & Linked Drive Docs
              </h3>
              <div className="space-y-2">
                {filteredNotes.map((n) => (
                  <div key={n.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>• {n.title}</span>
                      {n.driveFileName && (
                        <span className="text-[10px] text-slate-600 font-mono">
                          Linked: {n.driveFileName}
                        </span>
                      )}
                    </div>
                    {n.content && <p className="text-slate-700 mt-1 pl-3">{n.content}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Document Footer Sign-off */}
          <div className="mt-8 pt-4 border-t-2 border-slate-900 flex justify-between text-xs text-slate-500 font-mono">
            <div>
              <span>Submitted By: Employee Work Tracker</span>
            </div>
            <div>
              <span>Approval Sign-off: _______________________</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
