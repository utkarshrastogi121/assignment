import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();


const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

export async function connectDB(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected Successfully!');
  } catch (error) {
    console.error('Database Connection Error:', error);
  }
}

connectDB();

export { sequelize };
