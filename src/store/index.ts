import { create } from 'zustand';
import { Task, User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  login: (user: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  initialize: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true });
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  },
}));

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Task) => void;
  deleteTask: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initialize: () => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  loading: false,
  error: null,
  
  setTasks: (tasks: Task[]) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    set({ tasks, error: null });
  },
  
  addTask: (task: Task) => {
    set((state) => {
      const newTasks = [...state.tasks, task];
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      return { tasks: newTasks, error: null };
    });
  },
  
  updateTask: (id: string, updatedTask: Task) => {
    set((state) => {
      const newTasks = state.tasks.map((task) =>
        task.id === id ? updatedTask : task
      );
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      return { tasks: newTasks, error: null };
    });
  },
  
  deleteTask: (id: string) => {
    set((state) => {
      const newTasks = state.tasks.filter((task) => task.id !== id);
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      return { tasks: newTasks, error: null };
    });
  },
  
  setLoading: (loading: boolean) => set({ loading }),
  
  setError: (error: string | null) => set({ error }),
  
  initialize: () => {
    const tasksStr = localStorage.getItem('tasks');
    if (tasksStr) {
      try {
        const tasks = JSON.parse(tasksStr);
        set({ tasks });
      } catch {
        localStorage.removeItem('tasks');
      }
    }
  },
}));

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  initialize: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: false,
  
  toggleTheme: () => {
    set((state) => {
      const newMode = !state.isDarkMode;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return { isDarkMode: newMode };
    });
  },
  
  initialize: () => {
    const darkModeStr = localStorage.getItem('darkMode');
    if (darkModeStr) {
      try {
        const isDarkMode = JSON.parse(darkModeStr);
        set({ isDarkMode });
      } catch {
        localStorage.removeItem('darkMode');
      }
    }
  },
}));
