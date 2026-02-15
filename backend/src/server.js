import app from "./app.js";
import connectDB from "./core/config/db.js";
import { env } from "./config/env.js";

let server;

const startServer = async () => {
  try {
    // ===============================
    // Connect Database
    // ===============================
    await connectDB();

    // ===============================
    // Start HTTP Server
    // ===============================
    server = app.listen(env.port, () => {
      console.log(`🚀 Server running on port ${env.port}`);
      console.log(`🌍 Environment: ${env.nodeEnv}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// ===============================
// Graceful Shutdown Helpers
// ===============================

const shutdown = (signal) => {
  console.log(`👋 Received ${signal}. Closing server...`);

  if (server) {
    server.close(() => {
      console.log("💤 Server closed.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

// ===============================
// Process Events
// ===============================

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  shutdown("unhandledRejection");
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  shutdown("uncaughtException");
});