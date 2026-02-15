import { renderHook, act } from '@testing-library/react';
import { useAuthStore, useTaskStore, useThemeStore } from '../store';
import { TaskStatus } from '../types';

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should login user', () => {
    const { result } = renderHook(() => useAuthStore());
    const user = { id: '1', username: 'test', email: 'test@example.com' };
    const token = 'token123';

    act(() => {
      result.current.login(user, token);
    });

    expect(result.current.user).toEqual(user);
    expect(result.current.token).toBe(token);
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem('token')).toBe(token);
    expect(localStorage.getItem('user')).toBe(JSON.stringify(user));
  });

  it('should logout user', () => {
    const { result } = renderHook(() => useAuthStore());
    const user = { id: '1', username: 'test', email: 'test@example.com' };

    act(() => {
      result.current.login(user, 'token123');
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('should initialize from localStorage', () => {
    const user = { id: '1', username: 'test', email: 'test@example.com' };
    const token = 'token123';
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.initialize();
    });

    expect(result.current.user).toEqual(user);
    expect(result.current.token).toBe(token);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle invalid JSON in localStorage during initialize', () => {
    localStorage.setItem('token', 'token123');
    localStorage.setItem('user', 'invalid-json');

    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.initialize();
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});

describe('useTaskStore', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.TODO,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    localStorage.clear();
    useTaskStore.setState({
      tasks: [],
      loading: false,
      error: null,
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useTaskStore());
    expect(result.current.tasks).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should set tasks', () => {
    const { result } = renderHook(() => useTaskStore());

    act(() => {
      result.current.setTasks([mockTask]);
    });

    expect(result.current.tasks).toEqual([mockTask]);
    expect(result.current.error).toBeNull();
    expect(localStorage.getItem('tasks')).toBe(JSON.stringify([mockTask]));
  });

  it('should add task', () => {
    const { result } = renderHook(() => useTaskStore());

    act(() => {
      result.current.addTask(mockTask);
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0]).toEqual(mockTask);
    expect(result.current.error).toBeNull();
  });

  it('should update task', () => {
    const { result } = renderHook(() => useTaskStore());
    const updatedTask = { ...mockTask, title: 'Updated Title' };

    act(() => {
      result.current.setTasks([mockTask]);
      result.current.updateTask(mockTask.id, updatedTask);
    });

    expect(result.current.tasks[0].title).toBe('Updated Title');
    expect(result.current.error).toBeNull();
  });

  it('should delete task', () => {
    const { result } = renderHook(() => useTaskStore());

    act(() => {
      result.current.setTasks([mockTask]);
      result.current.deleteTask(mockTask.id);
    });

    expect(result.current.tasks).toHaveLength(0);
    expect(result.current.error).toBeNull();
  });

  it('should set loading', () => {
    const { result } = renderHook(() => useTaskStore());

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.loading).toBe(true);
  });

  it('should set error', () => {
    const { result } = renderHook(() => useTaskStore());

    act(() => {
      result.current.setError('Test error');
    });

    expect(result.current.error).toBe('Test error');
  });

  it('should initialize from localStorage', () => {
    localStorage.setItem('tasks', JSON.stringify([mockTask]));

    const { result } = renderHook(() => useTaskStore());
    
    act(() => {
      result.current.initialize();
    });

    expect(result.current.tasks).toEqual([mockTask]);
  });

  it('should handle invalid JSON in localStorage during initialize', () => {
    localStorage.setItem('tasks', 'invalid-json');

    const { result } = renderHook(() => useTaskStore());
    
    act(() => {
      result.current.initialize();
    });

    expect(result.current.tasks).toEqual([]);
    expect(localStorage.getItem('tasks')).toBeNull();
  });
});

describe('useThemeStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useThemeStore.setState({
      isDarkMode: false,
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useThemeStore());
    expect(result.current.isDarkMode).toBe(false);
  });

  it('should toggle theme', () => {
    const { result } = renderHook(() => useThemeStore());

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.isDarkMode).toBe(true);
    expect(localStorage.getItem('darkMode')).toBe('true');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.isDarkMode).toBe(false);
    expect(localStorage.getItem('darkMode')).toBe('false');
  });

  it('should initialize from localStorage', () => {
    localStorage.setItem('darkMode', 'true');

    const { result } = renderHook(() => useThemeStore());
    
    act(() => {
      result.current.initialize();
    });

    expect(result.current.isDarkMode).toBe(true);
  });

  it('should handle invalid JSON in localStorage during initialize', () => {
    localStorage.setItem('darkMode', 'invalid-json');

    const { result } = renderHook(() => useThemeStore());
    
    act(() => {
      result.current.initialize();
    });

    expect(localStorage.getItem('darkMode')).toBeNull();
  });
});
