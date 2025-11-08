import express from "express";
import serverless from "serverless-http";
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();


// PostgreSQL pool connection
console.log("DB Host from env:", process.env.DB_HOST);
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }, // <— important for AWS RDS
});
console.log("DB Host:", process.env.DB_HOST);

const app = express();

// Simple API endpoint
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ time: result.rows[0].now });
  } catch (err) {
    if (err instanceof Error) {
      console.error("DB connection failed:", err.message);
    } else {
      // err may be unknown (string, object, etc.) — log it safely
      console.error("DB connection failed:", err);
    }
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Export Express app as Lambda handler
export const handler = serverless(app);
