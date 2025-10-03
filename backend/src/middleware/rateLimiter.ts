import rateLimit from "express-rate-limit";

const windowMinutes = Number(process.env.RATE_LIMIT_WINDOW_MINUTES || "15");
const max = Number(process.env.RATE_LIMIT_MAX || "100");

export const rateLimiter = rateLimit({
  windowMs: windowMinutes * 60 * 1000,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later.",
});
