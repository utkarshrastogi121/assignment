import { Request, Response, NextFunction } from "express";
import logger from "../logger/logger";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(err.stack || err.message || String(err));
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server error" });
};
