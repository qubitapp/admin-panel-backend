import express from "express";
import serverless from "serverless-http";
import { AppDataSource } from "./data.source.js";
import bodyParser from "body-parser";
import newsRoutes from "./routes/postRoutes.js";

const app = express();
app.use(bodyParser.json());
app.use("/api/news", newsRoutes);

const ensureDB = async () => {
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize();
      console.log("🟢 Database connected successfully!");
    } catch (err) {
      console.error("🔴 Error initializing database:", err);
    }
  }
};

// Initialize DB before first request
 ensureDB().catch((err) => console.error(err));

// Health check
app.get("/", (req, res) => {
  res.send("✅ Qubit Backend is running fine!");
});

export const handler = serverless(app);
