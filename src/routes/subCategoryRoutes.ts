import { Router } from "express";
import { AppDataSource } from "../data.source.js";
import { SubCategory } from "../entities/subCategory.js";
import { Category } from "../entities/Category.js";

const router = Router();

// Create SubCategory
router.post("/", async (req, res) => {
  try {
    const { name, description, categoryId } = req.body;

    const categoryRepo = AppDataSource.getRepository(Category);
    const category = await categoryRepo.findOneBy({ id: categoryId });

    if (!category) return res.status(404).json({ error: "Category not found" });

    const repo = AppDataSource.getRepository(SubCategory);
    const sub = repo.create({ name, description, category });

    const saved = await repo.save(sub);
    res.json(saved);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

// Get All Subcategories
router.get("/", async (req, res) => {
  const repo = AppDataSource.getRepository(SubCategory);
  const subs = await repo.find({ relations: ["category"] });
  res.json(subs);
});

export default router;
