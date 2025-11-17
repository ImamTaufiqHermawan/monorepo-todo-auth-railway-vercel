import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
// Swagger imports - lazy load untuk menghindari blocking
// import swaggerJsdoc from "swagger-jsdoc";
// import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/auth.js";
import todoRoutes from "./routes/todos.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Swagger configuration - lazy load untuk menghindari blocking
let swaggerSpec = null;
const getSwaggerSpec = async () => {
  if (!swaggerSpec) {
    const swaggerJsdoc = (await import('swagger-jsdoc')).default;
    const swaggerOptions = {
      definition: {
        openapi: "3.1.0",
        info: {
          title: "Todo API",
          version: "1.0.0",
          description: "Todo Application API with Authentication",
        },
        servers: [
          {
            url: process.env.API_URL || `http://localhost:${PORT}`,
            description: "API server",
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
      },
      apis: ["./src/routes/*.js"],
    };
    swaggerSpec = swaggerJsdoc(swaggerOptions);
  }
  return swaggerSpec;
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Handle favicon requests early
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

app.get('/favicon.png', (req, res) => {
  res.status(204).end();
});

// Swagger UI - disabled untuk testing, enable jika diperlukan
// Swagger UI bisa menyebabkan blocking di serverless
if (process.env.ENABLE_SWAGGER === 'true') {
  app.get("/api-docs", async (req, res, next) => {
    try {
      const swaggerUiModule = await import('swagger-ui-express');
      const spec = await getSwaggerSpec();
      swaggerUiModule.default.setup(spec, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: "Todo API Documentation"
      })(req, res, next);
    } catch (error) {
      res.status(500).json({ error: 'Failed to load Swagger UI' });
    }
  });
} else {
  app.get("/api-docs", async (req, res) => {
    try {
      const spec = await getSwaggerSpec();
      res.json({ 
        message: "Swagger UI disabled. Set ENABLE_SWAGGER=true to enable.",
        spec 
      });
    } catch (error) {
      res.json({ 
        message: "Swagger UI disabled. Set ENABLE_SWAGGER=true to enable.",
        error: error.message 
      });
    }
  });
}

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Todo API Backend",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      healthChecks: "/health-checks",
      apiDocs: "/api-docs",
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        profile: "GET /api/auth/profile",
      },
      todos: {
        list: "GET /api/todos",
        create: "POST /api/todos",
        get: "GET /api/todos/:id",
        update: "PUT /api/todos/:id",
        delete: "DELETE /api/todos/:id",
      },
    },
    timestamp: new Date().toISOString(),
  });
});

// Health check - super simple, no blocking
app.get("/health", (req, res) => {
  // Immediately send response, no async operations
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Detailed health checks
app.get("/health-checks", async (req, res) => {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "1.0.0",
    checks: {
      api: {
        status: "ok",
        message: "API is running",
      },
      database: {
        status: "unknown",
        message: "Checking database connection...",
      },
      memory: {
        status: "ok",
        used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
        total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
        unit: "MB",
      },
    },
  };

  // Check database connection
  try {
    if (mongoose.connection.readyState === 1) {
      health.checks.database = {
        status: "ok",
        message: "Database connected",
        state: "connected",
      };
    } else if (mongoose.connection.readyState === 2) {
      health.checks.database = {
        status: "warning",
        message: "Database connecting",
        state: "connecting",
      };
    } else {
      health.checks.database = {
        status: "error",
        message: "Database not connected",
        state: "disconnected",
      };
      health.status = "degraded";
    }
  } catch (error) {
    health.checks.database = {
      status: "error",
      message: error.message,
      state: "error",
    };
    health.status = "degraded";
  }

  // Check environment variables
  const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];
  const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);
  
  if (missingEnvVars.length > 0) {
    health.checks.environment = {
      status: "warning",
      message: `Missing environment variables: ${missingEnvVars.join(", ")}`,
      missing: missingEnvVars,
    };
    if (health.status === "ok") {
      health.status = "degraded";
    }
  } else {
    health.checks.environment = {
      status: "ok",
      message: "All required environment variables are set",
    };
  }

  // Set HTTP status code based on health status
  const statusCode = health.status === "ok" ? 200 : health.status === "degraded" ? 200 : 503;

  res.status(statusCode).json(health);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// 404 handler - improved with more details
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `The requested endpoint ${req.method} ${req.path} does not exist`,
    path: req.path,
    method: req.method,
    availableEndpoints: {
      health: "GET /health",
      healthChecks: "GET /health-checks",
      apiDocs: "GET /api-docs",
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        profile: "GET /api/auth/profile",
      },
      todos: {
        list: "GET /api/todos",
        create: "POST /api/todos",
        get: "GET /api/todos/:id",
        update: "PUT /api/todos/:id",
        delete: "DELETE /api/todos/:id",
      },
    },
    timestamp: new Date().toISOString(),
  });
});

// MongoDB connection helper
let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  // Check if already connecting
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    console.log("MongoDB already connected (readyState: 1)");
    return;
  }

  if (mongoose.connection.readyState === 2) {
    console.log("MongoDB connection in progress (readyState: 2)");
    // Don't wait - connection is already in progress
    // Return immediately, connection will complete in background
    return;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    const error = new Error("MONGODB_URI environment variable is not set");
    console.error("❌", error.message);
    throw error;
  }

  console.log(`Attempting to connect to MongoDB...`);
  console.log(
    `MongoDB URI: ${mongoUri.replace(/\/\/([^:]+):([^@]+)@/, "//$1:***@")}`
  );

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000, // Very short timeout for serverless
      socketTimeoutMS: 20000,
      connectTimeoutMS: 3000,
      maxPoolSize: 1, // Single connection for serverless
      minPoolSize: 1,
    });
    isConnected = true;
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:");
    console.error("Error message:", error.message);
    console.error("Error name:", error.name);
    if (error.message.includes("authentication failed")) {
      console.error("💡 Tip: Check your MongoDB credentials in MONGODB_URI");
    } else if (
      error.message.includes("ENOTFOUND") ||
      error.message.includes("getaddrinfo")
    ) {
      console.error("💡 Tip: Check your MongoDB connection string format");
    } else if (error.message.includes("timeout")) {
      console.error(
        "💡 Tip: MongoDB server might be unreachable or network issue"
      );
    }
    console.error("Full error:", error);
    throw error;
  }
};

// Start server (only for traditional deployment)
export const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 API Documentation: http://0.0.0.0:${PORT}/api-docs`);
      console.log(`❤️  Health check: http://0.0.0.0:${PORT}/health`);
    });
  } catch (error) {
    console.error(
      "⚠️  Application will exit. Please check your MONGODB_URI environment variable."
    );
    process.exit(1);
  }
};

export default app;
