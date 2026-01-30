import { Sequelize } from "sequelize-typescript";
import { User } from "../models/User.js";
import { Student } from "../models/Student.js";
import { MonthlyFee } from "../models/MonthlyFee.js";

export const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: "postgres",
  models: [User, Student, MonthlyFee],
  logging: false,
});
