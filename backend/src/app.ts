import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.route";
import bookRoutes from "./routes/book.route";
import reviewRoutes from "./routes/review.route";
import profileRoutes from "./routes/profile.route";

import { errorHandler } from "./middleware/errorHandler";
import { rateLimiter } from "./middleware/rateLimiter";
import logger from "./logger/logger";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});
app.use(rateLimiter);

connectDB(process.env.MONGO_URI || "");

app.use("/auth", authRoutes);
app.use("/books", bookRoutes);
app.use("/review", reviewRoutes);
app.use("/profile", profileRoutes);


app.get("/", (_req, res) => res.send("Book Review API"));

app.use(errorHandler);

export default app;
