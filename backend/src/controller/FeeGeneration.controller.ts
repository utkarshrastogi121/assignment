import type { Request, Response } from "express";
import { Student } from "../models/Student";
import { MonthlyFee } from "../models/MonthlyFee";

export const generateFees = async (req: Request, res: Response) => {
  const { month: monthStr } = req.body; // YYYY-MM
  const [year, month] = monthStr.split("-").map(Number);

  const existingFees = await MonthlyFee.findAll({
    where: { month, year },
  });

  if (existingFees.length > 0) {
    const totalAmount = existingFees.reduce(
      (sum, f) => sum + f.totalFee,
      0
    );

    return res.json({
      alreadyGenerated: true,
      month,
      year,
      generated: existingFees.length,
      totalAmount,
    });
  }

  const students = await Student.findAll();

  let generated = 0;
  let totalAmount = 0;

  for (const s of students) {
    const tuition = s.tuitionFee;
    const transport = s.transportFee ?? 0;
    const total = tuition + transport;

    await MonthlyFee.create({
      studentId: s.id,
      month,
      year,
      tuitionFee: tuition,
      transportFee: transport,
      totalFee: total,
    });

    generated++;
    totalAmount += total;
  }

  return res.json({
    alreadyGenerated: false,
    month,
    year,
    generated,
    totalAmount,
  });
};
