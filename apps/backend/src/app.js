import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import todoRoutes from "./routes/todos.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { logInfo, logError, logDB } from "./utils/logger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware CORS untuk mengizinkan request dari frontend (harus paling awal)
app.use(cors());

// Middleware untuk parsing JSON body dengan limit 10mb
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware untuk logging semua request
app.use(requestLogger);

// Handle request favicon agar tidak error 404
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

app.get('/favicon.png', (req, res) => {
  res.status(204).end();
});

// Root endpoint - menampilkan informasi API
app.get("/", (req, res) => {
  res.json({
    message: "Todo API Backend",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      healthChecks: "/health-checks",
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
      },
      todos: {
        list: "GET /api/todos",
        create: "POST /api/todos",
        update: "PUT /api/todos/:id",
        delete: "DELETE /api/todos/:id",
      },
    },
    timestamp: new Date().toISOString(),
  });
});

// Health check sederhana untuk monitoring
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Health check detail - cek database, memory, dan environment
app.get("/health-checks", async (req, res) => {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    checks: {
      api: {
        status: "ok",
        message: "API berjalan normal",
      },
      database: {
        status: "unknown",
        message: "Mengecek koneksi database...",
      },
      memory: {
        status: "ok",
        used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
        total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
        unit: "MB",
      },
    },
  };

  // Cek status koneksi database MongoDB
  try {
    if (mongoose.connection.readyState === 1) {
      health.checks.database = {
        status: "ok",
        message: "Database terkoneksi",
        state: "connected",
      };
    } else if (mongoose.connection.readyState === 2) {
      health.checks.database = {
        status: "warning",
        message: "Database sedang connecting",
        state: "connecting",
      };
    } else {
      health.checks.database = {
        status: "error",
        message: "Database tidak terkoneksi",
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

  // Cek environment variables yang diperlukan
  const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];
  const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);
  
  if (missingEnvVars.length > 0) {
    health.checks.environment = {
      status: "warning",
      message: `Environment variables yang hilang: ${missingEnvVars.join(", ")}`,
      missing: missingEnvVars,
    };
    if (health.status === "ok") {
      health.status = "degraded";
    }
  } else {
    health.checks.environment = {
      status: "ok",
      message: "Semua environment variables sudah diset",
    };
  }

  const statusCode = health.status === "ok" ? 200 : health.status === "degraded" ? 200 : 503;
  res.status(statusCode).json(health);
});

// Routes untuk authentication dan todos
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// Error handling middleware - harus setelah semua routes
app.use((err, req, res, next) => {
  logError(err, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  });
  
  if (!res.headersSent) {
    return res.status(err.status || 500).json({
      success: false,
      error: err.message || "Internal server error",
      timestamp: new Date().toISOString()
    });
  }
  next(err);
});

// 404 handler - harus paling terakhir
// Handler untuk semua route yang tidak ditemukan
app.use((req, res, next) => {
  // Set Content-Type ke JSON untuk mencegah HTML response
  res.setHeader('Content-Type', 'application/json');
  
  return res.status(404).json({
    success: false,
    error: "Not Found",
    message: `Endpoint ${req.method} ${req.path} tidak ditemukan`,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});// Helper untuk koneksi MongoDB
// Flag untuk tracking apakah sudah terkoneksi (penting untuk serverless)
let isConnected = false;

export const connectDB = async () => {
  // Jika sudah terkoneksi, skip
  if (isConnected) {
    return;
  }

  // Cek readyState: 1 = connected, 2 = connecting, 0 = disconnected
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  // Jika sedang proses connecting, tunggu sampai selesai
  if (mongoose.connection.readyState === 2) {
    return new Promise((resolve, reject) => {
      const checkConnection = () => {
        if (mongoose.connection.readyState === 1) {
          isConnected = true;
          resolve();
        } else if (mongoose.connection.readyState === 0) {
          reject(new Error("MongoDB connection failed"));
        } else {
          setTimeout(checkConnection, 100);
        }
      };
      checkConnection();
    });
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable tidak diset");
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,  // Timeout 5 detik untuk select server
      socketTimeoutMS: 45000,           // Timeout 45 detik untuk socket
      connectTimeoutMS: 5000,           // Timeout 5 detik untuk initial connect
      maxPoolSize: 1,                   // Single connection untuk serverless
      minPoolSize: 1,
    });
    isConnected = true;
    console.log("MongoDB terkoneksi");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

// Start server untuk development lokal
export const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server berjalan di port ${PORT}`);
      console.log(`Health check: http://0.0.0.0:${PORT}/health`);
    });
  } catch (error) {
    console.error("Gagal start server. Cek MONGODB_URI di file .env");
    process.exit(1);
  }
};

export default app;
