import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
dotenv.config();


const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  dialect: "mariadb",
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  models: [__dirname + "../models"],
});

export default sequelize;