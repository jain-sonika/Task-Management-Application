import React, { useState } from 'react';
import { Modal, Input, Select, message } from 'antd';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Task, CreateTaskDto, TaskStatus } from '../types';
import { tasksApi } from '../utils/api';
import { taskSchema } from '../utils/validations';
import { useTaskStore } from '../store';
import './TaskModal.css';

interface TaskModalProps {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onSuccess: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  visible,
  task,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const { addTask, updateTask } = useTaskStore();

  const initialValues: CreateTaskDto = {
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || TaskStatus.TODO,
  };

  const handleSubmit = async (values: CreateTaskDto) => {
    setLoading(true);
    try {
      if (task) {
        const updatedTask = await tasksApi.updateTask(task.id, values);
        updateTask(task.id, updatedTask);
        message.success('Task updated successfully');
      } else {
        const newTask = await tasksApi.createTask(values);
        addTask(newTask);
        message.success('Task created successfully');
      }
      onSuccess();
    } catch (error) {
      message.error(task ? 'Failed to update task' : 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={task ? 'Edit Task' : 'Create New Task'}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      className="task-modal"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={taskSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, values, setFieldValue, handleSubmit }) => (
          <Form className="task-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="title">
                Title <span className="required">*</span>
              </label>
              <Field
                as={Input}
                id="title"
                name="title"
                placeholder="Enter task title"
                size="large"
                status={errors.title && touched.title ? 'error' : ''}
              />
              <ErrorMessage
                name="title"
                component="div"
                className="error-message"
              />
            </div>

            <div className="form-field">
              <label htmlFor="description">
                Description <span className="required">*</span>
              </label>
              <Field
                as={Input.TextArea}
                id="description"
                name="description"
                placeholder="Enter task description"
                rows={4}
                status={errors.description && touched.description ? 'error' : ''}
              />
              <ErrorMessage
                name="description"
                component="div"
                className="error-message"
              />
            </div>

            <div className="form-field">
              <label htmlFor="status">
                Status <span className="required">*</span>
              </label>
              <Select
                id="status"
                value={values.status}
                onChange={(value) => setFieldValue('status', value)}
                size="large"
                style={{ width: '100%' }}
                options={[
                  { value: TaskStatus.TODO, label: 'To Do' },
                  { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
                  { value: TaskStatus.COMPLETED, label: 'Completed' },
                ]}
                status={errors.status && touched.status ? 'error' : ''}
              />
              <ErrorMessage
                name="status"
                component="div"
                className="error-message"
              />
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default TaskModal;
