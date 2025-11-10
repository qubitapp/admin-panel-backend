import { Router, Request, Response } from "express";
import { AppDataSource } from "../data.source";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

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

// 🔐 LOGIN API
router.post("/login", async(req: Request, res: Response)=>{
  try{
    const { email, password } = req.body;
    if(!email || !password){
      return res.status(400).json({message:"Fields required"});
    }
    const user = await userRepo.findOne({ where:{email}});
    if(!user){
      return res.status(404).json({ message: "User not found"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
      return res.status(401).json({message: "Invalid credential"});
    }

    const token = jwt.sign(
      { id: user.id, email: user.email},
      process.env.JWT_SECRET as string,
      {expiresIn: "1h"}
    );
    return res.status(200).json({
      message: "Login Successfull",
      token, 
      user:{
        id: user.id,
        name: user.name,
        email: user.email,
      },

    });
  }
catch(error){
  console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error" });
}
});
export default router;
