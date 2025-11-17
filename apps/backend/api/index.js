// Vercel Serverless Function wrapper for Express app
import app, { connectDB } from "../src/app.js";
import serverless from "serverless-http";

// Initialize serverless handler immediately (singleton)
const serverlessHandler = serverless(app, {
  binary: ["image/*", "application/pdf"],
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
  // Get URL from query or path
  const url = req.url || req.query?.url || req.path || "";
  const method = req.method || "GET";
  console.log(`[${new Date().toISOString()}] Request: ${method} ${url}`);
  console.log(`[${new Date().toISOString()}] Request details:`, {
    url: req.url,
    path: req.path,
    query: req.query,
    method: req.method,
  });

  // Handle favicon requests early
  if (
    url === "/favicon.ico" ||
    url === "/favicon.png" ||
    url.includes("favicon")
  ) {
    console.log("Favicon request - returning 204");
    return new Promise((resolve) => {
      res.writeHead(204);
      res.end();
      resolve();
    });
  }

  // For health check, return immediately without Express
  if (
    url === "/health" ||
    url === "/health/" ||
    url.startsWith("/health") ||
    url.includes("/health")
  ) {
    console.log("Health check - returning immediately");
    const response = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: Date.now() - startTime,
    };
    return new Promise((resolve) => {
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      });
      res.end(JSON.stringify(response), () => {
        console.log("Health check - response sent");
        resolve();
      });
    });
  }

  // For root endpoint, return immediately without Express
  if (url === "/" || url === "" || !url) {
    console.log("Root endpoint - returning immediately");
    const response = {
      message: "Todo API Backend",
      version: "1.0.0",
      endpoints: {
        health: "/health",
        healthChecks: "/health-checks",
        apiDocs: "/api-docs",
      },
      timestamp: new Date().toISOString(),
    };
    return new Promise((resolve) => {
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      });
      res.end(JSON.stringify(response), () => {
        console.log("Root endpoint - response sent");
        resolve();
      });
    });
  }

  // Start DB connection in background (non-blocking) for other routes
  ensureDBConnection();

  // Handle request immediately - serverless-http returns a Promise
  try {
    // Wrap in Promise to ensure response is sent
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        if (!res.headersSent) {
          console.error("Timeout: Response not sent after 8 seconds");
          res.status(504).json({ error: "Request timeout" });
          resolve();
        }
      }, 8000);

      serverlessHandler(req, res)
        .then((result) => {
          clearTimeout(timeout);
          const duration = Date.now() - startTime;
          console.log(
            `[${new Date().toISOString()}] Response: ${method} ${url} - ${duration}ms`
          );
          resolve(result);
        })
        .catch((error) => {
          clearTimeout(timeout);
          console.error("Handler error:", error);
          const duration = Date.now() - startTime;
          console.error(
            `[${new Date().toISOString()}] Error: ${method} ${url} - ${duration}ms`
          );
          if (!res.headersSent) {
            res.status(500).json({
              error: "Internal server error",
              message: error.message,
            });
          }
          resolve(); // Don't reject, just resolve to prevent hanging
        });
    });
  } catch (error) {
    console.error("Handler error:", error);
    const duration = Date.now() - startTime;
    console.error(
      `[${new Date().toISOString()}] Error: ${method} ${url} - ${duration}ms`
    );
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    }
    return;
  }
}
