import { Request, Response } from "express";
import Review from "../models/review.model";
import Book from "../models/book.model";
import logger from "../logger/logger";
import mongoose from "mongoose";

const fetchBookWithReviews = async (bookId: string) => {
  const book = await Book.findById(bookId).lean();
  if (!book) return null;

  const reviews = await Review.find({ book: bookId })
    .populate<{ user: { _id: string; name?: string } }>("user", "name")
    .sort({ createdAt: -1 })
    .lean();

  const reviewsWithStringId = reviews.map((r) => ({
    _id: r._id.toString(),
    rating: r.rating,
    text: r.text,
    user: r.user ? { _id: r.user._id.toString(), name: r.user.name } : null,
  }));

  const agg = await Review.aggregate([
    { $match: { book: new mongoose.Types.ObjectId(bookId) } },
    {
      $group: {
        _id: "$book",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    ...book,
    reviews: reviewsWithStringId,
    avgRating: agg.length ? agg[0].avgRating : null,
  };
};

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
      return res
        .status(400)
        .json({ message: "You already reviewed this book" });

    const review = new Review({
      book: bookId,
      user: (req as any).user.id,
      rating,
      text,
    });

    await review.save();

    const populatedReview = await review.populate("user", "name email");

    res.status(201).json(populatedReview);
  } catch (err) {
    logger.error("Add review error " + (err as Error).message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const { rating, text } = req.body;
    if (!rating && !text)
      return res.status(400).json({ message: "Rating or text required to update" });

    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Check if the logged-in user is the owner
    if (review.user?.toString() !== (req as any).user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // Update fields
    if (rating) review.rating = rating;
    if (text) review.text = text;

    await review.save();

    const populatedReview = await review.populate("user", "name email");
    res.json(populatedReview);
  } catch (err) {
    logger.error("Update review error " + (err as Error).message);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user && review.user.toString() !== (req as any).user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await review.deleteOne();
    res.json({ message: "Review removed" });
  } catch (err) {
    logger.error("Delete review error " + (err as Error).message);
    res.status(500).json({ message: "Server error" });
  }
};
