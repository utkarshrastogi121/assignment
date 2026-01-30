import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import { Student } from "./Student.js";

@Table({
  indexes: [
    {
      unique: true,
      fields: ["studentId", "month"],
    },
  ],
})
export class MonthlyFee extends Model {
  @ForeignKey(() => Student)
  @Column(DataType.INTEGER)
  studentId!: number;

  @Column(DataType.STRING)
  month!: string;

  @Column(DataType.INTEGER)
  tuitionFee!: number;

  @Column(DataType.INTEGER)
  transportFee!: number;

  @Column(DataType.INTEGER)
  totalFee!: number;

  @Column({ defaultValue: "PENDING" })
  status!: string;
}
