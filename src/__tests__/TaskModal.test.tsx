import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskModal from '../components/TaskModal';
import { TaskStatus } from '../types';
import * as apiUtils from '../utils/api';
import { useTaskStore } from '../store';

jest.mock('../utils/api', () => ({
  tasksApi: {
    createTask: jest.fn(),
    updateTask: jest.fn(),
  },
}));

describe('TaskModal', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.TODO,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useTaskStore.setState({
      tasks: [],
      loading: false,
      error: null,
    });
  });

  it('should render create modal', () => {
    render(
      <TaskModal
        visible={true}
        task={null}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
  });

  it('should render edit modal with task data', () => {
    render(
      <TaskModal
        visible={true}
        task={mockTask}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
  });

  it('should not render when visible is false', () => {
    const { container } = render(
      <TaskModal
        visible={false}
        task={null}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(container.querySelector('.ant-modal')).not.toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(
      <TaskModal
        visible={true}
        task={null}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });
  });

  it('should show validation error for short title', async () => {
    const user = userEvent.setup();
    render(
      <TaskModal
        visible={true}
        task={null}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'Ab');

    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title must be at least 3 characters')).toBeInTheDocument();
    });
  });

  it('should show validation error for short description', async () => {
    const user = userEvent.setup();
    render(
      <TaskModal
        visible={true}
        task={null}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    await user.type(titleInput, 'Valid Title');
    await user.type(descriptionInput, 'Short');

    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Description must be at least 10 characters')).toBeInTheDocument();
    });
  });

  it('should create task successfully', async () => {
    const user = userEvent.setup();
    const addTaskMock = jest.fn();
    const newTask = {
      id: '2',
      title: 'New Task',
      description: 'New Description Here',
      status: TaskStatus.TODO,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    useTaskStore.setState({
      tasks: [],
      loading: false,
      error: null,
      addTask: addTaskMock,
    });

    (apiUtils.tasksApi.createTask as jest.Mock).mockResolvedValue(newTask);

    render(
      <TaskModal
        visible={true}
        task={null}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    await user.type(titleInput, 'New Task');
    await user.type(descriptionInput, 'New Description Here');

    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(apiUtils.tasksApi.createTask).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'New Description Here',
        status: TaskStatus.TODO,
      });
      expect(addTaskMock).toHaveBeenCalledWith(newTask);
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('should update task successfully', async () => {
    const user = userEvent.setup();
    const updateTaskMock = jest.fn();
    const updatedTask = {
      ...mockTask,
      title: 'Updated Task',
      description: 'Updated Description Here',
    };

    useTaskStore.setState({
      tasks: [mockTask],
      loading: false,
      error: null,
      updateTask: updateTaskMock,
    });

    (apiUtils.tasksApi.updateTask as jest.Mock).mockResolvedValue(updatedTask);

    render(
      <TaskModal
        visible={true}
        task={mockTask}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    await user.clear(titleInput);
    await user.clear(descriptionInput);

    await user.type(titleInput, 'Updated Task');
    await user.type(descriptionInput, 'Updated Description Here');

    const submitButton = screen.getByRole('button', { name: /update task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(apiUtils.tasksApi.updateTask).toHaveBeenCalledWith(mockTask.id, {
        title: 'Updated Task',
        description: 'Updated Description Here',
        status: TaskStatus.TODO,
      });
      expect(updateTaskMock).toHaveBeenCalledWith(mockTask.id, updatedTask);
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('should handle create task error', async () => {
    const user = userEvent.setup();
    (apiUtils.tasksApi.createTask as jest.Mock).mockRejectedValue(new Error('Create failed'));

    render(
      <TaskModal
        visible={true}
        task={null}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    await user.type(titleInput, 'New Task');
    await user.type(descriptionInput, 'New Description Here');

    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(apiUtils.tasksApi.createTask).toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });

  it('should handle update task error', async () => {
    const user = userEvent.setup();
    (apiUtils.tasksApi.updateTask as jest.Mock).mockRejectedValue(new Error('Update failed'));

    render(
      <TaskModal
        visible={true}
        task={mockTask}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const submitButton = screen.getByRole('button', { name: /update task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(apiUtils.tasksApi.updateTask).toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });

  it('should call onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskModal
        visible={true}
        task={null}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should change status', async () => {
    const user = userEvent.setup();
    render(
      <TaskModal
        visible={true}
        task={null}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const statusSelect = screen.getByRole('combobox');
    await user.click(statusSelect);

    await waitFor(() => {
      const inProgressOption = screen.getByText('In Progress');
      expect(inProgressOption).toBeInTheDocument();
    });
  });

  it('should disable buttons while loading', async () => {
    const user = userEvent.setup();
    (apiUtils.tasksApi.createTask as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(
      <TaskModal
        visible={true}
        task={null}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    await user.type(titleInput, 'New Task');
    await user.type(descriptionInput, 'New Description Here');

    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
    });
  });
});
