import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/auth.js";
import todoRoutes from "./routes/todos.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Swagger configuration
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
        url: `http://localhost:${PORT}`,
        description: "Development server",
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

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/todo";

if (!process.env.MONGODB_URI) {
  console.warn(
    "⚠️  WARNING: MONGODB_URI not set, using default localhost connection"
  );
}

console.log(`Attempting to connect to MongoDB...`);
console.log(
  `MongoDB URI: ${mongoUri.replace(/\/\/([^:]+):([^@]+)@/, "//$1:***@")}`
); // Hide password in logs

mongoose
  .connect(mongoUri, {
    serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 API Documentation: http://0.0.0.0:${PORT}/api-docs`);
      console.log(`❤️  Health check: http://0.0.0.0:${PORT}/health`);
    });
  })
  .catch((error) => {
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
    console.error(
      "⚠️  Application will exit. Please check your MONGODB_URI environment variable."
    );
    process.exit(1);
  });

export default app;
