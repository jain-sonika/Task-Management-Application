import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskCard from '../components/TaskCard';
import { TaskStatus } from '../types';
import * as apiUtils from '../utils/api';
import { useTaskStore } from '../store';

jest.mock('../utils/api', () => ({
  tasksApi: {
    deleteTask: jest.fn(),
  },
}));

describe('TaskCard', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.TODO,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  };

  const mockOnEdit = jest.fn();
  const mockOnRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useTaskStore.setState({
      tasks: [mockTask],
      loading: false,
      error: null,
    });
  });

  it('should render task details', () => {
    render(
      <TaskCard task={mockTask} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskCard task={mockTask} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });

  it('should delete task when confirmed', async () => {
    const user = userEvent.setup();
    const deleteTaskMock = jest.fn();
    useTaskStore.setState({
      tasks: [mockTask],
      loading: false,
      error: null,
      deleteTask: deleteTaskMock,
    });
    
    (apiUtils.tasksApi.deleteTask as jest.Mock).mockResolvedValue(undefined);

    render(
      <TaskCard task={mockTask} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    // Confirm deletion
    const confirmButton = await screen.findByRole('button', { name: /yes/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(apiUtils.tasksApi.deleteTask).toHaveBeenCalledWith(mockTask.id);
      expect(deleteTaskMock).toHaveBeenCalledWith(mockTask.id);
      expect(mockOnRefresh).toHaveBeenCalled();
    });
  });

  it('should handle delete error', async () => {
    const user = userEvent.setup();
    (apiUtils.tasksApi.deleteTask as jest.Mock).mockRejectedValue(new Error('Delete failed'));

    render(
      <TaskCard task={mockTask} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    const confirmButton = await screen.findByRole('button', { name: /yes/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(apiUtils.tasksApi.deleteTask).toHaveBeenCalledWith(mockTask.id);
    });
  });

  it('should render correct status color for TODO', () => {
    render(
      <TaskCard task={mockTask} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />
    );

    const tag = screen.getByText('To Do');
    expect(tag).toBeInTheDocument();
  });

  it('should render correct status color for IN_PROGRESS', () => {
    const inProgressTask = { ...mockTask, status: TaskStatus.IN_PROGRESS };
    render(
      <TaskCard task={inProgressTask} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />
    );

    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('should render correct status color for COMPLETED', () => {
    const completedTask = { ...mockTask, status: TaskStatus.COMPLETED };
    render(
      <TaskCard task={completedTask} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />
    );

    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('should format date correctly', () => {
    render(
      <TaskCard task={mockTask} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />
    );

    expect(screen.getByText(/Jan 1, 2024/i)).toBeInTheDocument();
  });

  it('should not delete when cancel is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskCard task={mockTask} onEdit={mockOnEdit} onRefresh={mockOnRefresh} />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    const cancelButton = await screen.findByRole('button', { name: /no/i });
    await user.click(cancelButton);

    expect(apiUtils.tasksApi.deleteTask).not.toHaveBeenCalled();
  });
});
