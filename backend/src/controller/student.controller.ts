import type { Request, Response } from "express";
import { Student } from "../models/Student";
import { MonthlyFee } from "../models/MonthlyFee";


export const addStudent = async (req: Request, res: Response) => {
  const student = await Student.create(req.body);
  res.json(student);
};

export const getStudents = async (_: Request, res: Response) => {
  const students = await Student.findAll();
  res.json(students);
};

export const getStudentById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const student = await Student.findByPk(id as string, {
    include: [
      {
        model: MonthlyFee,
        as: "fees",
        separate: true, 
        order: [["year", "DESC"], ["month", "DESC"]],
      },
    ],
  });

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(student);
};