import app from "./app";
import mongoose from "mongoose";
import { Server } from "http";
import config from "./app/config";
import { seed } from "./app/utils/seeding";

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.db_url as string);
    console.log('🛢 Database connected successfully');
    await seed();
    server = app.listen(config.port, () => {
      console.log(`🚀 Application is running on port ${config.port}`);
    });
  } catch (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  }
}

main();

process.on("unhandledRejection", () => {
  console.log("unhandleRejectioin is detected. shutting down...");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log("uncaughtException is detected. shutting down...");
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (server) {
    server.close(() => {
      console.log('Server closed due to SIGTERM');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on('SIGINT', () => {
  console.log('SIGINT received');
  if (server) {
    server.close(() => {
      console.log('Server closed due to SIGINT');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
