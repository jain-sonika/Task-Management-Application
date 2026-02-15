import { http, HttpResponse } from 'msw';
import { AuthResponse, Task, CreateTaskDto, UpdateTaskDto, TaskStatus } from '../types';

// Mock data
const MOCK_USER = {
  id: '1',
  username: 'test',
  email: 'test@example.com',
};

const MOCK_TOKEN = 'mock-jwt-token-123456789';

// Initialize tasks from localStorage or use defaults
const getStoredTasks = (): Task[] => {
  const stored = localStorage.getItem('tasks');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [
    {
      id: '1',
      title: 'Complete project documentation',
      description: 'Write comprehensive documentation for the task management application',
      status: TaskStatus.IN_PROGRESS,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Review pull requests',
      description: 'Review and merge pending pull requests from team members',
      status: TaskStatus.TODO,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Deploy to production',
      description: 'Deploy the latest version to production environment',
      status: TaskStatus.COMPLETED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

let tasks = getStoredTasks();

// Save tasks to localStorage
const saveTasks = (newTasks: Task[]) => {
  tasks = newTasks;
  localStorage.setItem('tasks', JSON.stringify(newTasks));
};

export const handlers = [
  // Login endpoint
  http.post('/api/login', async ({ request }) => {
    const body = await request.json() as { username: string; password: string };
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    if (body.username === 'test' && body.password === 'test123') {
      const response: AuthResponse = {
        token: MOCK_TOKEN,
        user: MOCK_USER,
      };
      return HttpResponse.json(response, { status: 200 });
    }
    
    return HttpResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  // Get all tasks
  http.get('/api/tasks', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return HttpResponse.json(tasks, { status: 200 });
  }),

  // Create task
  http.post('/api/tasks', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json() as CreateTaskDto;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description,
      status: body.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    saveTasks([...tasks, newTask]);
    
    return HttpResponse.json(newTask, { status: 201 });
  }),

  // Update task
  http.put('/api/tasks/:id', async ({ request, params }) => {
    const authHeader = request.headers.get('Authorization');
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    const body = await request.json() as UpdateTaskDto;
    
    const taskIndex = tasks.findIndex((t) => t.id === id);
    
    if (taskIndex === -1) {
      return HttpResponse.json(
        { message: 'Task not found' },
        { status: 404 }
      );
    }
    
    const updatedTask: Task = {
      ...tasks[taskIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    const newTasks = [...tasks];
    newTasks[taskIndex] = updatedTask;
    saveTasks(newTasks);
    
    return HttpResponse.json(updatedTask, { status: 200 });
  }),

  // Delete task
  http.delete('/api/tasks/:id', async ({ request, params }) => {
    const authHeader = request.headers.get('Authorization');
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    const taskIndex = tasks.findIndex((t) => t.id === id);
    
    if (taskIndex === -1) {
      return HttpResponse.json(
        { message: 'Task not found' },
        { status: 404 }
      );
    }
    
    const newTasks = tasks.filter((t) => t.id !== id);
    saveTasks(newTasks);
    
    return HttpResponse.json(
      { message: 'Task deleted successfully' },
      { status: 200 }
    );
  }),
];
