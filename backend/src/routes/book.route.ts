import { Router } from "express";
import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/book.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.get("/", getBooks);
router.post("/", auth, createBook);
router.get("/:id", getBookById);
router.put("/:id", auth, updateBook);
router.delete("/:id", auth, deleteBook);

export default router;
