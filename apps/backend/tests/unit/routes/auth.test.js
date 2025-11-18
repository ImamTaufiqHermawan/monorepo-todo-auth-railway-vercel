import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import mongoose from 'mongoose';
import request from 'supertest';
import express from 'express';
import authRoutes from '../../../src/routes/auth.js';
import User from '../../../src/models/User.js';

describe('Auth Routes Tests', () => {
  let app;
  let mongoAvailable = false;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-test';
    
    try {
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 5000
        });
      }
      mongoAvailable = mongoose.connection.readyState === 1;

      // Setup Express app
      app = express();
      app.use(express.json());
      app.use('/api/auth', authRoutes);
    } catch (error) {
      console.log('\n⚠️  MongoDB not available - route tests will be skipped\n');
      mongoAvailable = false;
    }
  });

  afterAll(async () => {
    if (mongoAvailable) {
      await User.deleteMany({});
      await mongoose.connection.close();
    }
  });

  beforeEach(async () => {
    if (mongoAvailable) {
      await User.deleteMany({});
    }
  });

  describe('POST /api/auth/register', () => {
    it('should register new user', async () => {
      if (!mongoAvailable) return;

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should fail with duplicate email', async () => {
      if (!mongoAvailable) return;

      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(400);
    });

    it('should fail with invalid email', async () => {
      if (!mongoAvailable) return;

      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123'
        })
        .expect(400);
    });

    it('should fail with short password', async () => {
      if (!mongoAvailable) return;

      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: '123'
        })
        .expect(400);
    });

    it('should normalize email', async () => {
      if (!mongoAvailable) return;

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'TEST@EXAMPLE.COM',
          password: 'password123'
        })
        .expect(201);

      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should not expose password', async () => {
      if (!mongoAvailable) return;

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.body.user.password).toBeUndefined();
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      if (mongoAvailable) {
        await request(app)
          .post('/api/auth/register')
          .send({
            email: 'test@example.com',
            password: 'password123'
          });
      }
    });

    it('should login with valid credentials', async () => {
      if (!mongoAvailable) return;

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should fail with wrong password', async () => {
      if (!mongoAvailable) return;

      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401);
    });

    it('should fail with non-existent email', async () => {
      if (!mongoAvailable) return;

      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);
    });

    it('should fail with invalid email', async () => {
      if (!mongoAvailable) return;

      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'password123'
        })
        .expect(400);
    });

    it('should not expose password', async () => {
      if (!mongoAvailable) return;

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.body.user.password).toBeUndefined();
    });
  });
});
