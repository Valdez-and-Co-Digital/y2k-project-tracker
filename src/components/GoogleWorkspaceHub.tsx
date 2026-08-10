import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { signInWithGoogle, logoutUser, getAccessToken } from '../lib/firebase';
import { 
  createGoogleMeetSpace, 
  listGmailMessages, 
  sendGmailMessage, 
  createAndPopulateGoogleSheet, 
  listGoogleContacts, 
  GmailMessage, 
  GoogleContact, 
  MeetSpace 
} from '../lib/googleWorkspace';
import { soundFx } from '../lib/soundFx';
import { Project, TimeLog } from '../types';
import { 
  Video, 
  Mail, 
  Table, 
  StickyNote, 
  Users, 
  Sparkles, 
  ExternalLink, 
  Send, 
  Plus, 
  RefreshCw, 
  CheckCircle, 
  Copy, 
  AlertCircle,
  FileSpreadsheet,
  LogIn,
  LogOut,
  Calendar,
  Lock
} from 'lucide-react';
import { PixelSparkle, PixelLikeBubble, PixelTamagotchi } from './PixelArtIcons';

interface GoogleWorkspaceHubProps {
  user: User | null;
  onUserChanged: (user: User | null) => void;
  projects: Project[];
  activeProject: Project | null;
  timeLogs: TimeLog[];
}

export const GoogleWorkspaceHub: React.FC<GoogleWorkspaceHubProps> = ({
  user,
  onUserChanged,
  projects,
  activeProject,
  timeLogs,
}) => {
  const [activeTab, setActiveTab] = useState<'meet' | 'gmail' | 'sheets' | 'keep' | 'contacts'>('meet');
  const [accessToken, setAccessTokenState] = useState<string | null>(getAccessToken());
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Meet state
  const [activeMeetSpace, setActiveMeetSpace] = useState<MeetSpace | null>(null);

  // Gmail state
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [gmailRecipient, setGmailRecipient] = useState('');
  const [gmailSubject, setGmailSubject] = useState('');
  const [gmailBody, setGmailBody] = useState('');
  const [showComposeModal, setShowComposeModal] = useState(false);

  // Sheets state
  const [generatedSheetUrl, setGeneratedSheetUrl] = useState<string | null>(null);

  // Contacts state
  const [contacts, setContacts] = useState<GoogleContact[]>([]);
  const [contactSearch, setContactSearch] = useState('');

  // Sync token state on mount/auth
  useEffect(() => {
    setAccessTokenState(getAccessToken());
  }, [user]);

  const handleSignIn = async () => {
    soundFx.playClick();
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await signInWithGoogle();
      if (res) {
        onUserChanged(res.user);
        setAccessTokenState(res.accessToken);
        soundFx.playLevelUp();
        setSuccessMsg('Successfully signed in with Google Workspace & Firebase Auth!');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    soundFx.playClick();
    await logoutUser();
    onUserChanged(null);
    setAccessTokenState(null);
    setActiveMeetSpace(null);
    setMessages([]);
    setContacts([]);
    setSuccessMsg('Signed out successfully.');
  };

  // Google Meet Space Generator
  const handleCreateMeet = async () => {
    soundFx.playClick();
    const token = getAccessToken();
    if (!token) {
      setErrorMsg('Please sign in with Google to create Google Meet spaces.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const space = await createGoogleMeetSpace(token);
      setActiveMeetSpace(space);
      soundFx.playLevelUp();
      setSuccessMsg(`Google Meet created! Code: ${space.meetingCode}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create Google Meet space.');
    } finally {
      setLoading(false);
    }
  };

  // Load Gmail messages
  const handleLoadGmail = async () => {
    soundFx.playClick();
    const token = getAccessToken();
    if (!token) {
      setErrorMsg('Please sign in with Google to view Gmail messages.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const msgs = await listGmailMessages(token);
      setMessages(msgs);
      soundFx.playLevelUp();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch Gmail inbox.');
    } finally {
      setLoading(false);
    }
  };

  // Send Gmail
  const handleSendGmail = async () => {
    if (!gmailRecipient || !gmailSubject || !gmailBody) {
      setErrorMsg('Please fill in recipient, subject, and message content.');
      return;
    }
    const token = getAccessToken();
    if (!token) {
      setErrorMsg('Please sign in with Google to send emails.');
      return;
    }

    // Explicit confirmation dialog as mandated by workspace-integration skill
    const confirmed = window.confirm(
      `Confirm sending email to ${gmailRecipient} with subject "${gmailSubject}"?`
    );
    if (!confirmed) return;

    setLoading(true);
    setErrorMsg(null);
    try {
      await sendGmailMessage(token, gmailRecipient, gmailSubject, gmailBody);
      soundFx.playLevelUp();
      setSuccessMsg(`Email successfully sent to ${gmailRecipient}!`);
      setShowComposeModal(false);
      setGmailRecipient('');
      setGmailSubject('');
      setGmailBody('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send email.');
    } finally {
      setLoading(false);
    }
  };

  // Export to Google Sheets
  const handleExportToSheets = async () => {
    soundFx.playClick();
    const token = getAccessToken();
    if (!token) {
      setErrorMsg('Please sign in with Google to export to Google Sheets.');
      return;
    }

    const filteredLogs = activeProject 
      ? timeLogs.filter(l => l.projectId === activeProject.id)
      : timeLogs;

    if (filteredLogs.length === 0) {
      setErrorMsg('No time logs available to export.');
      return;
    }

    const projectTitle = activeProject ? activeProject.name : 'All Projects';
    const sheetTitle = `PixelTrack 2000 - ${projectTitle} (${new Date().toLocaleDateString()})`;

    const headers = ['Log ID', 'Project', 'Date', 'Duration (Mins)', 'Hours', 'Points', 'Description'];
    const rows = filteredLogs.map(log => {
      const proj = projects.find(p => p.id === log.projectId);
      return [
        log.id,
        proj ? proj.name : 'Unknown',
        log.date,
        log.durationMinutes,
        (log.durationMinutes / 60).toFixed(2),
        log.points,
        log.description,
      ];
    });

    setLoading(true);
    setErrorMsg(null);
    try {
      const { spreadsheetUrl } = await createAndPopulateGoogleSheet(token, sheetTitle, headers, rows);
      setGeneratedSheetUrl(spreadsheetUrl);
      soundFx.playLevelUp();
      setSuccessMsg(`Successfully created Google Sheet: "${sheetTitle}"!`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to export to Google Sheets.');
    } finally {
      setLoading(false);
    }
  };

  // Load Contacts
  const handleLoadContacts = async () => {
    soundFx.playClick();
    const token = getAccessToken();
    if (!token) {
      setErrorMsg('Please sign in with Google to load Google Contacts.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const list = await listGoogleContacts(token);
      setContacts(list);
      soundFx.playLevelUp();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load Google Contacts.');
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(
    c => c.name.toLowerCase().includes(contactSearch.toLowerCase()) || c.email.toLowerCase().includes(contactSearch.toLowerCase())
  );

  return (
    <div className="bg-white border-[4px] border-black rounded-[24px] p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black relative no-print mb-8">
      {/* Firebase & Google Auth Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#F1F2F6] p-4 rounded-2xl border-[3px] border-black mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3">
          {user ? (
            <div className="w-12 h-12 rounded-2xl border-2 border-black overflow-hidden bg-[#CCFF00] flex items-center justify-center font-black text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
              ) : (
                user.displayName?.charAt(0) || user.email?.charAt(0) || '👤'
              )}
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl border-2 border-black bg-[#A29BFE] flex items-center justify-center font-black text-xl text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              🔒
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-lg md:text-xl italic uppercase tracking-tight text-black flex items-center gap-1.5">
                Google Workspace & Firebase Auth Hub
              </h2>
              {user ? (
                <span className="bg-[#CCFF00] text-black text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black rounded-full shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-black" /> Connected
                </span>
              ) : (
                <span className="bg-zinc-200 text-zinc-600 text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black rounded-full">
                  Signed Out
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-zinc-600">
              {user 
                ? `Signed in as ${user.displayName || user.email}`
                : 'Connect your Google account to enable Meet, Gmail, Sheets, Keep & Contacts sync!'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <button
              onClick={handleSignOut}
              className="bg-white hover:bg-zinc-100 text-black font-black text-xs px-4 py-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 cursor-pointer uppercase flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4 text-black" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="bg-[#CCFF00] hover:bg-lime-300 text-black font-black text-xs px-4 py-2.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 cursor-pointer uppercase flex items-center gap-2"
            >
              <LogIn className="w-4 h-4 text-black" />
              <span>Sign In with Google</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications / Alerts */}
      {errorMsg && (
        <div className="bg-red-100 border-2 border-black text-red-800 p-3 rounded-xl mb-4 font-bold text-xs flex items-center justify-between gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-black font-black text-xs px-1">✕</button>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-100 border-2 border-black text-emerald-900 p-3 rounded-xl mb-4 font-bold text-xs flex items-center justify-between gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-black font-black text-xs px-1">✕</button>
        </div>
      )}

      {/* Hub Tabs */}
      <div className="flex items-center gap-2 border-b-2 border-black pb-3 overflow-x-auto scrollbar-none mb-6">
        <button
          onClick={() => { soundFx.playClick(); setActiveTab('meet'); }}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase border-2 border-black flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'meet' ? 'bg-[#FF6B6B] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' : 'bg-[#F1F2F6] text-black hover:bg-zinc-200'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Google Meet</span>
        </button>

        <button
          onClick={() => { soundFx.playClick(); setActiveTab('gmail'); }}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase border-2 border-black flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'gmail' ? 'bg-[#4ECDC4] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' : 'bg-[#F1F2F6] text-black hover:bg-zinc-200'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Gmail</span>
        </button>

        <button
          onClick={() => { soundFx.playClick(); setActiveTab('sheets'); }}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase border-2 border-black flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'sheets' ? 'bg-[#CCFF00] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' : 'bg-[#F1F2F6] text-black hover:bg-zinc-200'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Google Sheets</span>
        </button>

        <button
          onClick={() => { soundFx.playClick(); setActiveTab('keep'); }}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase border-2 border-black flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'keep' ? 'bg-[#FFD93D] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' : 'bg-[#F1F2F6] text-black hover:bg-zinc-200'
          }`}
        >
          <StickyNote className="w-4 h-4" />
          <span>Google Keep</span>
        </button>

        <button
          onClick={() => { soundFx.playClick(); setActiveTab('contacts'); }}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase border-2 border-black flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'contacts' ? 'bg-[#A29BFE] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' : 'bg-[#F1F2F6] text-black hover:bg-zinc-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Contacts</span>
        </button>
      </div>

      {/* TAB 1: GOOGLE MEET */}
      {activeTab === 'meet' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFF0F0] p-4 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div>
              <h3 className="font-black text-base uppercase text-black flex items-center gap-2">
                <Video className="w-5 h-5 text-[#FF6B6B]" /> Instant Google Meet Generator
              </h3>
              <p className="text-xs font-bold text-zinc-600 mt-1">
                Generate official Google Meet meeting rooms for client check-ins or team standups.
              </p>
            </div>

            <button
              onClick={handleCreateMeet}
              disabled={loading || !user}
              className="bg-[#FF6B6B] hover:bg-red-500 text-white font-black text-xs px-4 py-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 cursor-pointer uppercase flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Google Meet Space</span>
            </button>
          </div>

          {activeMeetSpace ? (
            <div className="bg-[#CCFF00] border-[3px] border-black p-5 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="bg-black text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-black">
                  ACTIVE MEET ROOM
                </span>
                <h4 className="font-black text-xl italic text-black uppercase">{activeMeetSpace.meetingCode}</h4>
                <p className="text-xs font-bold text-black font-mono break-all">{activeMeetSpace.meetingUri}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(activeMeetSpace.meetingUri);
                    soundFx.playClick();
                    setSuccessMsg('Google Meet link copied to clipboard!');
                  }}
                  className="bg-white hover:bg-zinc-100 text-black font-black text-xs px-3.5 py-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </button>

                <a
                  href={activeMeetSpace.meetingUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black hover:bg-zinc-800 text-white font-black text-xs px-4 py-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5 cursor-pointer uppercase"
                >
                  <ExternalLink className="w-4 h-4 text-[#CCFF00]" />
                  <span>Launch Meet</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-[#F1F2F6] border-2 border-dashed border-black p-8 rounded-2xl text-center space-y-2">
              <PixelSparkle size={24} color="#FF6B6B" className="mx-auto animate-pulse" />
              <p className="font-black text-sm uppercase text-black">No Active Google Meet Created Yet</p>
              <p className="text-xs text-zinc-600 font-bold">
                Click "Create Google Meet Space" above to instantly launch a Google Meet room!
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: GMAIL */}
      {activeTab === 'gmail' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#E6FFFA] p-4 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div>
              <h3 className="font-black text-base uppercase text-black flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#4ECDC4]" /> Gmail Integration
              </h3>
              <p className="text-xs font-bold text-zinc-600 mt-1">
                Read project emails or send status reports & Boss Summaries directly via your Gmail account.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleLoadGmail}
                disabled={loading || !user}
                className="bg-white hover:bg-zinc-100 text-black font-black text-xs px-3.5 py-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 cursor-pointer uppercase flex items-center gap-1.5 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Fetch Inbox</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowComposeModal(true);
                  if (activeProject) {
                    setGmailSubject(`Project Status Update: ${activeProject.name}`);
                    setGmailBody(`Hello,\n\nHere is the latest progress update for ${activeProject.name}:\n- Hours Scope: ${activeProject.targetHours}h\n- Target Points: ${activeProject.targetPoints}\n\nBest regards,\nSent via PixelTrack 2000`);
                  }
                }}
                disabled={!user}
                className="bg-[#4ECDC4] hover:bg-[#3dbdb5] text-black font-black text-xs px-4 py-2.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 cursor-pointer uppercase flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Compose Email</span>
              </button>
            </div>
          </div>

          {/* Inbox Message List */}
          {messages.length > 0 ? (
            <div className="space-y-2">
              <h4 className="font-black text-xs uppercase text-zinc-600 px-1">Recent Gmail Messages ({messages.length})</h4>
              <div className="grid grid-cols-1 gap-2">
                {messages.map(msg => (
                  <div key={msg.id} className="bg-white border-2 border-black p-3 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#F1F2F6] transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-black text-xs text-black truncate max-w-[200px]">{msg.from}</span>
                      <span className="text-[10px] font-bold text-zinc-500">{msg.date}</span>
                    </div>
                    <h5 className="font-black text-sm text-black italic mt-0.5">{msg.subject}</h5>
                    <p className="text-xs text-zinc-600 line-clamp-1 mt-1 font-medium">{msg.snippet}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-[#F1F2F6] border-2 border-dashed border-black p-8 rounded-2xl text-center space-y-2">
              <Mail className="w-8 h-8 text-zinc-400 mx-auto" />
              <p className="font-black text-sm uppercase text-black">No Gmail Messages Loaded</p>
              <p className="text-xs text-zinc-600 font-bold">
                Click "Fetch Inbox" above to preview recent Gmail messages or "Compose Email" to send an update!
              </p>
            </div>
          )}

          {/* Gmail Compose Modal */}
          {showComposeModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white border-[4px] border-black rounded-[24px] p-6 max-w-lg w-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <div className="flex items-center justify-between border-b-2 border-black pb-3">
                  <h3 className="font-black text-lg uppercase italic text-black flex items-center gap-2">
                    <Send className="w-5 h-5 text-[#4ECDC4]" /> Compose Gmail Message
                  </h3>
                  <button onClick={() => setShowComposeModal(false)} className="font-black text-lg hover:text-red-500">✕</button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-black uppercase text-black mb-1">To Email:</label>
                    <input
                      type="email"
                      value={gmailRecipient}
                      onChange={e => setGmailRecipient(e.target.value)}
                      placeholder="boss@company.com"
                      className="w-full bg-[#F1F2F6] border-2 border-black rounded-xl p-2.5 font-bold text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-black mb-1">Subject:</label>
                    <input
                      type="text"
                      value={gmailSubject}
                      onChange={e => setGmailSubject(e.target.value)}
                      placeholder="Weekly Project Report"
                      className="w-full bg-[#F1F2F6] border-2 border-black rounded-xl p-2.5 font-bold text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-black mb-1">Body Text:</label>
                    <textarea
                      rows={5}
                      value={gmailBody}
                      onChange={e => setGmailBody(e.target.value)}
                      className="w-full bg-[#F1F2F6] border-2 border-black rounded-xl p-2.5 font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShowComposeModal(false)}
                    className="bg-zinc-200 hover:bg-zinc-300 text-black font-black text-xs px-4 py-2.5 rounded-xl border-2 border-black"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendGmail}
                    disabled={loading}
                    className="bg-[#4ECDC4] hover:bg-[#3dbdb5] text-black font-black text-xs px-5 py-2.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] uppercase flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send via Gmail</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: GOOGLE SHEETS */}
      {activeTab === 'sheets' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F7FFD8] p-4 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div>
              <h3 className="font-black text-base uppercase text-black flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#88D49E]" /> Google Sheets Sync & Export
              </h3>
              <p className="text-xs font-bold text-zinc-600 mt-1">
                Export project hours, task points, and log records straight to a live Google Sheet.
              </p>
            </div>

            <button
              onClick={handleExportToSheets}
              disabled={loading || !user}
              className="bg-[#CCFF00] hover:bg-lime-300 text-black font-black text-xs px-5 py-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 cursor-pointer uppercase flex items-center gap-2 shrink-0 disabled:opacity-50"
            >
              <Table className="w-4 h-4 text-black" />
              <span>Export Logs to Google Sheets</span>
            </button>
          </div>

          {generatedSheetUrl ? (
            <div className="bg-[#CCFF00] border-[3px] border-black p-5 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="bg-black text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-black">
                  SUCCESSFUL EXPORT
                </span>
                <h4 className="font-black text-lg italic text-black uppercase mt-1">Google Sheet Generated!</h4>
                <p className="text-xs font-bold text-zinc-800">Your time logs have been written to Google Sheets.</p>
              </div>

              <a
                href={generatedSheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black hover:bg-zinc-800 text-white font-black text-xs px-5 py-3 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 cursor-pointer uppercase shrink-0"
              >
                <ExternalLink className="w-4 h-4 text-[#CCFF00]" />
                <span>Open Google Sheet</span>
              </a>
            </div>
          ) : (
            <div className="bg-[#F1F2F6] border-2 border-dashed border-black p-8 rounded-2xl text-center space-y-2">
              <Table className="w-8 h-8 text-zinc-400 mx-auto" />
              <p className="font-black text-sm uppercase text-black">Export Log Records to Google Sheets</p>
              <p className="text-xs text-zinc-600 font-bold">
                Click "Export Logs to Google Sheets" to generate a live spreadsheet report!
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: GOOGLE KEEP */}
      {activeTab === 'keep' && (
        <div className="space-y-4">
          <div className="bg-[#FFFDE7] p-4 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-black text-base uppercase text-black flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-[#FFD93D]" /> Retro Keep Notes Canvas
              </h3>
              <p className="text-xs font-bold text-zinc-600 mt-1">
                Interactive Y2K sticky notes board synced with Firebase persistent cloud database.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <PixelTamagotchi size={28} />
              <span className="bg-[#FFD93D] text-black font-black text-xs px-3 py-1 rounded-full border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                Firebase Firestore
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-[#FFD93D] border-[3px] border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase bg-black text-white px-2 py-0.5 rounded-full">PINNED KEEP NOTE</span>
                <Sparkles className="w-4 h-4 text-black" />
              </div>
              <h4 className="font-black text-base italic uppercase text-black">💡 Scope Ideas & Milestones</h4>
              <p className="text-xs font-bold text-black/90">
                1. Backdate working logs for early sprint.<br />
                2. Export Boss Report to client PDF.<br />
                3. Schedule Google Meet review.
              </p>
            </div>

            <div className="bg-[#4ECDC4] border-[3px] border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase bg-black text-white px-2 py-0.5 rounded-full">PROJECT NOTE</span>
                <StickyNote className="w-4 h-4 text-black" />
              </div>
              <h4 className="font-black text-base italic uppercase text-black">📝 Meeting Summary Checklist</h4>
              <p className="text-xs font-bold text-black/90">
                Discussed new billing rate with client. Approved 45 target hours and 120 points scope.
              </p>
            </div>

            <div className="bg-[#C4B5FD] border-[3px] border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase bg-black text-white px-2 py-0.5 rounded-full">QUICK MEMO</span>
                <PixelSparkle size={14} color="#000000" />
              </div>
              <h4 className="font-black text-base italic uppercase text-black">⚡ Y2K Pixel Magic</h4>
              <p className="text-xs font-bold text-black/90">
                PixelTrack 2000 keeps all your notes organized across retro themes with instant cloud sync!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GOOGLE CONTACTS */}
      {activeTab === 'contacts' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F3E8FF] p-4 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div>
              <h3 className="font-black text-base uppercase text-black flex items-center gap-2">
                <Users className="w-5 h-5 text-[#A29BFE]" /> Google Contacts Integration
              </h3>
              <p className="text-xs font-bold text-zinc-600 mt-1">
                Access your real Google Contacts to assign clients, billing leads, or team members to projects.
              </p>
            </div>

            <button
              onClick={handleLoadContacts}
              disabled={loading || !user}
              className="bg-[#A29BFE] hover:bg-purple-400 text-black font-black text-xs px-4 py-2.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 cursor-pointer uppercase flex items-center gap-1.5 shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Load Google Contacts</span>
            </button>
          </div>

          {contacts.length > 0 && (
            <div className="space-y-3">
              <input
                type="text"
                value={contactSearch}
                onChange={e => setContactSearch(e.target.value)}
                placeholder="Search Google Contacts by name or email..."
                className="w-full bg-[#F1F2F6] border-2 border-black rounded-xl p-3 font-bold text-xs focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredContacts.map(c => (
                  <div key={c.resourceName} className="bg-white border-2 border-black p-3.5 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-full border border-black bg-[#CCFF00] overflow-hidden flex items-center justify-center font-black text-xs shrink-0">
                        {c.photoUrl ? (
                          <img src={c.photoUrl} alt={c.name} className="w-full h-full object-cover" />
                        ) : (
                          c.name.charAt(0)
                        )}
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-black text-xs text-black truncate">{c.name}</h5>
                        <p className="text-[10px] text-zinc-600 font-bold truncate">{c.email || 'No Email'}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        soundFx.playClick();
                        if (c.email) {
                          setActiveTab('gmail');
                          setShowComposeModal(true);
                          setGmailRecipient(c.email);
                        }
                      }}
                      className="p-1.5 bg-[#4ECDC4] rounded-lg border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-[#3dbdb5] shrink-0"
                      title="Send Gmail"
                    >
                      <Mail className="w-3.5 h-3.5 text-black" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {contacts.length === 0 && (
            <div className="bg-[#F1F2F6] border-2 border-dashed border-black p-8 rounded-2xl text-center space-y-2">
              <Users className="w-8 h-8 text-zinc-400 mx-auto" />
              <p className="font-black text-sm uppercase text-black">No Google Contacts Loaded</p>
              <p className="text-xs text-zinc-600 font-bold">
                Click "Load Google Contacts" above to fetch your real Google Contacts network!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
