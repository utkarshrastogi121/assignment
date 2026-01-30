import type { Request, Response } from "express";
import { Student } from "../models/Student.js";
import { MonthlyFee } from "../models/MonthlyFee.js";

export const generateFees = async (req: Request, res: Response) => {
  const { month } = req.body;

  const students = await Student.findAll();
  let generated = 0;
  let skipped = 0;

  for (const s of students) {
    try {
      await MonthlyFee.create({
        studentId: s.id,
        month,
        tuitionFee: s.tuitionFee,
        transportFee: s.transportFee ?? 0,
        totalFee: s.tuitionFee + (s.transportFee ?? 0),
      });
      generated++;
    } catch {
      skipped++;
    }
  }

  res.json({ generated, skipped });
};
