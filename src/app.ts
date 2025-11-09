import express from "express";
import serverless from "serverless-http";
import { AppDataSource } from "./data.source.js";
import bodyParser from "body-parser";
import newsRoutes from "./routes/postRoutes.js";

const app = express();
app.use(bodyParser.json());

// ✅ Initialization flag
let isInitialized = false;

const initDB = async () => {
  if (!isInitialized) {
    try {
      await AppDataSource.initialize();
      isInitialized = true;
      console.log("🟢 Database connected successfully!");
    } catch (err) {
      console.error("🔴 Error initializing database:", err);
      throw err; // important so Lambda fails if DB is unreachable
    }
  }
};

// Health check
app.get("/", async (req, res) => {
  await initDB(); // ensure DB initialized even for health check
  res.send("✅ Qubit Backend is running fine!");
});

// News routes
app.use("/api/news", async (req, res, next) => {
  try {
    await initDB(); // ensure DB initialized before any request to /api/news
    next();
  } catch (err: unknown) {
    // Normalize unknown error to a string message
    let errorMessage = "Unknown error";
    if (err instanceof Error) {
      errorMessage = err.message;
    } else if (typeof err === "string") {
      errorMessage = err;
    } else {
      try {
        errorMessage = JSON.stringify(err);
      } catch {
        // keep default if non-serializable
      }
    }
    console.error("🔴 Error initializing database:", err);
    res.status(500).json({ message: "Internal server error", error: errorMessage });
  }
}, newsRoutes);

// Export Lambda handler
export const handler = serverless(app);
