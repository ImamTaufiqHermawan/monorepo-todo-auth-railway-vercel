// Vercel Serverless Function wrapper for Express app
import app, { connectDB } from "../src/app.js";
import serverless from "serverless-http";

// Connect to MongoDB on cold start
let dbConnected = false;
let serverlessHandler = null;

// Initialize serverless handler
const initServerless = async () => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }
  
  if (!serverlessHandler) {
    serverlessHandler = serverless(app);
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
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}
