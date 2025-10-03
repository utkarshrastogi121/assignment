import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
interface JwtPayload {
  user: { id: string };
}
export const auth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header)
    return res.status(401).json({ message: "No token, authorization denied" });
  const token = header.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as JwtPayload;
    // attach to request
    (req as any).user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid" });
  }
};
