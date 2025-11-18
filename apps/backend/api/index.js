import { connectDB } from "../src/app.js";
import authRoutes from "../src/routes/auth.js";
import todoRoutes from "../src/routes/todos.js";
import express from "express";
import cors from "cors";

// Fungsi untuk membuat instance Express app baru di setiap request
// Pattern ini diperlukan untuk Vercel Serverless Functions karena setiap request adalah eksekusi terpisah
const createApp = () => {
  const app = express();
  
  // Middleware untuk CORS - mengizinkan request dari domain lain
  app.use(cors());
  
  // Middleware untuk parsing JSON body dengan limit 10mb
  app.use(express.json({ limit: '10mb' }));
  
  // Routes untuk authentication (register, login)
  app.use('/api/auth', authRoutes);
  
  // Routes untuk Todo CRUD operations (protected dengan JWT)
  app.use('/api/todos', todoRoutes);
  
  // Endpoint untuk health check - mengecek apakah API masih berjalan
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  
  // Endpoint root - menampilkan informasi API
  app.get('/', (req, res) => {
    res.json({ 
      message: 'Todo API Backend',
      version: '1.0.0',
      endpoints: { health: '/health', auth: '/api/auth', todos: '/api/todos' }
    });
  });
  
  return app;
};

// Handler utama untuk Vercel Serverless Functions
// Setiap request akan menjalankan fungsi ini
export default async function handler(req, res) {
  try {
    // Koneksi ke MongoDB Atlas
    await connectDB();
    
    // Buat instance Express app baru untuk request ini
    const app = createApp();
    
    // Jalankan Express app untuk handle request
    app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: error.message });
  }
}
