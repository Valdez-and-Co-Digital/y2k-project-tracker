import React, { useState, useEffect } from 'react';
import { DriveFile, Project } from '../../types';
import { soundFx } from '../../lib/soundFx';
import { Folder, RefreshCw, ExternalLink, FileText, Plus, FileSpreadsheet } from 'lucide-react';

interface DriveWidgetProps {
  project: Project;
  onAttachDriveDoc?: (fileName: string, fileUrl: string) => void;
}

export const DriveWidget: React.FC<DriveWidgetProps> = ({ project, onAttachDriveDoc }) => {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<string>('');

  const fetchDrive = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/google/drive');
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files || []);
        setSource(data.source || '');
      }
    } catch (err) {
      console.error('Error fetching drive files:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrive();
  }, []);

  const getFileIcon = (mime: string) => {
    if (mime.includes('spreadsheet')) {
      return <FileSpreadsheet className="w-4 h-4 text-lime-400" />;
    }
    return <FileText className="w-4 h-4 text-cyan-400" />;
  };

  return (
    <div className="bg-[#4ECDC4] border-[4px] border-black rounded-[32px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full text-black">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-black/20 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📁</span>
          <h3 className="font-black text-xl text-black uppercase italic tracking-tight">
            Google Drive Spec & Notes
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black bg-black text-white px-3 py-1 rounded-full uppercase">
            {source === 'google' ? '🟢 LIVE DRIVE' : '⚡ DEMO DRIVE'}
          </span>
          <button
            onClick={() => {
              soundFx.playClick();
              fetchDrive();
            }}
            disabled={loading}
            className="p-1.5 bg-white text-black rounded-lg border-2 border-black cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-zinc-100"
            title="Refresh Google Drive Feed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <p className="text-xs text-black font-bold mb-3">
        Relevant meeting notes, spec docs, and spreadsheet logs from Google Drive:
      </p>

      {/* Files List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[220px] pr-1">
        {files.length === 0 ? (
          <div className="text-center py-6 text-black/60 font-black text-xs border-2 border-dashed border-black/30 rounded-2xl bg-white/40">
            No Google Drive files found.
          </div>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              className="bg-white p-3.5 rounded-2xl border-2 border-black flex items-center justify-between gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {getFileIcon(file.mimeType)}
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs text-black truncate">
                    {file.name}
                  </h4>
                  <span className="text-[10px] font-bold text-zinc-500 block">
                    Modified: {new Date(file.modifiedTime || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {onAttachDriveDoc && (
                  <button
                    onClick={() => {
                      soundFx.playLevelUp();
                      onAttachDriveDoc(file.name, file.webViewLink || 'https://drive.google.com');
                    }}
                    className="bg-[#FFD93D] text-black hover:bg-yellow-300 px-2.5 py-1 rounded-lg border border-black font-black text-[10px] uppercase cursor-pointer flex items-center gap-0.5"
                    title="Attach doc to project note"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Attach</span>
                  </button>
                )}

                <a
                  href={file.webViewLink || 'https://drive.google.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 bg-black text-white hover:bg-zinc-800 rounded-lg border border-black cursor-pointer"
                  title="Open in Google Drive"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
