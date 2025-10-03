import { Request, Response } from "express";
import Book from "../models/book.model";
import Review from "../models/review.model";
import logger from "../logger/logger";
import mongoose from "mongoose";

interface PopulatedReview {
  _id: string;
  rating?: number;
  text?: string;
  user?: { _id: string; name?: string } | null;
}

export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, author, description, coverImage } = req.body;
    if (!title || !author)
      return res.status(400).json({ message: "Title and author required" });
    const book = new Book({
      title,
      author,
      description,
      coverImage,
      user: (req as any).user.id,
    });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    logger.error("Create book error " + (err as Error).message);
    res.status(500).json({ message: "Server error" });
  }
};
export const getBooks = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page || "1");
    const limit = 5;
    const skip = (page - 1) * limit;
    const books = await Book.aggregate([
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "book",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: {
            $cond: [
              { $gt: [{ $size: "$reviews" }, 0] },
              { $avg: "$reviews.rating" },
              null,
            ],
          },
          reviewsCount: { $size: "$reviews" },
        },
      },
      { $project: { reviews: 0 } },
    ]);
    const total = await Book.countDocuments();
    res.json({ books, page, totalPages: Math.ceil(total / limit), total });
  } catch (err) {
    logger.error("Get books error " + (err as Error).message);
    res.status(500).json({ message: "Server error" });
  }
};
export const getBookById = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(bookId))
      return res.status(400).json({ message: "Invalid id" });

    const book = await Book.findById(bookId).lean();
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Fetch reviews and populate user
    const reviews = await Review.find({ book: bookId })
      .populate<{ user: { _id: string; name?: string } }>("user", "name")
      .sort({ createdAt: -1 })
      .lean();

    // Convert _id to string
    const reviewsWithStringId: PopulatedReview[] = reviews.map((r) => ({
      _id: r._id.toString(),
      rating: r.rating,
      text: r.text,
      user: r.user
        ? { _id: r.user._id.toString(), name: r.user.name }
        : null,
    }));

    const agg = await Review.aggregate([
      { $match: { book: new mongoose.Types.ObjectId(bookId) } },
      { $group: { _id: "$book", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    res.json({
      ...book,
      reviews: reviewsWithStringId,
      avgRating: agg.length ? agg[0].avgRating : null,
    });
  } catch (err) {
    logger.error("Get book by id error " + (err as Error).message);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.user && book.user.toString() !== (req as any).user.id) return;
    res.status(403).json({ message: "Not allowed" });
    const { title, author, description, coverImage } = req.body;
    if (title) book.title = title;
    if (author) book.author = author;
    if (description) book.description = description;
    if (coverImage) book.coverImage = coverImage;
    await book.save();
    res.json(book);
  } catch (err) {
    logger.error("Update book error " + (err as Error).message);
    res.status(500).json({ message: "Server error" });
  }
};
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.user && book.user.toString() !== (req as any).user.id) return;
    res.status(403).json({ message: "Not allowed" });
    await book.deleteOne();
    await Review.deleteMany({ book: req.params.id });
    res.json({ message: "Book removed" });
  } catch (err) {
    logger.error("Delete book error " + (err as Error).message);
    res.status(500).json({ message: "Server error" });
  }
};
