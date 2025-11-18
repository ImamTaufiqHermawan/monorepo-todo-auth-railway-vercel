import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import mongoose from 'mongoose';
import User from '../../../src/models/User.js';

describe('User Model Tests', () => {
  let mongoAvailable = false;

  // Setup
  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-test';
    
    try {
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 5000
        });
      }
      mongoAvailable = mongoose.connection.readyState === 1;
    } catch (error) {
      console.log('\n⚠️  MongoDB not available - database tests will be skipped');
      console.log('   To run these tests, start MongoDB or set MONGODB_URI\n');
      mongoAvailable = false;
    }
  });

  // Cleanup
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

  describe('User Creation', () => {
    it('should create user with valid data', async () => {
      if (!mongoAvailable) {
        console.log('  ⊘ Skipped - MongoDB not available');
        return;
      }

      const user = new User({
        email: 'test@example.com',
        password: 'password123'
      });

      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.email).toBe('test@example.com');
      expect(savedUser.password).not.toBe('password123');
    });

    it('should hash password', async () => {
      if (!mongoAvailable) return;

      const user = new User({
        email: 'hash-test@example.com',
        password: 'myPassword'
      });

      await user.save();
      expect(user.password).toMatch(/^\$2[ab]\$/);
    });

    it('should fail without email', async () => {
      if (!mongoAvailable) return;

      const user = new User({ password: 'password123' });
      await expect(user.save()).rejects.toThrow();
    });

    it('should fail without password', async () => {
      if (!mongoAvailable) return;

      const user = new User({ email: 'test@example.com' });
      await expect(user.save()).rejects.toThrow();
    });

    it('should fail with duplicate email', async () => {
      if (!mongoAvailable) return;

      await new User({ email: 'duplicate-test@example.com', password: 'password123' }).save();
      const duplicate = new User({ email: 'duplicate-test@example.com', password: 'password456' });
      await expect(duplicate.save()).rejects.toThrow();
    });

    it('should convert email to lowercase', async () => {
      if (!mongoAvailable) return;

      const user = await new User({
        email: 'TEST@EXAMPLE.COM',
        password: 'password123'
      }).save();

      expect(user.email).toBe('test@example.com');
    });
  });

  describe('Password Comparison', () => {
    it('should validate correct password', async () => {
      if (!mongoAvailable) return;

      const user = await new User({
        email: 'test@example.com',
        password: 'password123'
      }).save();

      const isMatch = await user.comparePassword('password123');
      expect(isMatch).toBe(true);
    });

    it('should reject wrong password', async () => {
      if (!mongoAvailable) return;

      const user = await new User({
        email: 'test@example.com',
        password: 'password123'
      }).save();

      const isMatch = await user.comparePassword('wrongpassword');
      expect(isMatch).toBe(false);
    });
  });

  describe('Schema Validation', () => {
    it('should have required fields', () => {
      const requiredFields = User.schema.requiredPaths();
      expect(requiredFields).toContain('email');
      expect(requiredFields).toContain('password');
    });

    it('should have unique email', () => {
      const emailOptions = User.schema.path('email').options;
      expect(emailOptions.unique).toBe(true);
    });
  });

  describe('User Methods', () => {
    it('should not expose password in JSON', async () => {
      if (!mongoAvailable) return;

      const user = await new User({
        email: 'test@example.com',
        password: 'password123'
      }).save();

      const userJSON = user.toJSON();
      expect(userJSON.password).toBeUndefined();
      expect(userJSON.email).toBe('test@example.com');
    });

    it('should find user by email', async () => {
      if (!mongoAvailable) return;

      await new User({
        email: 'test@example.com',
        password: 'password123'
      }).save();

      const found = await User.findOne({ email: 'test@example.com' });
      expect(found).not.toBeNull();
      expect(found.email).toBe('test@example.com');
    });
  });
});
