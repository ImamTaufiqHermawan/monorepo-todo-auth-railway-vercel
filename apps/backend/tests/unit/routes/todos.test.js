import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import mongoose from 'mongoose';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import todosRoutes from '../../../src/routes/todos.js';
import User from '../../../src/models/User.js';
import Todo from '../../../src/models/Todo.js';

describe('Todos Routes Tests', () => {
  let app;
  let mongoAvailable = false;
  let testUser;
  let authToken;

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
        // Setup Express app
        app = express();
        app.use(express.json());
        app.use('/api/todos', todosRoutes);

        // Create test user dan token
        testUser = await new User({
          email: 'test@example.com',
          password: 'password123'
        }).save();

        authToken = jwt.sign(
          { userId: testUser._id },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );
      }
    } catch (error) {
      console.log('\n⚠️  MongoDB not available - route tests will be skipped\n');
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

  describe('GET /api/todos', () => {
    it('should get all todos', async () => {
      if (!mongoAvailable) return;

      await Todo.create([
        { title: 'Todo 1', user: testUser._id },
        { title: 'Todo 2', user: testUser._id },
        { title: 'Todo 3', user: testUser._id }
      ]);

      const response = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(3);
    });

    it('should return empty array when no todos', async () => {
      if (!mongoAvailable) return;

      const response = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(0);
    });

    it('should fail without token', async () => {
      if (!mongoAvailable) return;

      await request(app)
        .get('/api/todos')
        .expect(401);
    });

    it('should fail with invalid token', async () => {
      if (!mongoAvailable) return;

      await request(app)
        .get('/api/todos')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('POST /api/todos', () => {
    it('should create new todo', async () => {
      if (!mongoAvailable) return;

      const response = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'New Todo' })
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.title).toBe('New Todo');
      expect(response.body.completed).toBe(false);
    });

    it('should fail with empty title', async () => {
      if (!mongoAvailable) return;

      await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: '' })
        .expect(400);
    });

    it('should fail without token', async () => {
      if (!mongoAvailable) return;

      await request(app)
        .post('/api/todos')
        .send({ title: 'New Todo' })
        .expect(401);
    });

    it('should trim title', async () => {
      if (!mongoAvailable) return;

      const response = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: '  Trimmed Todo  ' })
        .expect(201);

      expect(response.body.title).toBe('Trimmed Todo');
    });
  });

  describe('PUT /api/todos/:id', () => {
    let testTodo;

    beforeEach(async () => {
      if (mongoAvailable) {
        testTodo = await new Todo({
          title: 'Original',
          user: testUser._id,
          completed: false
        }).save();
      }
    });

    it('should update todo title', async () => {
      if (!mongoAvailable) return;

      const response = await request(app)
        .put(`/api/todos/${testTodo._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated' })
        .expect(200);

      expect(response.body.title).toBe('Updated');
    });

    it('should update completed status', async () => {
      if (!mongoAvailable) return;

      const response = await request(app)
        .put(`/api/todos/${testTodo._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ completed: true })
        .expect(200);

      expect(response.body.completed).toBe(true);
    });

    it('should fail with non-existent id', async () => {
      if (!mongoAvailable) return;

      const fakeId = new mongoose.Types.ObjectId();

      await request(app)
        .put(`/api/todos/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated' })
        .expect(404);
    });

    it('should fail without token', async () => {
      if (!mongoAvailable) return;

      await request(app)
        .put(`/api/todos/${testTodo._id}`)
        .send({ title: 'Updated' })
        .expect(401);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    let testTodo;

    beforeEach(async () => {
      if (mongoAvailable) {
        testTodo = await new Todo({
          title: 'Delete Me',
          user: testUser._id
        }).save();
      }
    });

    it('should delete todo', async () => {
      if (!mongoAvailable) return;

      await request(app)
        .delete(`/api/todos/${testTodo._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const deleted = await Todo.findById(testTodo._id);
      expect(deleted).toBeNull();
    });

    it('should fail with non-existent id', async () => {
      if (!mongoAvailable) return;

      const fakeId = new mongoose.Types.ObjectId();

      await request(app)
        .delete(`/api/todos/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should fail without token', async () => {
      if (!mongoAvailable) return;

      await request(app)
        .delete(`/api/todos/${testTodo._id}`)
        .expect(401);
    });
  });
});
