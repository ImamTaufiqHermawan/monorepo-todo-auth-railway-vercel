import app, { connectDB } from "../src/app.js";

// Handler utama untuk Vercel Serverless Functions
// Menggunakan Express app yang sudah di-setup lengkap di src/app.js
// dengan semua middleware (logger, CORS, error handler, 404 handler)
export default async function handler(req, res) {
  try {
    // Koneksi ke MongoDB Atlas
    await connectDB();
    
    // Jalankan Express app untuk handle request
    // App sudah include semua routes, middleware, dan error handlers
    app(req, res);
  } catch (error) {
    // Log error dengan proper logger (akan tampil di Vercel logs)
    console.error('Handler error:', error);
    
    // Return JSON error response
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false,
        error: 'Internal server error',
        message: error.message 
      });
    }
  }
}
