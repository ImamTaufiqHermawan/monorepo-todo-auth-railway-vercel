// Vercel Serverless Function wrapper for Express app
import app, { connectDB } from "../src/app.js";
import serverless from "serverless-http";

// Connect to MongoDB on cold start
let dbConnected = false;
let dbConnecting = false;
let serverlessHandler = null;

// Initialize serverless handler with timeout
const initServerless = async () => {
  // Initialize serverless handler first (non-blocking)
  if (!serverlessHandler) {
    serverlessHandler = serverless(app, {
      binary: ['image/*', 'application/pdf'],
    });
  }
  
  // Connect to DB in background (non-blocking)
  if (!dbConnected && !dbConnecting) {
    dbConnecting = true;
    connectDB()
      .then(() => {
        dbConnected = true;
        dbConnecting = false;
        console.log("✅ MongoDB connected successfully");
      })
      .catch((error) => {
        dbConnecting = false;
        console.error("❌ Failed to connect to MongoDB:", error.message);
        // Don't throw - let requests continue, they'll handle DB errors
      });
  }
  
  return serverlessHandler;
};

// Vercel serverless function handler
export default async function handler(req, res) {
  try {
    const handler = await initServerless();
    return handler(req, res);
  } catch (error) {
    console.error("Serverless handler error:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    }
  }
}
