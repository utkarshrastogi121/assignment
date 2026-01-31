import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import studentRoutes from "./routes/student.routes";
import feeRoutes from "./routes/fee.routes";

const app = express();
app.set("trust proxy", 1);  //for render deployment
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/fees", feeRoutes);

export default app;
