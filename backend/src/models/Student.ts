import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class Student extends Model {
  declare id: number;
  declare name: string;
  declare className: string;
  declare rollNumber: number;
  declare tuitionFee: number;
  declare transportFee: number | null;
}

Student.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    className: DataTypes.STRING,
    rollNumber: DataTypes.INTEGER,
    tuitionFee: DataTypes.INTEGER,
    transportFee: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "Student",
  }
);
