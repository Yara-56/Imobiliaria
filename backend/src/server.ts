import app from "./app"; // Removido .js
import connectDB from "./core/config/db"; // Removido .js
import { env } from "./config/env"; // Removido .js

let server: any;

const startServer = async () => {
  try {
    // Conexão com o MongoDB para o sistema da sua avó
    await connectDB();

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

// Graceful Shutdown (Essencial para Cybersecurity/Integridade de dados)
const shutdown = (signal: string) => {
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

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));