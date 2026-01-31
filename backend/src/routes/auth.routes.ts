import { Router } from "express";
import type { Request, Response } from "express";
import { login, register } from "../controller/auth.controller";
import { requestLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/register", requestLimiter, register);
router.post("/login", requestLimiter, login);

router.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

export default router;
