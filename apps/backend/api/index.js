// Vercel Serverless Function wrapper for Express app
import app, { connectDB } from "../src/app.js";
import serverless from "serverless-http";

// Initialize serverless handler immediately (singleton)
const serverlessHandler = serverless(app, {
  binary: ['image/*', 'application/pdf'],
});

// Connect to MongoDB in background (non-blocking, fire-and-forget)
let connectionPromise = null;

const ensureDBConnection = () => {
  // Only start connection if not already connecting/connected
  if (!connectionPromise) {
    connectionPromise = connectDB()
      .then(() => {
        console.log("✅ MongoDB connected successfully");
      })
      .catch((error) => {
        console.error("❌ Failed to connect to MongoDB:", error.message);
        // Reset promise so we can retry on next request
        connectionPromise = null;
      });
  }
  // Don't await - let it run in background
  return connectionPromise;
};

// Vercel serverless function handler
export default async function handler(req, res) {
  const startTime = Date.now();
  const url = req.url || req.path || '';
  const method = req.method || 'GET';
  console.log(`[${new Date().toISOString()}] Request: ${method} ${url}`);
  
  // Handle favicon requests early
  if (url === '/favicon.ico' || url === '/favicon.png' || url.includes('favicon')) {
    console.log('Favicon request - returning 204');
    res.status(204).end();
    return;
  }
  
  // For health check, return immediately without Express
  if (url === '/health' || url === '/health/' || url.startsWith('/health')) {
    console.log('Health check - returning immediately');
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: Date.now() - startTime,
    });
    return;
  }
  
  // Start DB connection in background (non-blocking) for other routes
  ensureDBConnection();
  
  // Handle request immediately - serverless-http returns a Promise
  try {
    const result = await serverlessHandler(req, res);
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] Response: ${method} ${url} - ${duration}ms`);
    return result;
  } catch (error) {
    console.error("Handler error:", error);
    const duration = Date.now() - startTime;
    console.error(`[${new Date().toISOString()}] Error: ${method} ${url} - ${duration}ms`);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    }
    throw error;
  }
}
