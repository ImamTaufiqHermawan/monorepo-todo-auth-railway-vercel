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
  // Store the ORIGINAL method from the request - this is critical for POST/PUT/DELETE
  // Vercel passes the correct method in req.method initially
  const originalMethod = req.method || "GET";
  const method = originalMethod;
  const requestId = Math.random().toString(36).substr(2, 9);

  // Note: We cannot modify req.url or req.path directly as they are read-only getters
  // We'll handle URL correction later using a Proxy if needed

  console.log(
    `[REQ-${requestId}] [${new Date().toISOString()}] ${method} ${url}`
  );
  console.log(
    `[REQ-${requestId}] ORIGINAL METHOD FROM VERCEL: ${originalMethod} (preserved for routing)`
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

  // Process request without wrapping in Promise - Vercel handles response completion
  const TIMEOUT_MS = 25000;
  let timeoutHandle;
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
        })
      );
      console.log(`[REQ-${requestId}] Timeout sent`);
    }
  }, TIMEOUT_MS);

  timeoutHandle = timeout;

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
        `[REQ-${requestId}] [EXPRESS] Request details - URL: ${
          req.url
        }, Path: ${req.path || "N/A"}, Method: ${req.method}, OriginalURL: ${
          req.originalUrl || "N/A"
        }`
      );

      // CRITICAL: serverless-http needs the correct URL to route properly
      // Vercel might pass req.url as '/' or the full path, so we need to ensure it's correct
      // However, we CANNOT modify req.url directly as it's a read-only getter
      // We'll use a Proxy to intercept property access and prevent modification attempts

      const currentUrl = req.url || "/";
      const correctUrl = url; // Use the URL we extracted earlier
      const correctPath = correctUrl.split("?")[0]; // Remove query string for path
      
      // CRITICAL FIX: Use originalMethod captured at the very start
      // DO NOT read req.method here as it might have been mutated
      const correctMethod = originalMethod; // Use originalMethod from handler start

      // CRITICAL: serverless-http creates a new request object, losing our modifications
      // Solution: Pass the correct method via custom header that Express middleware can read
      // This is the ONLY reliable way to preserve the HTTP method through serverless-http
      if (!req.headers) {
        req.headers = {};
      }
      req.headers['x-original-method'] = correctMethod;
      req.headers['x-vercel-method-override'] = correctMethod;
      console.log(`[REQ-${requestId}] [METHOD-HEADER] Set x-original-method header to: ${correctMethod}`);
      
      // DEBUG: Log request body for debugging 400 errors
      if (req.body) {
        console.log(`[REQ-${requestId}] [BODY] Request body:`, JSON.stringify(req.body));
      } else {
        console.log(`[REQ-${requestId}] [BODY] No request body found`);
      }

      // Always use a Proxy to protect against attempts to modify read-only properties
      // This prevents errors when Express/serverless-http tries to modify req.url, req.method, etc.
      const requestProxy = new Proxy(req, {
        get(target, prop) {
          // Intercept read access to url/path/originalUrl/method to ensure correct values
          if (prop === "url") {
            // If current URL is wrong, return correct one; otherwise return current
            return currentUrl === "/" && correctUrl !== "/"
              ? correctUrl
              : target.url;
          }
          if (prop === "path") {
            const urlToUse =
              currentUrl === "/" && correctUrl !== "/"
                ? correctUrl
                : target.url || currentUrl;
            return urlToUse.split("?")[0];
          }
          if (prop === "originalUrl") {
            return currentUrl === "/" && correctUrl !== "/"
              ? correctUrl
              : target.originalUrl || target.url || correctUrl;
          }
          if (prop === "method") {
            // CRITICAL: Always return the originalMethod we captured at handler start
            // This prevents POST from being changed to GET by middleware/serverless-http
            console.log(`[REQ-${requestId}] [PROXY] Intercepting method access, returning: ${correctMethod} (original from Vercel)`);
            return correctMethod;
          }
          // For all other properties, return the original value
          return target[prop];
        },
        set(target, prop, value) {
          // Prevent setting read-only properties (url, path, originalUrl, method)
          // This prevents the "Cannot set property url" error and method changes
          if (
            prop === "url" ||
            prop === "path" ||
            prop === "originalUrl" ||
            prop === "method"
          ) {
            console.warn(
              `[REQ-${requestId}] ⚠️ Attempted to set req.${prop} to ${value}, ignoring (read-only property, keeping ${
                prop === "method" ? correctMethod : correctUrl
              })`
            );
            return true; // Pretend we set it successfully to prevent errors
          }
          // Allow setting other properties normally
          target[prop] = value;
          return true;
        },
        defineProperty(target, prop, descriptor) {
          // Prevent redefining read-only properties
          if (
            prop === "url" ||
            prop === "path" ||
            prop === "originalUrl" ||
            prop === "method"
          ) {
            console.warn(
              `[REQ-${requestId}] ⚠️ Attempted to defineProperty req.${prop}, ignoring (read-only property)`
            );
            return true; // Pretend success
          }
          return Reflect.defineProperty(target, prop, descriptor);
        },
      });

      // Use the proxy instead of the original req
      req = requestProxy;
      console.log(
        `[REQ-${requestId}] [EXPRESS] Using protected request proxy - URL: ${req.url}, Path: ${req.path}, OriginalURL: ${req.originalUrl}, Method: ${req.method}`
      );

      // Ensure query is set if not present
      if (!req.query) {
        req.query = {};
      }

      const expressStartTime = Date.now();

    // Call serverlessHandler - it handles the response internally
    // Don't await, just let it run and Vercel will detect when res.end() is called
    serverlessHandler(req, res)
      .then(() => {
        // Clear timeout after successful completion
        if (!responseSent) {
          responseSent = true;
          clearTimeout(timeoutHandle);
          const duration = Date.now() - startTime;
          console.log(
            `[REQ-${requestId}] ✅ serverlessHandler completed: ${duration}ms | ${method} ${url} | Status: ${res.statusCode}`
          );
        }
      })
      .catch((error) => {
        clearTimeout(timeoutHandle);
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
            })
          );
        }
      });
  } catch (setupError) {
    clearTimeout(timeoutHandle);
    if (!responseSent && !res.headersSent) {
      responseSent = true;
      const duration = Date.now() - startTime;
      console.error(
        `[REQ-${requestId}] [SETUP] ❌ Error during setup after ${duration}ms: ${
          setupError.message || setupError
        }`
      );
      res.writeHead(503, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      });
      res.end(
        JSON.stringify({
          error: "Service unavailable",
          message: setupError.message,
          path: url,
          method,
          requestId,
        })
      );
    }
  }
}
