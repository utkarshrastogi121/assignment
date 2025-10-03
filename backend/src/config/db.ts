import mongoose from "mongoose";
import logger from "../logger/logger";
const connectDB = async (uri: string) => {
  if (!uri) {
    logger.error("MONGO_URI not set");
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    logger.info("MongoDB connected");
  } catch (err) {
    logger.error("DB connection error", (err as Error).message);
    console.log(err)
    process.exit(1);
  }
};
export default connectDB;
