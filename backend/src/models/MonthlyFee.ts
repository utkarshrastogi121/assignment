import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class MonthlyFee extends Model {
  declare id: number;
  declare studentId: number;
  declare month: number; // 1–12
  declare year: number;
  declare tuitionFee: number;
  declare transportFee: number;
  declare totalFee: number;
  declare status: string;
}


MonthlyFee.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tuitionFee: DataTypes.INTEGER,
    transportFee: DataTypes.INTEGER,
    totalFee: DataTypes.INTEGER,
    status: {
      type: DataTypes.STRING,
      defaultValue: "PENDING",
    },
  },
  {
    sequelize,
    modelName: "MonthlyFee",
    indexes: [
      {
        unique: true,
        fields: ["studentId", "month", "year"],
      },
    ],
  }
);

