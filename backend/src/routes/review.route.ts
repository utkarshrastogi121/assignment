import { Router } from "express";
import { addReview, deleteReview } from "../controllers/review.controller";
import { auth } from "../middleware/auth";
const router = Router();
router.post("/:id", auth, addReview);
router.delete("/:id", auth, deleteReview);
export default router;
