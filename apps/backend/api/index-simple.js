// SIMPLE Vercel Serverless Function wrapper
import app, { connectDB } from "../src/app.js";
import serverless from "serverless-http";

// Create handler
const handler = serverless(app);

// Ensure DB connection on cold start
connectDB().catch(console.error);

// Export Vercel handler
export default handler;
