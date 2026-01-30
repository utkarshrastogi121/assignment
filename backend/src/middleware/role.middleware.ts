import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.middleware";

export const roleMiddleware = (role: "ADMIN" | "STUDENT") => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== role)
      return res.status(403).json({ message: "Forbidden" });
    next();
  };
};
