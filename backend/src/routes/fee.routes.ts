import { Router } from "express";
import { generateFees } from "../controller/FeeGeneration.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

const router = Router();


router.use(authMiddleware);
router.use(roleMiddleware("ADMIN"));

router.post("/generate", generateFees);

export default router;
