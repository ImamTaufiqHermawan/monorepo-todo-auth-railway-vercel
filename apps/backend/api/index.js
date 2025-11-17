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
  // Start DB connection in background (non-blocking)
  ensureDBConnection();
  
  // Handle request immediately - serverless-http returns a Promise
  try {
    const result = await serverlessHandler(req, res);
    return result;
  } catch (error) {
    console.error("Handler error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    }
    throw error;
  }
}
