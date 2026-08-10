import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { Project, TimeLog, TodoItem, NoteItem, CalendarEvent, DriveFile } from "./src/types";

const app = express();
const PORT = 3000;

app.use(express.json());

// Gemini AI Client Helper
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      genAIClient = new GoogleGenAI({ apiKey });
    }
  }
  return genAIClient;
}

// Path to data file
const DATA_FILE = path.join(process.cwd(), "data_store.json");

interface DataStore {
  projects: Project[];
  timeLogs: TimeLog[];
  todos: TodoItem[];
  notes: NoteItem[];
}

// Initial default data if none exists
const defaultData: DataStore = {
  projects: [
    {
      id: "proj_cyber_dash",
      name: "CyberDash Y2K Portal",
      description: "Redesigning main web portal with animated retro themes, pixel progress meters, and boss reporting.",
      color: "pink",
      icon: "zap",
      targetHours: 40,
      targetPoints: 120,
      hourlyRate: 85,
      widgets: ["progress", "timer", "gamification_badges", "doc_summarizer", "thinking_assistant", "quick_log", "todos", "notes", "calendar", "drive", "report_summary"],
      createdAt: new Date().toISOString()
    },
    {
      id: "proj_mobile_app",
      name: "Pixel Pocket App",
      description: "Mobile companion app for field time logging and quick meeting notes.",
      color: "cyan",
      icon: "gamepad",
      targetHours: 25,
      targetPoints: 80,
      hourlyRate: 90,
      widgets: ["progress", "timer", "gamification_badges", "doc_summarizer", "thinking_assistant", "todos", "quick_log", "notes", "calendar", "drive", "report_summary"],
      createdAt: new Date().toISOString()
    }
  ],
  timeLogs: [
    {
      id: "log_1",
      projectId: "proj_cyber_dash",
      taskName: "Sprint Planning & Scope Definition",
      description: "Drafted project milestone deliverables, defined working points, and created boss report structure.",
      durationMinutes: 180,
      workingPoints: 15,
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      backdated: true,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: "log_2",
      projectId: "proj_cyber_dash",
      taskName: "Y2K Widget Layout Engine",
      description: "Implemented drag and drop widget re-ordering, responsive grid cards, and retro CRT scanlines.",
      durationMinutes: 240,
      workingPoints: 25,
      date: new Date(Date.now() - 86400000).toISOString(),
      backdated: false,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: "log_3",
      projectId: "proj_mobile_app",
      taskName: "Pixel Art Progress Bar Sprites",
      description: "Rendered custom 8-bit character walking animations and progress percentage meters.",
      durationMinutes: 120,
      workingPoints: 12,
      date: new Date().toISOString(),
      backdated: false,
      createdAt: new Date().toISOString()
    }
  ],
  todos: [
    {
      id: "todo_1",
      projectId: "proj_cyber_dash",
      title: "Connect Google Calendar API & Google Drive API",
      completed: false,
      deadline: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      priority: "high",
      estimatedPoints: 10,
      createdAt: new Date().toISOString()
    },
    {
      id: "todo_2",
      projectId: "proj_cyber_dash",
      title: "Export weekly time summary to PDF / Boss report",
      completed: true,
      deadline: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      priority: "medium",
      estimatedPoints: 8,
      createdAt: new Date().toISOString()
    },
    {
      id: "todo_3",
      projectId: "proj_mobile_app",
      title: "Test responsive touch drag-and-drop on iOS/Android viewports",
      completed: false,
      deadline: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
      priority: "medium",
      estimatedPoints: 6,
      createdAt: new Date().toISOString()
    }
  ],
  notes: [
    {
      id: "note_1",
      projectId: "proj_cyber_dash",
      title: "🔥 Key Learnings: Web Audio Synthesizer in React",
      content: "Use square/triangle oscillators for authentic 2000s 8-bit bleeps. Remember to resume AudioContext on user interaction to pass browser autoplay policies!",
      category: "learned",
      isPinned: true,
      driveFileName: "Y2K_Audio_Synth_Specs.docx",
      driveFileUrl: "https://drive.google.com",
      createdAt: new Date().toISOString()
    },
    {
      id: "note_2",
      projectId: "proj_cyber_dash",
      title: "📝 Client Sync Meeting Notes (Aug 8)",
      content: "Boss wants backdated time entry for last Tuesday's 3-hour architecture review. Ensure hourly rate $85 is calculated on the printable export document.",
      category: "meeting",
      isPinned: true,
      driveFileName: "Client_Sync_Aug8_Notes.gdoc",
      driveFileUrl: "https://drive.google.com",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ]
};

function readStore(): DataStore {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading data store:", err);
  }
  return defaultData;
}

function writeStore(data: DataStore) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing data store:", err);
  }
}

// REST API Endpoints

// Projects
app.get("/api/projects", (req, res) => {
  const store = readStore();
  res.json(store.projects);
});

app.post("/api/projects", (req, res) => {
  const store = readStore();
  const newProject: Project = {
    id: `proj_${Date.now()}`,
    name: req.body.name || "New Retro Project",
    description: req.body.description || "Project scope description...",
    color: req.body.color || "pink",
    icon: req.body.icon || "zap",
    targetHours: Number(req.body.targetHours) || 20,
    targetPoints: Number(req.body.targetPoints) || 50,
    hourlyRate: Number(req.body.hourlyRate) || 75,
    widgets: ["timer", "progress", "quick_log", "todos", "notes", "calendar", "drive", "report_summary"],
    createdAt: new Date().toISOString()
  };
  store.projects.push(newProject);
  writeStore(store);
  res.json(newProject);
});

app.put("/api/projects/:id", (req, res) => {
  const store = readStore();
  const idx = store.projects.findIndex(p => p.id === req.params.id);
  if (idx !== -1) {
    store.projects[idx] = { ...store.projects[idx], ...req.body };
    writeStore(store);
    res.json(store.projects[idx]);
  } else {
    res.status(404).json({ error: "Project not found" });
  }
});

app.delete("/api/projects/:id", (req, res) => {
  const store = readStore();
  store.projects = store.projects.filter(p => p.id !== req.params.id);
  store.timeLogs = store.timeLogs.filter(l => l.projectId !== req.params.id);
  store.todos = store.todos.filter(t => t.projectId !== req.params.id);
  store.notes = store.notes.filter(n => n.projectId !== req.params.id);
  writeStore(store);
  res.json({ success: true });
});

// Time Logs
app.get("/api/logs", (req, res) => {
  const store = readStore();
  res.json(store.timeLogs);
});

app.post("/api/logs", (req, res) => {
  const store = readStore();
  const newLog: TimeLog = {
    id: `log_${Date.now()}`,
    projectId: req.body.projectId,
    taskName: req.body.taskName || "General Development",
    description: req.body.description || "",
    durationMinutes: Number(req.body.durationMinutes) || 30,
    workingPoints: Number(req.body.workingPoints) || 5,
    date: req.body.date || new Date().toISOString(),
    backdated: Boolean(req.body.backdated),
    createdAt: new Date().toISOString()
  };
  store.timeLogs.unshift(newLog);
  writeStore(store);
  res.json(newLog);
});

app.delete("/api/logs/:id", (req, res) => {
  const store = readStore();
  store.timeLogs = store.timeLogs.filter(l => l.id !== req.params.id);
  writeStore(store);
  res.json({ success: true });
});

// To-Dos
app.get("/api/todos", (req, res) => {
  const store = readStore();
  res.json(store.todos);
});

app.post("/api/todos", (req, res) => {
  const store = readStore();
  const newTodo: TodoItem = {
    id: `todo_${Date.now()}`,
    projectId: req.body.projectId,
    title: req.body.title || "New Task",
    completed: false,
    deadline: req.body.deadline || new Date().toISOString().split('T')[0],
    priority: req.body.priority || "medium",
    estimatedPoints: Number(req.body.estimatedPoints) || 5,
    createdAt: new Date().toISOString()
  };
  store.todos.unshift(newTodo);
  writeStore(store);
  res.json(newTodo);
});

app.put("/api/todos/:id", (req, res) => {
  const store = readStore();
  const idx = store.todos.findIndex(t => t.id === req.params.id);
  if (idx !== -1) {
    store.todos[idx] = { ...store.todos[idx], ...req.body };
    writeStore(store);
    res.json(store.todos[idx]);
  } else {
    res.status(404).json({ error: "Todo not found" });
  }
});

app.delete("/api/todos/:id", (req, res) => {
  const store = readStore();
  store.todos = store.todos.filter(t => t.id !== req.params.id);
  writeStore(store);
  res.json({ success: true });
});

// Notes
app.get("/api/notes", (req, res) => {
  const store = readStore();
  res.json(store.notes);
});

app.post("/api/notes", (req, res) => {
  const store = readStore();
  const newNote: NoteItem = {
    id: `note_${Date.now()}`,
    projectId: req.body.projectId,
    title: req.body.title || "Untitled Note",
    content: req.body.content || "",
    category: req.body.category || "learned",
    isPinned: Boolean(req.body.isPinned),
    driveFileName: req.body.driveFileName,
    driveFileUrl: req.body.driveFileUrl,
    createdAt: new Date().toISOString()
  };
  store.notes.unshift(newNote);
  writeStore(store);
  res.json(newNote);
});

app.put("/api/notes/:id", (req, res) => {
  const store = readStore();
  const idx = store.notes.findIndex(n => n.id === req.params.id);
  if (idx !== -1) {
    store.notes[idx] = { ...store.notes[idx], ...req.body };
    writeStore(store);
    res.json(store.notes[idx]);
  } else {
    res.status(404).json({ error: "Note not found" });
  }
});

app.delete("/api/notes/:id", (req, res) => {
  const store = readStore();
  store.notes = store.notes.filter(n => n.id !== req.params.id);
  writeStore(store);
  res.json({ success: true });
});

// Google Calendar Integration API Proxy
app.get("/api/google/calendar", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const accessToken = authHeader.split(" ")[1];
      const calendarRes = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=" + encodeURIComponent(new Date().toISOString()) + "&maxResults=10&orderBy=startTime&singleEvents=true", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (calendarRes.ok) {
        const data = await calendarRes.json();
        return res.json({ source: "google", items: data.items || [] });
      }
    } catch (e) {
      console.error("Failed to fetch Google Calendar:", e);
    }
  }

  // Fallback demo events tailored for Y2K Work Tracker
  const sampleEvents: CalendarEvent[] = [
    {
      id: "evt_1",
      summary: "🖥️ Weekly Boss Time & Scope Review",
      description: "Review backdated work logs, working points completed, and milestone scope for CyberDash Y2K Portal.",
      start: { dateTime: new Date(Date.now() + 3600000 * 4).toISOString() },
      end: { dateTime: new Date(Date.now() + 3600000 * 5).toISOString() },
      location: "Google Meet Room A"
    },
    {
      id: "evt_2",
      summary: "👾 Pixel Sprite & UI Polish Deadline",
      description: "Finalize animated pixel progress bar sprites and custom widget drag-and-drop handles.",
      start: { dateTime: new Date(Date.now() + 86400000 * 1.5).toISOString() },
      end: { dateTime: new Date(Date.now() + 86400000 * 1.5 + 3600000).toISOString() },
      location: "Design Studio"
    },
    {
      id: "evt_3",
      summary: "📅 Q3 Project Deliverables Sign-off",
      description: "Export clean time summary PDF report for management approval.",
      start: { dateTime: new Date(Date.now() + 86400000 * 3).toISOString() },
      end: { dateTime: new Date(Date.now() + 86400000 * 3 + 3600000 * 2).toISOString() },
      location: "Executive Boardroom"
    }
  ];

  res.json({ source: "sample", items: sampleEvents });
});

// Google Drive Integration API Proxy
app.get("/api/google/drive", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const accessToken = authHeader.split(" ")[1];
      const driveRes = await fetch("https://www.googleapis.com/drive/v3/files?pageSize=10&fields=files(id,name,mimeType,webViewLink,iconLink,modifiedTime)", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (driveRes.ok) {
        const data = await driveRes.json();
        return res.json({ source: "google", files: data.files || [] });
      }
    } catch (e) {
      console.error("Failed to fetch Google Drive:", e);
    }
  }

  // Fallback demo files
  const sampleFiles: DriveFile[] = [
    {
      id: "file_1",
      name: "📁 CyberDash_Y2K_Project_Scope_Spec.gdoc",
      mimeType: "application/vnd.google-apps.document",
      webViewLink: "https://docs.google.com/document/d/sample1",
      modifiedTime: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: "file_2",
      name: "📊 Sprint_2_Working_Points_Allocation.gsheet",
      mimeType: "application/vnd.google-apps.spreadsheet",
      webViewLink: "https://docs.google.com/spreadsheets/d/sample2",
      modifiedTime: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      id: "file_3",
      name: "📝 Architecture_Meeting_Notes_Aug2026.gdoc",
      mimeType: "application/vnd.google-apps.document",
      webViewLink: "https://docs.google.com/document/d/sample3",
      modifiedTime: new Date(Date.now() - 86400000 * 5).toISOString()
    }
  ];

  res.json({ source: "sample", files: sampleFiles });
});

// Gemini 2.5 Flash-Lite: Real-time Meeting Notes Summarizer & Action Item Extractor
app.post("/api/gemini/summarize-doc", async (req, res) => {
  const { docTitle, docText, projectName } = req.body;
  const ai = getGenAI();

  if (ai && docText) {
    try {
      const prompt = `You are an AI assistant for PixelTrack 2000. Analyze these meeting notes titled "${docTitle || 'Meeting Notes'}" for project "${projectName || 'Current Project'}".
Return strictly valid JSON with this structure:
{
  "docTitle": "${docTitle || 'Meeting Notes'}",
  "summary": "Concise 2-3 sentence executive summary of key meeting points",
  "decisions": ["Key decision 1", "Key decision 2"],
  "actionItems": [
    {
      "id": "act_1",
      "title": "Clear action item description",
      "priority": "high" | "medium" | "low",
      "estimatedPoints": 5,
      "deadline": "YYYY-MM-DD"
    }
  ]
}

Document Text:
${docText}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json(parsed);
      }
    } catch (e: any) {
      console.error("Gemini Flash summarize error:", e);
    }
  }

  // Fallback response if API key is not present or call fails
  const deadlineStr = new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0];
  res.json({
    docTitle: docTitle || "Google Drive Meeting Spec",
    summary: `Analyzed "${docTitle || 'Meeting Notes'}". Highlights key architectural milestones, working point distribution, and boss report deadlines for ${projectName || 'the active project'}.`,
    decisions: [
      "Approved hourly billing rate and scope milestone deliverables",
      "Finalized Y2K vibrant UI redesign and retro progress bar controls"
    ],
    actionItems: [
      {
        id: `act_${Date.now()}_1`,
        title: `Execute action items from ${docTitle || 'Meeting Notes'}`,
        priority: "high",
        estimatedPoints: 8,
        deadline: deadlineStr
      },
      {
        id: `act_${Date.now()}_2`,
        title: "Review boss report export with management team",
        priority: "medium",
        estimatedPoints: 5,
        deadline: deadlineStr
      }
    ]
  });
});

// Gemini 2.5 Pro Thinking Mode: Complex Scope & Boss Query Analysis
app.post("/api/gemini/thinking-analysis", async (req, res) => {
  const { query, project, logs, todos, enableThinking } = req.body;
  const ai = getGenAI();

  if (ai) {
    try {
      const prompt = `You are the PixelTrack 2000 AI Strategy Agent with Thinking Mode enabled.
User Query: ${query}

Context Data:
Project Name: ${project?.name || 'All Projects'}
Target Hours: ${project?.targetHours || 40}h
Target Points: ${project?.targetPoints || 100}pts
Total Logs: ${(logs || []).length}
Total To-Dos: ${(todos || []).length}

Provide a response in JSON format with two keys:
1. "thinkingProcess": Step-by-step analytical reasoning, calculations (velocity, working point distribution, risk evaluation, rate optimization).
2. "finalAnswer": Formatted markdown strategy answer and executive boss advice.

JSON Format:
{
  "thinkingProcess": "...",
  "finalAnswer": "..."
}`;

      const modelName = enableThinking ? "gemini-2.5-pro" : "gemini-2.5-flash";
      const configObj: any = { responseMimeType: "application/json" };
      if (enableThinking) {
        configObj.thinkingConfig = { thinkingBudget: 2048 };
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: configObj
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json(parsed);
      }
    } catch (e: any) {
      console.error("Gemini Thinking error:", e);
    }
  }

  // Fallback reasoning response
  res.json({
    thinkingProcess: `1. Analyzed project "${project?.name || 'Scope'}": Target ${project?.targetHours || 40}h.\n2. Calculated velocity across ${(logs || []).length} logged items.\n3. Identified ${todos?.filter((t: any) => !t.completed).length || 0} pending deadlined tasks.\n4. Formulated rate optimization and boss summary recommendations.`,
    finalAnswer: `🧠 **Thinking Mode Strategy for ${project?.name || 'Your Scope'}**:\n\n- **Milestone Velocity**: Outstanding working points accumulation rate.\n- **Scope Optimization**: Recommend completing high-priority deadlined tasks first to maximize velocity.\n- **Boss Report Tip**: Ensure all backdated entries include clear deliverables for billing.`
  });
});

// Context-Aware AI Workspace Chatbot
app.post("/api/gemini/chat", async (req, res) => {
  const { message, history, context } = req.body;
  const ai = getGenAI();

  if (ai) {
    try {
      const prompt = `You are Pixel, a witty context-aware 2000s retro AI support guide in PixelTrack 2000.
Context:
Active Project: "${context?.activeProjectName || 'All Projects'}"
Logged Hours: ${context?.loggedHours || 0}h
Earned Points: ${context?.earnedPoints || 0}pts
Pending To-Dos: ${context?.pendingTodos || 0}

Chat History:
${(history || []).map((h: any) => `${h.sender}: ${h.text}`).join("\n")}

User Question: ${message}

Pixel AI Answer:`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

      if (response.text) {
        return res.json({ reply: response.text });
      }
    } catch (e: any) {
      console.error("Gemini Chat error:", e);
    }
  }

  res.json({
    reply: `👾 Bleep bloop! I'm Pixel, your 2000s workspace assistant. In project "${context?.activeProjectName || 'Active Scope'}", you've logged ${context?.loggedHours || 0} hours and earned ${context?.earnedPoints || 0} working points! Let me know if you need help auto-summarizing meeting notes or preparing a Boss Report!`
  });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PixelTrack 2000 Server running on http://localhost:${PORT}`);
  });
}

startServer();
