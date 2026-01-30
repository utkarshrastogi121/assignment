import { Student } from "./Student";
import { MonthlyFee } from "./MonthlyFee";

Student.hasMany(MonthlyFee, {
  foreignKey: "studentId",
  as: "fees",
});

MonthlyFee.belongsTo(Student, {
  foreignKey: "studentId",
  as: "student",
});
