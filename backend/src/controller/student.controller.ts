import type { Request, Response } from "express";
import { Student } from "../models/Student";

export const addStudent = async (req: Request, res: Response) => {
  const student = await Student.create(req.body);
  res.json(student);
};

export const getStudents = async (_: Request, res: Response) => {
  const students = await Student.findAll();
  res.json(students);
};
