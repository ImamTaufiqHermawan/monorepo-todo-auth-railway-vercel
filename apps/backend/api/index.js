// Vercel Serverless Function wrapper for Express app
import app, { connectDB } from "../src/app.js";
import serverless from "serverless-http";
import mongoose from "mongoose";

// Initialize serverless handler immediately (singleton)
const serverlessHandler = serverless(app, {
  binary: ["image/*", "application/pdf"],
});

// Connect to MongoDB in background (non-blocking, fire-and-forget)
let connectionPromise = null;
let connectionAttempts = 0;

const getConnectionStateLabel = (state) => {
  const labels = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  return labels[state] || "unknown";
};

const ensureDBConnection = async () => {
  const connState = mongoose.connection.readyState;
  const connStateLabel = getConnectionStateLabel(connState);

  // Check if already connected
  if (connState === 1) {
    console.log(`[DB] ✅ Already connected (state: ${connStateLabel})`);
    return;
  }

  // If already connecting, wait for it
  if (connectionPromise) {
    console.log(
      `[DB] ⏳ Connection in progress (state: ${connStateLabel}), waiting...`
    );
    try {
      await connectionPromise;
      console.log(`[DB] ✅ Waited for in-progress connection, now ready`);
      return;
    } catch (error) {
      // Connection failed, reset and retry
      console.error(`[DB] ❌ Waiting for connection failed: ${error.message}`);
      connectionPromise = null;
      throw error;
    }
  }

  // Start new connection
  connectionAttempts++;
  const attemptNum = connectionAttempts;
  console.log(
    `[DB] 🔄 Starting new connection attempt #${attemptNum} (current state: ${connStateLabel})`
  );

  connectionPromise = connectDB()
    .then(() => {
      console.log(`[DB] ✅ Connection attempt #${attemptNum} succeeded`);
    })
    .catch((error) => {
      console.error(
        `[DB] ❌ Connection attempt #${attemptNum} failed: ${error.message}`
      );
      // Reset promise so we can retry on next request
      connectionPromise = null;
      throw error;
    });

  // Wait for connection to complete
  await connectionPromise;
};

// Vercel serverless function handler
export default async function handler(req, res) {
  const startTime = Date.now();
  const url = req.url || req.query?.url || req.path || "";
  const method = req.method || "GET";
  const requestId = Math.random().toString(36).substr(2, 9);

  console.log(
    `[REQ-${requestId}] [${new Date().toISOString()}] ${method} ${url}`
  );
  console.log(
    `[REQ-${requestId}] Auth: ${
      req.headers.authorization ? "✓ Bearer" : "✗ None"
    }, ContentType: ${req.headers["content-type"] || "none"}`
  );

  // Handle favicon early
  if (
    url === "/favicon.ico" ||
    url === "/favicon.png" ||
    url.includes("favicon")
  ) {
    console.log(`[REQ-${requestId}] [FAVICON] Returning 204`);
    res.writeHead(204);
    res.end();
    return;
  }

  // Health and root endpoints - immediate responses
  if (
    url === "/health" ||
    url === "/health/" ||
    url.startsWith("/health") ||
    url.includes("/health")
  ) {
    console.log(`[REQ-${requestId}] [HEALTH] Immediate response`);
    const response = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: Date.now() - startTime,
    };
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
    res.end(JSON.stringify(response));
    console.log(
      `[REQ-${requestId}] [HEALTH] Sent 200 (${Date.now() - startTime}ms)`
    );
    return;
  }

  if (url === "/" || url === "" || !url) {
    console.log(`[REQ-${requestId}] [ROOT] Immediate response`);
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
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
    res.end(JSON.stringify(response));
    console.log(
      `[REQ-${requestId}] [ROOT] Sent 200 (${Date.now() - startTime}ms)`
    );
    return;
  }

  // Determine whether this route needs DB
  const needsDatabase =
    url.startsWith("/api/auth") ||
    url.startsWith("/api/todos") ||
    url.startsWith("/api-docs") ||
    url.startsWith("/health-checks");

  console.log(
    `[REQ-${requestId}] Route type: ${
      needsDatabase ? "REQUIRES_DB" : "STATELESS"
    }`
  );

  // Start a safety timeout immediately so we never get killed by Vercel after a long hang.
  return new Promise(async (resolve) => {
    const TIMEOUT_MS = 10000; // 10s safety guard
    let responseSent = false;

    const timeout = setTimeout(() => {
      if (!responseSent && !res.headersSent) {
        responseSent = true;
        console.error(
          `[REQ-${requestId}] ⏱️  TIMEOUT after ${TIMEOUT_MS}ms: Response not sent for ${method} ${url}`
        );
        res.writeHead(504, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        });
        res.end(
          JSON.stringify({
            error: "Request timeout",
            message: "The request took too long to process",
            path: url,
            method,
            requestId,
            timeout_ms: TIMEOUT_MS,
          }),
          () => {
            console.log(`[REQ-${requestId}] Sent 504 timeout response`);
            resolve();
          }
        );
      }
    }, TIMEOUT_MS);

    // Intercept res.end to clear timeout and log duration
    const originalEnd = res.end;
    res.end = function (...args) {
      if (!responseSent) {
        responseSent = true;
        clearTimeout(timeout);
        const duration = Date.now() - startTime;
        console.log(
          `[REQ-${requestId}] ✅ Response sent: ${duration}ms | ${method} ${url}`
        );
      }
      return originalEnd.apply(this, args);
    };

    try {
      if (needsDatabase) {
        console.log(
          `[REQ-${requestId}] [DB] Waiting for MongoDB connection (timeout: 5s)...`
        );
        const dbStartTime = Date.now();

        // Race DB connect with a shorter DB timeout so we don't hang forever
        // Reduced to 5 seconds to match MongoDB timeout
        await Promise.race([
          ensureDBConnection(),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("DB connect timeout after 5s")),
              5000
            )
          ),
        ]);

        const dbDuration = Date.now() - dbStartTime;
        console.log(`[REQ-${requestId}] [DB] ✅ Connected in ${dbDuration}ms`);
      } else {
        // Fire-and-forget DB connection for non-db routes
        console.log(
          `[REQ-${requestId}] [DB] Starting background connection (non-blocking)`
        );
        ensureDBConnection().catch((err) => {
          console.warn(
            `[REQ-${requestId}] [DB] Background connection failed: ${
              err.message || err
            }`
          );
        });
      }

      // Now handle request with serverless-http
      console.log(`[REQ-${requestId}] [EXPRESS] Routing to Express handler...`);
      const expressStartTime = Date.now();

      serverlessHandler(req, res)
        .then((result) => {
          clearTimeout(timeout);
          if (!responseSent) {
            responseSent = true;
            const duration = Date.now() - startTime;
            const expressDuration = Date.now() - expressStartTime;
            console.log(
              `[REQ-${requestId}] [EXPRESS] ✅ Completed in ${expressDuration}ms (total: ${duration}ms)`
            );
          }
          resolve(result);
        })
        .catch((error) => {
          clearTimeout(timeout);
          if (!responseSent && !res.headersSent) {
            responseSent = true;
            const duration = Date.now() - startTime;
            console.error(
              `[REQ-${requestId}] [EXPRESS] ❌ Error after ${duration}ms: ${error.message}`
            );
            res.writeHead(500, {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            });
            res.end(
              JSON.stringify({
                error: "Internal server error",
                message: error.message,
                path: url,
                method,
                requestId,
              }),
              () => {
                console.log(`[REQ-${requestId}] Sent 500 error response`);
                resolve();
              }
            );
          } else {
            resolve();
          }
        });
    } catch (error) {
      clearTimeout(timeout);
      if (!responseSent && !res.headersSent) {
        responseSent = true;
        const duration = Date.now() - startTime;
        console.error(
          `[REQ-${requestId}] [SETUP] ❌ Error during setup after ${duration}ms: ${
            error.message || error
          }`
        );
        res.writeHead(503, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        });
        res.end(
          JSON.stringify({
            error: "Service unavailable",
            message: error.message,
            path: url,
            method,
            requestId,
          }),
          () => {
            console.log(
              `[REQ-${requestId}] Sent 503 service-unavailable response`
            );
            resolve();
          }
        );
      } else {
        resolve();
      }
    }
  });
}
