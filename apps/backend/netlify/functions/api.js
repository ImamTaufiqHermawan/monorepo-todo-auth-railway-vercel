// Netlify Serverless Function wrapper for Express app
import serverless from "serverless-http";
import app, { connectDB } from "../../src/app.js";

// Connect to MongoDB on cold start
let dbConnected = false;

const handler = serverless(app, {
  binary: ["image/*", "application/pdf"],
});

export const main = async (event, context) => {
  // Connect to MongoDB if not already connected
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Database connection failed",
          message: error.message,
        }),
      };
    }
  }

  // Call the serverless handler
  return handler(event, context);
};

// Export handler for Netlify
export { main as handler };

