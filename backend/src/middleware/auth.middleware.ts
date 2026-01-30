import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";

export interface AuthRequest extends Request {
  user?: { id: number; role: "ADMIN" | "STUDENT" };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "Unauthorized" });

  const token = auth.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid token" });
  const decoded = verifyToken(token);

  if (typeof decoded === "string")
    return res.status(401).json({ message: "Invalid token" });

  req.user = decoded as any;
  next();
};
