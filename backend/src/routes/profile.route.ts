import { Router } from "express";
import { getProfile } from "../controllers/profile.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.get("/", auth, getProfile);

export default router;
