import app from "./app";
import "dotenv/config";
import { sequelize } from "./config/database";
import "./models/Student";
import "./models/MonthlyFee";
import "./models/User";
import "./models/index";

const PORT = process.env.PORT || 5000;

sequelize.sync();
app.listen(PORT, () => console.log(`Server running on ${PORT}`));