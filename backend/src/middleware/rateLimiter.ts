import rateLimit from "express-rate-limit";

export const requestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many requests, try again later",
});
