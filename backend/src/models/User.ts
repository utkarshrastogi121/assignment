import {
  Table,
  Column,
  Model,
  DataType,
} from "sequelize-typescript";

@Table
export class User extends Model {
  @Column({ type: DataType.STRING, unique: true })
  email!: string;

  @Column(DataType.STRING)
  password!: string;

  @Column(DataType.ENUM("ADMIN", "STUDENT"))
  role!: "ADMIN" | "STUDENT";
}
