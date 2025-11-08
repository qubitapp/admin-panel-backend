import 'dotenv/config'; // loads dotenv before anything else
import express from "express";
import { AppDataSource } from "./data.source.js";
import { User } from "./entities/User.js";
import { News } from "./entities/Post.js";
import dotenv from "dotenv";

dotenv.config();
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);

const app = express();
app.use(express.json());

AppDataSource.initialize().then(() => {
  console.log("✅ Data Source initialized");

  // Create user
  app.post("/users", async (req, res) => {
    const repo = AppDataSource.getRepository(User);
    const user = repo.create(req.body);
    const saved = await repo.save(user);
    res.json(saved);
  });

  // Create post linked to a user
  app.post("/posts", async (req, res) => {
    const { userId, ...data } = req.body;
    const userRepo = AppDataSource.getRepository(User);
    const postRepo = AppDataSource.getRepository(News);

    const user = await userRepo.findOneBy({ id: userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const post = postRepo.create({ ...data, user });
    const saved = await postRepo.save(post);
    res.json(saved);
  });

  // Get all posts with their user
  app.get("/posts", async (_, res) => {
    const posts = await AppDataSource.getRepository(News).find({
      relations: ["user"],
    });
    res.json(posts);
  });

  app.listen(3000, () => console.log("🚀 Server running on port 3000"));
});
