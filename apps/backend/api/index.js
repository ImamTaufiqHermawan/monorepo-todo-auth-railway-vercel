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
  // Get URL from various possible sources
  const url =
    req.url ||
    req.query?.url ||
    req.path ||
    req.headers?.["x-vercel-request-path"] ||
    "";
  const method = req.method || "GET";
  const requestId = Math.random().toString(36).substr(2, 9);

  // Ensure req has the correct URL and path for serverless-http
  // Vercel might pass the path differently
  if (!req.url || req.url === "/") {
    req.url = url;
  }
  if (!req.path) {
    req.path = url.split("?")[0];
  }

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
  // All API routes need DB, except health checks
  const needsDatabase =
    url.startsWith("/api/") ||
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

    // Track response completion using multiple methods
    let responseCompleted = false;

    // Method 1: Intercept res.end
    const originalEnd = res.end;
    res.end = function (...args) {
      // Wrap callback if provided to ensure we resolve
      if (args.length > 0 && typeof args[args.length - 1] === "function") {
        const originalCallback = args[args.length - 1];
        args[args.length - 1] = function (...callbackArgs) {
          originalCallback.apply(this, callbackArgs);
          if (!responseSent && !responseCompleted) {
            responseCompleted = true;
            responseSent = true;
            clearTimeout(timeout);
            const duration = Date.now() - startTime;
            console.log(
              `[REQ-${requestId}] ✅ Response sent (via res.end callback): ${duration}ms | ${method} ${url}`
            );
            resolve();
          }
        };
      }

      if (!responseCompleted) {
        responseCompleted = true;
        clearTimeout(timeout);
        const duration = Date.now() - startTime;
        console.log(
          `[REQ-${requestId}] ✅ Response sent (via res.end): ${duration}ms | ${method} ${url}`
        );
        if (!responseSent) {
          responseSent = true;
          // If no callback, resolve immediately
          if (
            args.length === 0 ||
            typeof args[args.length - 1] !== "function"
          ) {
            setTimeout(() => resolve(), 10);
          }
        }
      }

      return originalEnd.apply(this, args);
    };

    // Method 2: Listen to 'finish' event on response
    res.once("finish", () => {
      if (!responseCompleted) {
        responseCompleted = true;
        clearTimeout(timeout);
        const duration = Date.now() - startTime;
        console.log(
          `[REQ-${requestId}] ✅ Response finished (via finish event): ${duration}ms | ${method} ${url} | Status: ${res.statusCode}`
        );
        if (!responseSent) {
          responseSent = true;
          // Small delay to ensure response is fully sent
          setTimeout(() => resolve(), 10);
        }
      }
    });

    // Method 3: Listen to 'close' event as fallback
    res.once("close", () => {
      if (!responseCompleted) {
        responseCompleted = true;
        clearTimeout(timeout);
        const duration = Date.now() - startTime;
        console.log(
          `[REQ-${requestId}] ✅ Response closed (via close event): ${duration}ms | ${method} ${url} | Status: ${res.statusCode}`
        );
        if (!responseSent) {
          responseSent = true;
          setTimeout(() => resolve(), 10);
        }
      }
    });

    // Method 4: Monitor headersSent property
    let headersSentCheckInterval = setInterval(() => {
      if (res.headersSent && !responseSent && !responseCompleted) {
        responseCompleted = true;
        responseSent = true;
        clearTimeout(timeout);
        clearInterval(headersSentCheckInterval);
        const duration = Date.now() - startTime;
        console.log(
          `[REQ-${requestId}] ✅ Response detected via headersSent check: ${duration}ms | ${method} ${url} | Status: ${res.statusCode}`
        );
        setTimeout(() => resolve(), 10);
      }
    }, 50);

    // Clear interval when response is sent
    res.once("finish", () => clearInterval(headersSentCheckInterval));
    res.once("close", () => clearInterval(headersSentCheckInterval));

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
      console.log(
        `[REQ-${requestId}] [EXPRESS] Before fix - URL: ${req.url}, Path: ${req.path}, Method: ${req.method}`
      );

      // CRITICAL: Ensure req.url and req.path are set correctly for serverless-http
      // serverless-http uses req.url to route, so it MUST be correct
      // Vercel might pass req.url as '/' or undefined, so we fix it here
      const originalUrl = req.url;
      const originalPath = req.path;

      // ALWAYS set the correct URL, path, and method, even if they seem correct
      // serverless-http might modify them, so we ensure they're correct
      const correctUrl = url; // Use the URL we extracted earlier
      const correctPath = url.split("?")[0]; // Remove query string for path
      const correctMethod = method; // Use the method we extracted earlier

      // Set all URL-related properties
      req.url = correctUrl;
      req.path = correctPath;
      req.originalUrl = correctUrl;
      req.method = correctMethod; // CRITICAL: Ensure method doesn't change

      // Also ensure query is set if not present
      if (!req.query) {
        req.query = req.query || {};
      }

      console.log(
        `[REQ-${requestId}] [EXPRESS] After fix - URL: ${req.url}, Path: ${req.path}, OriginalURL: ${req.originalUrl}, Method: ${req.method}`
      );

      // Double-check right before calling serverlessHandler
      if (req.url !== correctUrl || req.method !== correctMethod) {
        console.warn(
          `[REQ-${requestId}] ⚠️ URL or Method changed! Resetting - URL: ${req.url} -> ${correctUrl}, Method: ${req.method} -> ${correctMethod}`
        );
        req.url = correctUrl;
        req.path = correctPath;
        req.originalUrl = correctUrl;
        req.method = correctMethod;
      }

      // Create a proxy to ensure req.url, req.path, and req.method stay correct
      // This prevents serverless-http from modifying them
      const urlGetter = () => correctUrl;
      const pathGetter = () => correctPath;
      const originalUrlGetter = () => correctUrl;
      const methodGetter = () => correctMethod;

      // Override getters to always return correct values
      try {
        Object.defineProperty(req, "url", {
          get: urlGetter,
          set: (val) => {
            console.warn(
              `[REQ-${requestId}] ⚠️ Attempted to change req.url to ${val}, keeping ${correctUrl}`
            );
          },
          configurable: true,
          enumerable: true,
        });
        Object.defineProperty(req, "path", {
          get: pathGetter,
          set: (val) => {
            console.warn(
              `[REQ-${requestId}] ⚠️ Attempted to change req.path to ${val}, keeping ${correctPath}`
            );
          },
          configurable: true,
          enumerable: true,
        });
        Object.defineProperty(req, "originalUrl", {
          get: originalUrlGetter,
          set: (val) => {
            console.warn(
              `[REQ-${requestId}] ⚠️ Attempted to change req.originalUrl to ${val}, keeping ${correctUrl}`
            );
          },
          configurable: true,
          enumerable: true,
        });
        Object.defineProperty(req, "method", {
          get: methodGetter,
          set: (val) => {
            console.warn(
              `[REQ-${requestId}] ⚠️ Attempted to change req.method to ${val}, keeping ${correctMethod}`
            );
          },
          configurable: true,
          enumerable: true,
        });
      } catch (e) {
        console.warn(
          `[REQ-${requestId}] Could not override request properties: ${e.message}`
        );
      }

      const expressStartTime = Date.now();

      // Call serverlessHandler - it returns a promise
      // The promise resolves when the response is sent
      serverlessHandler(req, res)
        .then((result) => {
          const duration = Date.now() - startTime;
          const expressDuration = Date.now() - expressStartTime;
          console.log(
            `[REQ-${requestId}] [EXPRESS] ✅ Handler promise resolved in ${expressDuration}ms (total: ${duration}ms) | headersSent: ${res.headersSent} | responseCompleted: ${responseCompleted} | responseSent: ${responseSent}`
          );

          // If response was already sent via our interceptors/events, don't do anything
          // The interceptors/events will handle resolve()
          if (responseSent || responseCompleted) {
            console.log(
              `[REQ-${requestId}] Response already handled by interceptors/events`
            );
            return;
          }

          // Check if response was sent
          // serverless-http promise should resolve after response is sent, but sometimes it doesn't
          if (res.headersSent) {
            // Headers sent - response should be complete
            if (!responseSent) {
              responseSent = true;
              responseCompleted = true;
              clearTimeout(timeout);
              console.log(
                `[REQ-${requestId}] ✅ Resolving after handler promise resolved (headers sent) (${
                  Date.now() - startTime
                }ms)`
              );
              resolve(result);
            }
          } else {
            // Headers not sent - wait a bit for async operations
            // Sometimes Express sends response asynchronously
            console.log(
              `[REQ-${requestId}] ⚠️ Handler promise resolved but headers not sent, waiting 200ms for async response...`
            );
            setTimeout(() => {
              if (res.headersSent && !responseSent) {
                responseSent = true;
                responseCompleted = true;
                clearTimeout(timeout);
                console.log(
                  `[REQ-${requestId}] ✅ Headers sent after wait, resolving (${
                    Date.now() - startTime
                  }ms)`
                );
                resolve(result);
              } else if (!responseSent) {
                // Still no response - resolve anyway to prevent hanging
                responseSent = true;
                responseCompleted = true;
                clearTimeout(timeout);
                console.log(
                  `[REQ-${requestId}] ⚠️ Still no response after wait, resolving anyway (${
                    Date.now() - startTime
                  }ms)`
                );
                resolve(result);
              }
            }, 200);
          }
        })
        .catch((error) => {
          clearTimeout(timeout);
          if (!responseSent && !res.headersSent) {
            responseSent = true;
            responseCompleted = true;
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
