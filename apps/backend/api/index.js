// Vercel Serverless Function wrapper for Express app
import app, { connectDB } from "../src/app.js";

// Connect to MongoDB on cold start
let dbConnected = false;

// Vercel serverless function handler
export default async function handler(req, res) {
  // Connect to MongoDB if not already connected
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      return res.status(500).json({
        error: "Database connection failed",
        message: error.message,
      });
    }
  }

  // Handle the request with Express app
  return app(req, res);
}
