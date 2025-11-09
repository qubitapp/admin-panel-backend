import { Router, Request, Response } from "express";
import { AppDataSource } from "../data.source";
import { User } from "../entities/User";

const router = Router();
const userRepo = AppDataSource.getRepository(User);

// ✅ GET all users
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userRepo.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// ✅ GET user by ID
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const user = await userRepo.findOneBy({ id });
    user ? res.json(user) : res.status(404).json({ message: "User not found" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

// ✅ CREATE user
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const user = userRepo.create(req.body);
    const result = await userRepo.save(user);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: "Error creating user", error });
  }
});

// ✅ UPDATE user
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    await userRepo.update(id, req.body);
    const updated = await userRepo.findOneBy({ id });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Error updating user", error });
  }
});

// ✅ DELETE user
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    await userRepo.delete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

export default router;
