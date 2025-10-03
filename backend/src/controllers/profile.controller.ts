import { Request, Response } from "express";
import Book from "../models/book.model";
import Review from "../models/review.model";
import User from "../models/user.model";
import logger from "../logger/logger";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await User.findById(userId).select("name email");
    if (!user) return res.status(404).json({ message: "User not found" });

    const books = await Book.find({ user: userId }).select("title author description createdAt");
    const reviews = await Review.find({ user: userId })
      .populate("book", "title author")
      .select("rating text createdAt");

    res.json({
      user,
      books,
      reviews,
    });
  } catch (err) {
    logger.error("Get profile error " + (err as Error).message);
    res.status(500).json({ message: "Server error" });
  }
};
