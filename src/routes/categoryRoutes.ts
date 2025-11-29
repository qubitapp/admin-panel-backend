import { Router } from "express";
import { AppDataSource } from "../data.source.js";
import { Category } from "../entities/Category.js";

const router = Router();

// Create Category
router.post("/", async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Category);
    const category = repo.create(req.body);
    const saved = await repo.save(category);
    res.json(saved);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

// Get All Categories with Subcategories
router.get("/", async (req, res) => {
  const repo = AppDataSource.getRepository(Category);
  const categories = await repo.find({ relations: ["subCategories"] });
  res.json(categories);
});

export default router;
