import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { useAuthStore, useTaskStore, useThemeStore } from '../store';
import * as apiUtils from '../utils/api';
import { TaskStatus } from '../types';

jest.mock('../utils/api', () => ({
  tasksApi: {
    getTasks: jest.fn(),
    deleteTask: jest.fn(),
  },
}));

jest.mock('../components/TaskCard', () => ({
  __esModule: true,
  default: ({ task, onEdit, onRefresh }: any) => (
    <div data-testid={`task-${task.id}`}>
      <h3>{task.title}</h3>
      <button onClick={() => onEdit(task)}>Edit</button>
      <button onClick={onRefresh}>Refresh</button>
    </div>
  ),
}));

jest.mock('../components/TaskModal', () => ({
  __esModule: true,
  default: ({ visible, onClose, onSuccess }: any) =>
    visible ? (
      <div data-testid="task-modal">
        <button onClick={onClose}>Close</button>
        <button onClick={onSuccess}>Success</button>
      </div>
    ) : null,
}));

describe('Dashboard', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      status: TaskStatus.TODO,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      status: TaskStatus.IN_PROGRESS,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Task 3',
      description: 'Description 3',
      status: TaskStatus.COMPLETED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      user: { id: '1', username: 'test', email: 'test@example.com' },
      token: 'token123',
      isAuthenticated: true,
    });
    useTaskStore.setState({
      tasks: [],
      loading: false,
      error: null,
    });
    useThemeStore.setState({
      isDarkMode: false,
    });
    (apiUtils.tasksApi.getTasks as jest.Mock).mockResolvedValue(mockTasks);
  });

  const renderDashboard = () => {
    return render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
  };

  it('should render dashboard with user info', () => {
    renderDashboard();
    
    expect(screen.getByText('Task Manager')).toBeInTheDocument();
    expect(screen.getByText('Welcome back, test!')).toBeInTheDocument();
  });

  it('should fetch tasks on mount', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(apiUtils.tasksApi.getTasks).toHaveBeenCalled();
    });
  });

  it('should display stats correctly', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Total')).toBeInTheDocument();
    });
  });

  it('should open create task modal', async () => {
    const user = userEvent.setup();
    renderDashboard();
    
    const createButton = screen.getByRole('button', { name: /new task/i });
    await user.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('task-modal')).toBeInTheDocument();
    });
  });

  it('should handle logout', async () => {
    const user = userEvent.setup();
    const logoutMock = jest.fn();
    useAuthStore.setState({
      user: { id: '1', username: 'test', email: 'test@example.com' },
      token: 'token123',
      isAuthenticated: true,
      logout: logoutMock,
    });
    
    renderDashboard();
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await user.click(logoutButton);
    
    expect(logoutMock).toHaveBeenCalled();
  });

  it('should toggle theme', async () => {
    const user = userEvent.setup();
    const toggleThemeMock = jest.fn();
    useThemeStore.setState({
      isDarkMode: false,
      toggleTheme: toggleThemeMock,
    });
    
    renderDashboard();
    
    const themeButton = screen.getByRole('button', { name: /dark/i });
    await user.click(themeButton);
    
    expect(toggleThemeMock).toHaveBeenCalled();
  });

  it('should show loading state', () => {
    useTaskStore.setState({
      tasks: [],
      loading: true,
      error: null,
    });
    
    renderDashboard();
    
    expect(screen.getByRole('img', { name: /loading/i })).toBeInTheDocument();
  });

  it('should show empty state when no tasks', async () => {
    (apiUtils.tasksApi.getTasks as jest.Mock).mockResolvedValue([]);
    
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
    });
  });

  it('should render tasks when available', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByTestId('task-1')).toBeInTheDocument();
      expect(screen.getByTestId('task-2')).toBeInTheDocument();
      expect(screen.getByTestId('task-3')).toBeInTheDocument();
    });
  });

  it('should filter tasks by status', async () => {
    const user = userEvent.setup();
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByTestId('task-1')).toBeInTheDocument();
    });
    
    // Open select dropdown
    const selectElement = screen.getByRole('combobox');
    await user.click(selectElement);
    
    // Wait for dropdown options to appear
    await waitFor(() => {
      const todoOption = screen.getByText('To Do');
      expect(todoOption).toBeInTheDocument();
    });
  });

  it('should handle edit task', async () => {
    const user = userEvent.setup();
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByTestId('task-1')).toBeInTheDocument();
    });
    
    const editButton = screen.getAllByRole('button', { name: /edit/i })[0];
    await user.click(editButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('task-modal')).toBeInTheDocument();
    });
  });

  it('should handle modal close', async () => {
    const user = userEvent.setup();
    renderDashboard();
    
    const createButton = screen.getByRole('button', { name: /new task/i });
    await user.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('task-modal')).toBeInTheDocument();
    });
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByTestId('task-modal')).not.toBeInTheDocument();
    });
  });

  it('should handle modal success', async () => {
    const user = userEvent.setup();
    renderDashboard();
    
    const createButton = screen.getByRole('button', { name: /new task/i });
    await user.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('task-modal')).toBeInTheDocument();
    });
    
    const successButton = screen.getByRole('button', { name: /success/i });
    await user.click(successButton);
    
    await waitFor(() => {
      expect(apiUtils.tasksApi.getTasks).toHaveBeenCalledTimes(2);
    });
  });

  it('should handle fetch tasks error', async () => {
    (apiUtils.tasksApi.getTasks as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
    
    renderDashboard();
    
    await waitFor(() => {
      expect(apiUtils.tasksApi.getTasks).toHaveBeenCalled();
    });
  });

  it('should apply dark mode class', () => {
    useThemeStore.setState({
      isDarkMode: true,
    });
    
    const { container } = renderDashboard();
    
    expect(container.querySelector('.dashboard-container.dark')).toBeInTheDocument();
  });
});
