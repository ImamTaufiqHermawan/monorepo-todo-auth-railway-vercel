import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { logAuth, logError } from '../utils/logger.js';

const router = express.Router();

// POST /api/auth/register - Endpoint untuk registrasi user baru
router.post(
  '/register',
  [
    // Validasi input: email harus valid dan password minimal 8 karakter
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
  ],
  async (req, res) => {
    try {
      // Cek validasi input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Cek apakah email sudah terdaftar
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        logAuth('register_failed', { email, reason: 'Email already registered' });
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Buat user baru (password akan di-hash otomatis oleh pre-save hook)
      const user = new User({ email, password });
      await user.save();

      // Generate JWT token untuk login otomatis setelah register
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      logAuth('register_success', { userId: user._id, email: user.email });

      // Return success response dengan token
      return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: { id: user._id, email: user.email },
      });
    } catch (error) {
      logError(error, { context: 'auth_register', email: req.body.email });
      if (!res.headersSent) {
        return res.status(500).json({ error: error.message || 'Internal server error' });
      }
    }
  }
);

// POST /api/auth/login - Endpoint untuk login user
router.post(
  '/login',
  [
    // Validasi input: email harus valid dan password harus ada
    body('email').isEmail().normalizeEmail(), 
    body('password').exists()
  ],
  async (req, res) => {
    try {
      // Cek validasi input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Cari user berdasarkan email
      const user = await User.findOne({ email });
      if (!user) {
        logAuth('login_failed', { email, reason: 'User not found' });
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password menggunakan method comparePassword dari User model
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        logAuth('login_failed', { userId: user._id, email, reason: 'Invalid password' });
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token untuk authentication
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      logAuth('login_success', { userId: user._id, email: user.email });

      // Return success response dengan token
      return res.json({
        message: 'Login successful',
        token,
        user: { id: user._id, email: user.email },
      });
    } catch (error) {
      logError(error, { context: 'auth_login', email: req.body.email });
      if (!res.headersSent) {
        return res.status(500).json({ error: error.message || 'Internal server error' });
      }
    }
  }
);

export default router;

