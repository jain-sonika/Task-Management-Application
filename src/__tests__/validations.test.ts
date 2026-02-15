import { loginSchema, taskSchema } from '../utils/validations';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login credentials', async () => {
      const validData = {
        username: 'testuser',
        password: 'test123',
      };

      await expect(loginSchema.validate(validData)).resolves.toEqual(validData);
    });

    it('should reject empty username', async () => {
      const invalidData = {
        username: '',
        password: 'test123',
      };

      await expect(loginSchema.validate(invalidData)).rejects.toThrow('Username is required');
    });

    it('should reject short username', async () => {
      const invalidData = {
        username: 'ab',
        password: 'test123',
      };

      await expect(loginSchema.validate(invalidData)).rejects.toThrow(
        'Username must be at least 3 characters'
      );
    });

    it('should reject empty password', async () => {
      const invalidData = {
        username: 'testuser',
        password: '',
      };

      await expect(loginSchema.validate(invalidData)).rejects.toThrow('Password is required');
    });

    it('should reject short password', async () => {
      const invalidData = {
        username: 'testuser',
        password: '12345',
      };

      await expect(loginSchema.validate(invalidData)).rejects.toThrow(
        'Password must be at least 6 characters'
      );
    });
  });

  describe('taskSchema', () => {
    it('should validate correct task data', async () => {
      const validData = {
        title: 'Test Task',
        description: 'This is a test task description',
        status: 'todo',
      };

      await expect(taskSchema.validate(validData)).resolves.toEqual(validData);
    });

    it('should reject empty title', async () => {
      const invalidData = {
        title: '',
        description: 'This is a test task description',
        status: 'todo',
      };

      await expect(taskSchema.validate(invalidData)).rejects.toThrow('Title is required');
    });

    it('should reject short title', async () => {
      const invalidData = {
        title: 'Ab',
        description: 'This is a test task description',
        status: 'todo',
      };

      await expect(taskSchema.validate(invalidData)).rejects.toThrow(
        'Title must be at least 3 characters'
      );
    });

    it('should reject long title', async () => {
      const invalidData = {
        title: 'A'.repeat(101),
        description: 'This is a test task description',
        status: 'todo',
      };

      await expect(taskSchema.validate(invalidData)).rejects.toThrow(
        'Title must not exceed 100 characters'
      );
    });

    it('should reject empty description', async () => {
      const invalidData = {
        title: 'Test Task',
        description: '',
        status: 'todo',
      };

      await expect(taskSchema.validate(invalidData)).rejects.toThrow('Description is required');
    });

    it('should reject short description', async () => {
      const invalidData = {
        title: 'Test Task',
        description: 'Short',
        status: 'todo',
      };

      await expect(taskSchema.validate(invalidData)).rejects.toThrow(
        'Description must be at least 10 characters'
      );
    });

    it('should reject long description', async () => {
      const invalidData = {
        title: 'Test Task',
        description: 'A'.repeat(501),
        status: 'todo',
      };

      await expect(taskSchema.validate(invalidData)).rejects.toThrow(
        'Description must not exceed 500 characters'
      );
    });

    it('should reject empty status', async () => {
      const invalidData = {
        title: 'Test Task',
        description: 'This is a test task description',
        status: '',
      };

      await expect(taskSchema.validate(invalidData)).rejects.toThrow('Status is required');
    });

    it('should reject invalid status', async () => {
      const invalidData = {
        title: 'Test Task',
        description: 'This is a test task description',
        status: 'invalid_status',
      };

      await expect(taskSchema.validate(invalidData)).rejects.toThrow('Invalid status');
    });

    it('should accept valid in_progress status', async () => {
      const validData = {
        title: 'Test Task',
        description: 'This is a test task description',
        status: 'in_progress',
      };

      await expect(taskSchema.validate(validData)).resolves.toEqual(validData);
    });

    it('should accept valid completed status', async () => {
      const validData = {
        title: 'Test Task',
        description: 'This is a test task description',
        status: 'completed',
      };

      await expect(taskSchema.validate(validData)).resolves.toEqual(validData);
    });
  });
});
