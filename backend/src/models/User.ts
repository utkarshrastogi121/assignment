import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class User extends Model {
  declare id: number;
  declare email: string;
  declare password: string;
  declare role: "ADMIN" | "STUDENT";
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM("ADMIN", "STUDENT"),
      allowNull: false,
      defaultValue: "ADMIN",
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);
