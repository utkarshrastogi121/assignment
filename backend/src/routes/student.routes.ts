import { Router } from "express";
import { addStudent, getStudents } from "../controller/student.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware("ADMIN"));

router.post("/", addStudent);

router.get("/", getStudents);

export default router;
