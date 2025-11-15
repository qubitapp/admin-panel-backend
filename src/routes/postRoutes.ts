import express, { Request, Response } from "express";
import { News } from "../entities/Post.js";
import { AppDataSource } from "../data.source.js";
import { verifyToken } from "../middleWare/authMiddleWare.js";


const router = express.Router();

// ✅ POST /api/news — Add a new news record
router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      title,
      summary,
      source,
      imageLink,
      category,
      subCategory,
      typeOfNews,
      publisherName,
      dateOfNews,
      scoring,
      srNo,
      content,
      // userId, // 👈 Comes from frontend
    } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // if (!userId) {
    //   return res.status(400).json({ message: "userId is required" });
    // }

    // const userRepo = AppDataSource.getRepository(User);
    // const user = await userRepo.findOneBy({ id: userId });

    // if (!user) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    const newsRepo = AppDataSource.getRepository(News);

    const newNews = newsRepo.create({
      title,
      summary,
      source,
      imageLink,
      category,
      subCategory,
      typeOfNews,
      publisherName,
      dateOfNews,
      scoring,
      srNo,
      content,
      // user,
    });

    await newsRepo.save(newNews);

    return res.status(201).json({
      message: "News created successfully",
      data: newNews,
    });
  } catch (error) {
    console.error("Error adding news:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const newsRepo = AppDataSource.getRepository(News);
    const newsList = await newsRepo.find({
      order: { createdAt: "DESC" }, // newest first
    });

    return res.status(200).json({
      message: "News fetched successfully",
      data: newsList,
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
});

// ✅ GET /api/news/:id — Get a single news by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const newsRepo = AppDataSource.getRepository(News);

    const newsItem = await newsRepo.findOneBy({ id: Number(id) });

    if (!newsItem) {
      return res.status(404).json({ message: "News not found" });
    }

    return res.status(200).json({
      message: "News fetched successfully",
      data: newsItem,
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
});

// 🟢 PUT /api/news/:id — Update existing news
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      summary,
      source,
      imageLink,
      category,
      subCategory,
      typeOfNews,
      publisherName,
      dateOfNews,
      scoring,
      srNo,
      content,
    } = req.body;

    const newsRepo = AppDataSource.getRepository(News);
    const existingNews = await newsRepo.findOneBy({ id: Number(id) });

    if (!existingNews) {
      return res.status(404).json({ message: "News not found" });
    }

    // Update only provided fields
    Object.assign(existingNews, {
      title: title ?? existingNews.title,
      summary: summary ?? existingNews.summary,
      source: source ?? existingNews.source,
      imageLink: imageLink ?? existingNews.imageLink,
      category: category ?? existingNews.category,
      subCategory: subCategory ?? existingNews.subCategory,
      typeOfNews: typeOfNews ?? existingNews.typeOfNews,
      publisherName: publisherName ?? existingNews.publisherName,
      dateOfNews: dateOfNews ?? existingNews.dateOfNews,
      scoring: scoring ?? existingNews.scoring,
      srNo: srNo ?? existingNews.srNo,
      content: content ?? existingNews.content,
    });

    await newsRepo.save(existingNews);

    return res.status(200).json({
      message: "News updated successfully",
      data: existingNews,
    });
  } catch (error) {
    console.error("Error updating news:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
});

// 🔴 DELETE /api/news/:id — Delete a news record
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const newsRepo = AppDataSource.getRepository(News);

    const result = await newsRepo.delete(Number(id));

    if (result.affected === 0) {
      return res.status(404).json({ message: "News not found" });
    }

    return res.status(200).json({ message: "News deleted successfully" });
  } catch (error) {
    console.error("Error deleting news:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
});

export default router;
