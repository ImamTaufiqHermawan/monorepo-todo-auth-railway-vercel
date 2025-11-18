import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import mongoose from 'mongoose';
import Todo from '../../../src/models/Todo.js';
import User from '../../../src/models/User.js';

describe('Todo Model Tests', () => {
  let mongoAvailable = false;
  let testUser;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-test';
    
    try {
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 5000
        });
      }
      mongoAvailable = mongoose.connection.readyState === 1;

      if (mongoAvailable) {
        testUser = await new User({
          email: 'test@example.com',
          password: 'password123'
        }).save();
      }
    } catch (error) {
      console.log('\n⚠️  MongoDB not available - database tests will be skipped\n');
      mongoAvailable = false;
    }
  });

  afterAll(async () => {
    if (mongoAvailable) {
      await Todo.deleteMany({});
      await User.deleteMany({});
      await mongoose.connection.close();
    }
  });

  beforeEach(async () => {
    if (mongoAvailable) {
      await Todo.deleteMany({});
    }
  });

  describe('Todo Creation', () => {
    it('should create todo with valid data', async () => {
      if (!mongoAvailable) return;

      const todo = await new Todo({
        title: 'Test Todo',
        user: testUser._id
      }).save();

      expect(todo._id).toBeDefined();
      expect(todo.title).toBe('Test Todo');
      expect(todo.completed).toBe(false);
    });

    it('should fail without title', async () => {
      if (!mongoAvailable) return;

      const todo = new Todo({ user: testUser._id });
      await expect(todo.save()).rejects.toThrow();
    });

    it('should fail without user', async () => {
      if (!mongoAvailable) return;

      const todo = new Todo({ title: 'Test' });
      await expect(todo.save()).rejects.toThrow();
    });

    it('should trim title', async () => {
      if (!mongoAvailable) return;

      const todo = await new Todo({
        title: '  Test Todo  ',
        user: testUser._id
      }).save();

      expect(todo.title).toBe('Test Todo');
    });
  });

  describe('Todo Updates', () => {
    it('should update title', async () => {
      if (!mongoAvailable) return;

      const todo = await new Todo({
        title: 'Original',
        user: testUser._id
      }).save();

      todo.title = 'Updated';
      await todo.save();

      expect(todo.title).toBe('Updated');
    });

    it('should toggle completed', async () => {
      if (!mongoAvailable) return;

      const todo = await new Todo({
        title: 'Test',
        user: testUser._id,
        completed: false
      }).save();

      todo.completed = true;
      await todo.save();

      expect(todo.completed).toBe(true);
    });
  });

  describe('Todo Queries', () => {
    it('should find all user todos', async () => {
      if (!mongoAvailable) return;

      await Todo.create([
        { title: 'Todo 1', user: testUser._id },
        { title: 'Todo 2', user: testUser._id },
        { title: 'Todo 3', user: testUser._id }
      ]);

      const todos = await Todo.find({ user: testUser._id });
      expect(todos).toHaveLength(3);
    });

    it('should find completed todos', async () => {
      if (!mongoAvailable) return;

      await Todo.create([
        { title: 'Todo 1', user: testUser._id, completed: true },
        { title: 'Todo 2', user: testUser._id, completed: false }
      ]);

      const completed = await Todo.find({ user: testUser._id, completed: true });
      expect(completed).toHaveLength(1);
    });

    it('should sort by createdAt', async () => {
      if (!mongoAvailable) return;

      const todo1 = await new Todo({ title: 'First', user: testUser._id }).save();
      await new Promise(resolve => setTimeout(resolve, 10));
      const todo2 = await new Todo({ title: 'Second', user: testUser._id }).save();
      await new Promise(resolve => setTimeout(resolve, 10));
      const todo3 = await new Todo({ title: 'Third', user: testUser._id }).save();

      const todos = await Todo.find({ user: testUser._id }).sort({ createdAt: -1 });
      expect(todos[0].title).toBe('Third');
      expect(todos[2].title).toBe('First');
    });
  });

  describe('Todo Deletion', () => {
    it('should delete todo', async () => {
      if (!mongoAvailable) return;

      const todo = await new Todo({
        title: 'Delete Me',
        user: testUser._id
      }).save();

      await Todo.findByIdAndDelete(todo._id);
      const deleted = await Todo.findById(todo._id);
      expect(deleted).toBeNull();
    });
  });

  describe('Schema Validation', () => {
    it('should have required fields', () => {
      const required = Todo.schema.requiredPaths();
      expect(required).toContain('title');
      expect(required).toContain('user');
    });

    it('should have correct field types', () => {
      const schema = Todo.schema.obj;
      expect(schema.title.type).toBe(String);
      expect(schema.completed.type).toBe(Boolean);
      expect(schema.completed.default).toBe(false);
    });
  });

  describe('User-Todo Relationship', () => {
    it('should populate user data', async () => {
      if (!mongoAvailable) return;

      // Pastikan testUser ada
      if (!testUser || !testUser._id) {
        console.log('⚠️ Test user not available - skipping populate test');
        return;
      }

      // Verify user exists in DB
      const userExists = await User.findById(testUser._id);
      if (!userExists) {
        console.log('⚠️ Test user not found in DB - skipping populate test');
        return;
      }

      const todo = await new Todo({
        title: 'Test Todo',
        user: testUser._id
      }).save();

      const populated = await Todo.findById(todo._id).populate('user');
      expect(populated.user).toBeDefined();
      expect(populated.user.email).toBe('test@example.com');
    });
  });
});
