import { Request, Response } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import logger from "../logger/logger";
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });
    const user = new User({ name, email, password });
    await user.save();
    const token = jwt.sign(
      { user: { id: user._id } },
      process.env.JWT_SECRET ?? "",
      { expiresIn: process.env.JWT_EXPIRES_IN ?? "7d" }
    );
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    logger.error("Register error " + (err as Error).message);
    res.status(500).json({ message: "Server error" });
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { user: { id: user._id } },
      process.env.JWT_SECRET || "",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    logger.error("Login error " + (err as Error).message);
    res.status(500).json({ message: "Server error" });
  }
};
