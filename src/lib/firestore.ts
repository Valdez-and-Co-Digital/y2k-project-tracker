import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  where,
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from './firebase';
import { Project, TimeLog, TodoItem, NoteItem } from '../types';

// Collection references
const PROJECTS_COL = 'projects';
const LOGS_COL = 'logs';
const TODOS_COL = 'todos';
const NOTES_COL = 'notes';

// --- PROJECTS ---
export async function getProjectsFromFirestore(): Promise<Project[]> {
  try {
    const user = auth.currentUser;
    if (!user) return [];
    const q = query(collection(db, PROJECTS_COL), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    } as Project));
  } catch (err) {
    console.warn('Firestore fetch projects failed, falling back:', err);
    return [];
  }
}

export async function saveProjectToFirestore(project: Partial<Project>): Promise<Project> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Must be logged in to save projects");

    if (project.id) {
      const docRef = doc(db, PROJECTS_COL, project.id);
      await updateDoc(docRef, { ...project, updatedAt: serverTimestamp() });
      return { id: project.id, ...project } as Project;
    } else {
      const newProj = {
        userId: user.uid,
        name: project.name || 'New Project',
        description: project.description || '',
        color: project.color || 'purple',
        icon: project.icon || 'smart_toy',
        targetHours: project.targetHours || 40,
        targetPoints: project.targetPoints || 100,
        hourlyRate: project.hourlyRate || 85,
        widgets: project.widgets || ['timer', 'progress', 'quick_log', 'todos', 'notes'],
        createdAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, PROJECTS_COL), newProj);
      return { id: docRef.id, ...newProj } as Project;
    }
  } catch (err) {
    handleFirestoreError(err, project.id ? OperationType.UPDATE : OperationType.CREATE, PROJECTS_COL);
    throw err;
  }
}

export async function deleteProjectFromFirestore(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, PROJECTS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${PROJECTS_COL}/${id}`);
    throw err;
  }
}

// --- TIME LOGS ---
export async function getLogsFromFirestore(): Promise<TimeLog[]> {
  try {
    const user = auth.currentUser;
    if (!user) return [];
    const q = query(collection(db, LOGS_COL), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    } as TimeLog));
  } catch (err) {
    console.warn('Firestore fetch logs failed:', err);
    return [];
  }
}

export async function saveLogToFirestore(logData: Partial<TimeLog>): Promise<TimeLog> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Must be logged in to save logs");

    const newLog = {
      userId: user.uid,
      projectId: logData.projectId || '',
      taskName: logData.taskName || 'Working Session',
      description: logData.description || '',
      durationMinutes: logData.durationMinutes || 30,
      workingPoints: logData.workingPoints || 5,
      date: logData.date || new Date().toISOString(),
      backdated: logData.backdated || false,
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, LOGS_COL), newLog);
    return { id: docRef.id, ...newLog } as TimeLog;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, LOGS_COL);
    throw err;
  }
}

export async function deleteLogFromFirestore(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, LOGS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${LOGS_COL}/${id}`);
    throw err;
  }
}

// --- TO-DOS ---
export async function getTodosFromFirestore(): Promise<TodoItem[]> {
  try {
    const user = auth.currentUser;
    if (!user) return [];
    const q = query(collection(db, TODOS_COL), where('userId', '==', user.uid));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    } as TodoItem));
  } catch (err) {
    console.warn('Firestore fetch todos failed:', err);
    return [];
  }
}

export async function saveTodoToFirestore(todoData: Partial<TodoItem>): Promise<TodoItem> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Must be logged in to save todos");

    if (todoData.id) {
      const docRef = doc(db, TODOS_COL, todoData.id);
      await updateDoc(docRef, todoData);
      return todoData as TodoItem;
    } else {
      const newTodo = {
        userId: user.uid,
        projectId: todoData.projectId || '',
        title: todoData.title || 'New Task',
        completed: false,
        deadline: todoData.deadline || new Date().toISOString().split('T')[0],
        priority: todoData.priority || 'medium',
        estimatedPoints: todoData.estimatedPoints || 10,
        createdAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, TODOS_COL), newTodo);
      return { id: docRef.id, ...newTodo } as TodoItem;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, TODOS_COL);
    throw err;
  }
}

export async function deleteTodoFromFirestore(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, TODOS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${TODOS_COL}/${id}`);
    throw err;
  }
}

// --- NOTES ---
export async function getNotesFromFirestore(): Promise<NoteItem[]> {
  try {
    const user = auth.currentUser;
    if (!user) return [];
    const q = query(collection(db, NOTES_COL), where('userId', '==', user.uid));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    } as NoteItem));
  } catch (err) {
    console.warn('Firestore fetch notes failed:', err);
    return [];
  }
}

export async function saveNoteToFirestore(noteData: Partial<NoteItem>): Promise<NoteItem> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Must be logged in to save notes");

    if (noteData.id) {
      const docRef = doc(db, NOTES_COL, noteData.id);
      await updateDoc(docRef, noteData);
      return noteData as NoteItem;
    } else {
      const newNote = {
        userId: user.uid,
        projectId: noteData.projectId || '',
        title: noteData.title || 'New Note',
        content: noteData.content || '',
        category: noteData.category || 'general',
        isPinned: noteData.isPinned || false,
        createdAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, NOTES_COL), newNote);
      return { id: docRef.id, ...newNote } as NoteItem;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, NOTES_COL);
    throw err;
  }
}

export async function deleteNoteFromFirestore(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, NOTES_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${NOTES_COL}/${id}`);
    throw err;
  }
}
