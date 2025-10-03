import { Request, Response } from "express";
import Review from "../models/review.model";
import Book from "../models/book.model";
import logger from "../logger/logger";
export const addReview = async (req: Request, res: Response) => {
  try {
    const { bookId, rating, text } = req.body;
    if (!bookId || !rating)
      return res.status(400).json({ message: "bookId and rating required" });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const existing = await Review.findOne({
      book: bookId,
      user: (req as any).user.id,
    });
    if (existing)
      return res.status(400).json({ message: "You already reviewed this book" });

    const review = new Review({
      book: bookId,
      user: (req as any).user.id,
      rating,
      text,
    });

    await review.save();

    // Populate user before sending response
    const populatedReview = await review.populate("user", "name email");

    res.status(201).json(populatedReview);
  } catch (err) {
    logger.error("Add review error " + (err as Error).message);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.user.toString() !== (req as any).user.id)
      return res.status(403).json({ message: "Not allowed" });
    await review.deleteOne();
    res.json({ message: "Review removed" });
  } catch (err) {
    logger.error("Delete review error " + (err as Error).message);
    res.status(500).json({ message: "Server error" });
  }
};
