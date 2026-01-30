import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
} from "sequelize-typescript";
import { MonthlyFee } from "./MonthlyFee.js";

@Table
export class Student extends Model {
  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.STRING)
  className!: string;

  @Column(DataType.INTEGER)
  rollNumber!: number;

  @Column(DataType.INTEGER)
  tuitionFee!: number;

  @Column(DataType.INTEGER)
  transportFee?: number;

  @HasMany(() => MonthlyFee)
  fees!: MonthlyFee[];
}
