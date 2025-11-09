import { Router } from "express";
import { AppDataSource } from "../data.source";
import { News } from "../entities/Post";

const router = Router();
const postRepo = AppDataSource.getRepository(News);

// GET all posts
router.get("/", async (req, res) => {
  const posts = await postRepo.find();
  res.json(posts);
});

// GET post by ID
router.get("/:id", async (req, res) => {
  const post = await postRepo.findOneBy({ id: parseInt(req.params.id) });
  post ? res.json(post) : res.status(404).send("Post not found");
});

// CREATE new post
router.post("/", async (req, res) => {
  const post = postRepo.create(req.body);
  const result = await postRepo.save(post);
  res.status(201).json(result);
});

// UPDATE post
router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await postRepo.update(id, req.body);
  const updated = await postRepo.findOneBy({ id });
  res.json(updated);
});

// DELETE post
router.delete("/:id", async (req, res) => {
  await postRepo.delete(parseInt(req.params.id));
  res.status(204).send();
});

export default router;
