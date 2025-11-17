import { connectDB } from "../src/app.js";
import authRoutes from "../src/routes/auth.js";
import todoRoutes from "../src/routes/todos.js";
import express from "express";
import cors from "cors";

// Create Express app per request (serverless pattern)
const createApp = () => {
  const app = express();
  
  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  
  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/todos', todoRoutes);
  
  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  
  // Root
  app.get('/', (req, res) => {
    res.json({ 
      message: 'Todo API Backend',
      version: '1.0.0',
      endpoints: { health: '/health', auth: '/api/auth', todos: '/api/todos' }
    });
  });
  
  return app;
};

// Vercel serverless handler
export default async function handler(req, res) {
  try {
    // Connect to DB
    await connectDB();
    
    // Create app instance
    const app = createApp();
    
    // Handle request
    app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: error.message });
  }
}
