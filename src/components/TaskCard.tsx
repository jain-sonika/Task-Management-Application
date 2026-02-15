import React, { useState } from 'react';
import { Card, Tag, Button, Popconfirm, message } from 'antd';
import { Edit, Trash2, Clock } from 'lucide-react';
import { Task, TaskStatus } from '../types';
import { tasksApi } from '../utils/api';
import { useTaskStore } from '../store';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onRefresh: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onRefresh }) => {
  const [deleting, setDeleting] = useState(false);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await tasksApi.deleteTask(task.id);
      deleteTask(task.id);
      message.success('Task deleted successfully');
      onRefresh();
    } catch (error) {
      message.error('Failed to delete task');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'blue';
      case TaskStatus.IN_PROGRESS:
        return 'orange';
      case TaskStatus.COMPLETED:
        return 'green';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'To Do';
      case TaskStatus.IN_PROGRESS:
        return 'In Progress';
      case TaskStatus.COMPLETED:
        return 'Completed';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card
      className="task-card"
      actions={[
        <Button
          key="edit"
          type="text"
          icon={<Edit size={16} />}
          onClick={() => onEdit(task)}
        >
          Edit
        </Button>,
        <Popconfirm
          key="delete"
          title="Delete task"
          description="Are you sure you want to delete this task?"
          onConfirm={handleDelete}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="text"
            danger
            icon={<Trash2 size={16} />}
            loading={deleting}
          >
            Delete
          </Button>
        </Popconfirm>,
      ]}
    >
      <div className="task-card-header">
        <h3 className="task-title">{task.title}</h3>
        <Tag color={getStatusColor(task.status)}>
          {getStatusLabel(task.status)}
        </Tag>
      </div>
      
      <p className="task-description">{task.description}</p>
      
      <div className="task-card-footer">
        <div className="task-date">
          <Clock size={14} />
          <span>{formatDate(task.updatedAt)}</span>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
