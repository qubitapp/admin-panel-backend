import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User.js";
import { News } from "./entities/Post.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: String(process.env.DB_USER).trim(),
  password: String(process.env.DB_PASSWORD).trim(),
  database: String(process.env.DB_NAME).trim(),
  synchronize: true,
  logging: false,
  entities: [News], // ✅ explicit entities
  ssl: { rejectUnauthorized: false },
});
