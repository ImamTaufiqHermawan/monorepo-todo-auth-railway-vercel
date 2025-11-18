import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import Todo from '../models/Todo.js';
import { logDB, logError, logInfo } from '../utils/logger.js';

const router = express.Router();

// Semua routes di file ini memerlukan authentication (JWT token)
router.use(authenticate);

// GET /api/todos - Ambil semua todos milik user yang sedang login
router.get('/', async (req, res) => {
  try {
    // Query todos berdasarkan user ID, sort by createdAt descending (terbaru dulu)
    const todos = await Todo.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    logDB('find', { collection: 'todos', userId: req.user._id, count: todos.length });
    return res.json(todos);
  } catch (error) {
    logError(error, { context: 'todos_list', userId: req.user._id });
    if (!res.headersSent) {
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
});

// POST /api/todos - Buat todo baru
router.post(
  '/',
  [
    // Validasi: title tidak boleh kosong
    body('title').trim().notEmpty()
  ],
  async (req, res) => {
    try {
      // Cek validasi input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Buat todo baru dengan title dari request dan user ID dari token
      const todo = new Todo({
        title: req.body.title,
        user: req.user._id,
      });
      await todo.save();
      
      logDB('create', { collection: 'todos', todoId: todo._id, userId: req.user._id, title: todo.title });
      return res.status(201).json(todo);
    } catch (error) {
      logError(error, { context: 'todos_create', userId: req.user._id });
      if (!res.headersSent) {
        return res.status(500).json({ error: error.message || 'Internal server error' });
      }
    }
  }
);

// PUT /api/todos/:id - Update todo (title atau completed status)
router.put('/:id', async (req, res) => {
  try {
    // Cari todo berdasarkan ID dan user ID (pastikan user hanya bisa update todo miliknya)
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Update field yang dikirim (title atau completed)
    if (req.body.title !== undefined) todo.title = req.body.title;
    if (req.body.completed !== undefined) todo.completed = req.body.completed;

    await todo.save();
    logDB('update', { collection: 'todos', todoId: todo._id, userId: req.user._id, changes: req.body });
    return res.json(todo);
  } catch (error) {
    logError(error, { context: 'todos_update', userId: req.user._id, todoId: req.params.id });
    if (!res.headersSent) {
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
});

// DELETE /api/todos/:id - Hapus todo
router.delete('/:id', async (req, res) => {
  try {
    // Cari dan hapus todo berdasarkan ID dan user ID
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    logDB('delete', { collection: 'todos', todoId: todo._id, userId: req.user._id });
    return res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    logError(error, { context: 'todos_delete', userId: req.user._id, todoId: req.params.id });
    if (!res.headersSent) {
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
});

export default router;

