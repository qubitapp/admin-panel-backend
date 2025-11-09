import express from "express";
import serverless from "serverless-http";
import { AppDataSource } from "./data.source.js";
import { User } from "./entities/User.js";

const app = express();
app.use(express.json());

const ensureDB = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
};

// Health check
app.get("/", (req, res) => {
  res.send("✅ Qubit Backend is running fine!");
});

// Create user
if (process.env.IS_OFFLINE) {
  app.listen(3000, () => console.log("✅ Local: http://localhost:3000"));
}

export const handler = serverless(app);
