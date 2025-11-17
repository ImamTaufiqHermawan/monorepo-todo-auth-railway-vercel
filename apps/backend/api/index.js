// SIMPLE Vercel Serverless Function wrapper
import app, { connectDB } from "../src/app.js";
import serverless from "serverless-http";

// Create handler with proper options
const handler = serverless(app, {
  binary: false,
  request: null,
  response: null,
});

// Export handler that ensures DB connection
export default async function(req, res) {
  // Ensure MongoDB is connected before handling request
  await connectDB();
  
  // Let serverless-http handle the request
  return handler(req, res);
};
