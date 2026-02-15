import React, { useEffect, useState } from 'react';
import { Button, Empty, Spin, message, Select } from 'antd';
import { Plus, LogOut, Sun, Moon } from 'lucide-react';
import { useAuthStore, useTaskStore, useThemeStore } from '../store';
import { tasksApi } from '../utils/api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { Task, TaskStatus } from '../types';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { tasks, setTasks, setLoading, loading } = useTaskStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await tasksApi.getTasks();
      setTasks(data);
    } catch (error) {
      message.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    message.success('Logged out successfully');
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalVisible(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingTask(null);
  };

  const handleModalSuccess = () => {
    setIsModalVisible(false);
    setEditingTask(null);
    fetchTasks();
  };

  const filteredTasks = filterStatus === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filterStatus);

  const getStatusCount = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status).length;
  };

  return (
    <div className={`dashboard-container ${isDarkMode ? 'dark' : ''}`}>
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Task Manager</h1>
            <p>Welcome back, {user?.username}!</p>
          </div>
          <div className="header-actions">
            <Button
              icon={isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              onClick={toggleTheme}
              className="theme-toggle"
            >
              {isDarkMode ? 'Light' : 'Dark'}
            </Button>
            <Button
              type="primary"
              icon={<Plus size={18} />}
              onClick={handleCreateTask}
              className="create-button"
            >
              New Task
            </Button>
            <Button
              danger
              icon={<LogOut size={18} />}
              onClick={handleLogout}
              className="logout-button"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="stats-container">
          <div className="stat-card">
            <h3>To Do</h3>
            <p className="stat-number">{getStatusCount(TaskStatus.TODO)}</p>
          </div>
          <div className="stat-card">
            <h3>In Progress</h3>
            <p className="stat-number">{getStatusCount(TaskStatus.IN_PROGRESS)}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-number">{getStatusCount(TaskStatus.COMPLETED)}</p>
          </div>
          <div className="stat-card">
            <h3>Total</h3>
            <p className="stat-number">{tasks.length}</p>
          </div>
        </div>

        <div className="filter-section">
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 200 }}
            size="large"
            options={[
              { value: 'all', label: 'All Tasks' },
              { value: TaskStatus.TODO, label: 'To Do' },
              { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
              { value: TaskStatus.COMPLETED, label: 'Completed' },
            ]}
          />
        </div>

        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <Empty
            description={
              filterStatus === 'all' 
                ? 'No tasks yet. Create your first task!' 
                : `No ${filterStatus.replace('_', ' ')} tasks`
            }
            className="empty-state"
          >
            {filterStatus === 'all' && (
              <Button type="primary" onClick={handleCreateTask}>
                Create Task
              </Button>
            )}
          </Empty>
        ) : (
          <div className="tasks-grid">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onRefresh={fetchTasks}
              />
            ))}
          </div>
        )}
      </div>

      <TaskModal
        visible={isModalVisible}
        task={editingTask}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default Dashboard;
