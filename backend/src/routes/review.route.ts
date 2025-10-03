import { Router } from "express";
import { addReview,updateReview, deleteReview } from "../controllers/review.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/:id", auth, addReview);
router.put("/:id", auth, updateReview);
router.delete("/:id", auth, deleteReview);

export default router;
